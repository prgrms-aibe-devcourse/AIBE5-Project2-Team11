package com.sprint.daonil.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.entity.SocialAccount;
import com.sprint.daonil.domain.member.enumtype.Role;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import com.sprint.daonil.domain.member.repository.SocialAccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private SocialAccountRepository socialAccountRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        try {
            DefaultOAuth2User oauth2User = (DefaultOAuth2User) authentication.getPrincipal();

            String provider = extractProvider(request);
            Map<String, Object> attributes = oauth2User.getAttributes();

            log.info("OAuth2 로그인 성공 - Provider: {}, Attributes: {}", provider, attributes);

            // provider별 사용자 정보 추출
            String providerUserId = null;
            String email = null;
            String name = null;
            String profileImageUrl = null;

            if ("google".equalsIgnoreCase(provider)) {
                providerUserId = (String) attributes.get("sub");
                email = (String) attributes.get("email");
                name = (String) attributes.get("name");
                profileImageUrl = (String) attributes.get("picture");
            } else if ("naver".equalsIgnoreCase(provider)) {
                Map<String, Object> response_data = (Map<String, Object>) attributes.get("response");
                if (response_data != null) {
                    providerUserId = (String) response_data.get("id");
                    email = (String) response_data.get("email");
                    name = (String) response_data.get("name");
                    profileImageUrl = (String) response_data.get("profile_image");
                }
            }

            log.info("추출된 정보 - ProviderId: {}, Email: {}, Name: {}", providerUserId, email, name);

            // 기존 소셜 계정 확인 - ✅ Fetch Join 사용 (LAZY 로딩 문제 해결)
            Optional<SocialAccount> existingSocialAccount = socialAccountRepository
                    .findByProviderAndProviderUserIdWithMember(provider, providerUserId);

            Member member;

             if (existingSocialAccount.isPresent()) {
                 // 기존 소셜 계정 - 기존 회원 로그인
                 // ✅ Fetch Join으로 Member를 이미 로드했으므로 안전하게 접근 가능
                 member = existingSocialAccount.get().getMember();
                 log.info("기존 소셜 회원 로그인 - MemberId: {}", member.getMemberId());
            } else {
                // 새로운 소셜 계정 - 회원가입 후 로그인

                // 이메일로 기존 회원 확인 (같은 이메일의 일반 회원이 있는지)
                Optional<Member> existingMemberByEmail = memberRepository.findByEmail(email);

                if (existingMemberByEmail.isPresent()) {
                    // 이메일이 같은 기존 회원이 있으면 그 회원으로 소셜 계정 연결
                    member = existingMemberByEmail.get();
                    log.info("기존 회원에 소셜 계정 연결 - MemberId: {}", member.getMemberId());
                } else {
                    // 새로운 회원 생성
                    member = Member.builder()
                            .email(email != null ? email : "oauth2_" + provider + "_" + providerUserId + "@daonil.com")
                            .loginId(provider + "_" + providerUserId)  // loginId는 소셜 제공자와 ID 조합
                            .password(null)  // 소셜 로그인은 비밀번호 없음
                            .name(name != null ? name : "User")
                            .phoneNumber(null)
                            .address(null)
                            .role(Role.PENDING)  // 소셜 로그인 후 추가 정보 입력 전 PENDING 상태
                            .isDeleted(false)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();
                    
                    member = memberRepository.save(member);
                    log.info("새로운 소셜 회원 생성 - MemberId: {}", member.getMemberId());
                }

                // 소셜 계정 정보 저장
                SocialAccount socialAccount = SocialAccount.builder()
                        .member(member)
                        .provider(provider)
                        .providerUserId(providerUserId)
                        .email(email)
                        .name(name)
                        .profileImageUrl(profileImageUrl)
                        .linkedAt(LocalDateTime.now())
                        .build();

                socialAccountRepository.save(socialAccount);
                log.info("소셜 계정 저장 완료");
            }

            // JWT 토큰 생성
            String token = jwtUtil.generateToken(member.getMemberId(), member.getLoginId());

            log.info("JWT 토큰 생성 완료");

            // 리다이렉트 URL 생성 (프론트엔드로 토큰 전달)
            // ✅ 한글 문제 완전 해결: name은 제거 (JWT 안에 포함됨)
            String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth2/callback")
                    .queryParam("token", token)
                    .queryParam("memberId", member.getMemberId())
                    .queryParam("loginId", member.getLoginId())
                    .queryParam("role", member.getRole().toString())
                    .queryParam("provider", provider)
                    .build(true)  // URL 인코딩
                    .toUriString();

            log.info("리다이렉트 URL: {}", redirectUrl);

            this.setAlwaysUseDefaultTargetUrl(true);
            this.setDefaultTargetUrl(redirectUrl);

            super.onAuthenticationSuccess(request, response, authentication);
        } catch (Exception e) {
            log.error("OAuth2 로그인 처리 중 오류 발생: ", e);
            e.printStackTrace();  // 콘솔에 전체 스택 트레이스 출력
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Unknown error";
            try {
                response.sendRedirect("http://localhost:5173/login?error=" + java.net.URLEncoder.encode(errorMessage, "UTF-8"));
            } catch (Exception redirectErr) {
                log.error("리다이렉트 실패: ", redirectErr);
            }
        }
    }

    private String extractProvider(HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        if (requestURI.contains("google")) {
            return "google";
        } else if (requestURI.contains("naver")) {
            return "naver";
        }
        return "unknown";
    }
}

