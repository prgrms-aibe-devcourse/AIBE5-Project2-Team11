package com.sprint.daonil.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oauth2AuthenticationFailureHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//            .csrf(csrf -> csrf.disable())
//            .authorizeHttpRequests(authz -> authz
//                .requestMatchers("/members/**").permitAll()
//                .anyRequest().authenticated()
//            );
//
//        return http.build();
//    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // 정적 리소스 허용
                .requestMatchers("/favicon.ico").permitAll()
                .requestMatchers("/static/**").permitAll()
                .requestMatchers("/public/**").permitAll()
                // 공개 회원 관련 엔드포인트
                .requestMatchers("/members/signup", "/members/signup/company", "/members/login").permitAll()
                .requestMatchers("/members/check-loginId/**", "/members/check-email/**").permitAll()
                // OAuth2 엔드포인트
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/login/oauth2/**").permitAll()
                // 공개 API
                .requestMatchers("/api/notices/**").permitAll()
                .requestMatchers("/api/notices").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                // 기업회원 전용
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/jobs").hasRole("COMPANY")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/jobs/**").hasRole("COMPANY")
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/jobs/**").hasRole("COMPANY")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/jobs/company").hasRole("COMPANY")
                // 공개 채용공고
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/jobs/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/jobs").permitAll()
                // 인증 필수
                .requestMatchers("/api/bookmarks/**").authenticated()
                .requestMatchers("/members/me").authenticated()
                .requestMatchers("/members/complete-registration").authenticated()
                .requestMatchers("/members/social-account/**").authenticated()
                .requestMatchers("/members/unlink-social-account/**").authenticated()
                // 나머지는 모두 허용
                .anyRequest().permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oauth2AuthenticationSuccessHandler)
                .failureHandler(oauth2AuthenticationFailureHandler)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

//    /***
//     *  테스트 용
//     ***/
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(authz -> authz
//                        .anyRequest().permitAll() //  모든 요청 일단 다 통과
//                );
//
//        return http.build();
//    }
}
