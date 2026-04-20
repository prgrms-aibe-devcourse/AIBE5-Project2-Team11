package com.sprint.daonil.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret:your-secret-key-should-be-at-least-256-bits-long-for-security-purposes}")
    private String secretKey;

    @Value("${jwt.expiration:86400000}") // 24 hours in milliseconds
    private long tokenExpiration;

    public String generateToken(Long memberId, String loginId) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + tokenExpiration);

        return Jwts.builder()
                .subject(memberId.toString())
                .claim("loginId", loginId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Long getMemberIdFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Long.parseLong(claims.getSubject());
        } catch (JwtException | NumberFormatException e) {
            log.error("JWT 파싱 오류: {}", e.getMessage());
            return null;
        }
    }

    public String getLoginIdFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.get("loginId", String.class);
        } catch (JwtException e) {
            log.error("JWT 파싱 오류: {}", e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SecurityException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    public String extractTokenFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}

