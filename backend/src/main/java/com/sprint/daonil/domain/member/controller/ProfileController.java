package com.sprint.daonil.domain.member.controller;

import com.sprint.daonil.domain.member.dto.ProfileRequestDto;
import com.sprint.daonil.domain.member.dto.ProfileResponseDto;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.service.MemberService;
import com.sprint.daonil.domain.member.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final MemberService memberService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getProfile() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth == null || !auth.isAuthenticated()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "인증되지 않은 사용자입니다.");
                return ResponseEntity.status(401).body(response);
            }

            // Authentication에서 loginId 추출
            String loginId = auth.getName();
            Member member = memberService.getMemberByLoginId(loginId);

            ProfileResponseDto profileDto = profileService.getProfile(member.getMemberId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "프로필 조회 성공");
            response.put("data", profileDto);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> saveProfile(@RequestBody ProfileRequestDto requestDto) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth == null || !auth.isAuthenticated()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "인증되지 않은 사용자입니다.");
                return ResponseEntity.status(401).body(response);
            }

            // Authentication에서 loginId 추출
            String loginId = auth.getName();
            Member member = memberService.getMemberByLoginId(loginId);

            ProfileResponseDto profileDto = profileService.saveProfile(member.getMemberId(), requestDto);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "프로필 저장 성공");
            response.put("data", profileDto);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }
}

