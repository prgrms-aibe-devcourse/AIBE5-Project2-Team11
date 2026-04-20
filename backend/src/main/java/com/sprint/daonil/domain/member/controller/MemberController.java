package com.sprint.daonil.domain.member.controller;

import com.sprint.daonil.config.JwtUtil;
import com.sprint.daonil.domain.company.dto.CompanySignupRequestDto;
import com.sprint.daonil.domain.member.dto.ChangePasswordRequestDto;
import com.sprint.daonil.domain.member.dto.LoginRequestDto;
import com.sprint.daonil.domain.member.dto.SignupRequestDto;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody SignupRequestDto requestDto) {
        try {
            Member member = memberService.signup(requestDto);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다.");
            response.put("memberId", member.getMemberId());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/signup/company")
    public ResponseEntity<Map<String, Object>> companySignup(@RequestBody CompanySignupRequestDto requestDto) {
        try {
            Member member = memberService.companySignup(requestDto);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "기업회원 가입이 완료되었습니다.");
            response.put("memberId", member.getMemberId());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequestDto requestDto) {
        try {
            Member member = memberService.login(requestDto);
            String token = memberService.generateToken(member);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "로그인에 성공했습니다.");
            response.put("memberId", member.getMemberId());
            response.put("loginId", member.getLoginId());
            response.put("name", member.getName());
            response.put("role", member.getRole().toString());
            response.put("token", token);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentMember() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth == null || !auth.isAuthenticated()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "인증되지 않은 사용자입니다.");
                return ResponseEntity.status(401).body(response);
            }

            String loginId = auth.getName();
            Member member = memberService.getMemberByLoginId(loginId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "사용자 정보 조회 성공");
            response.put("memberId", member.getMemberId());
            response.put("loginId", member.getLoginId());
            response.put("email", member.getEmail());
            response.put("name", member.getName());
            response.put("phoneNumber", member.getPhoneNumber());
            response.put("address", member.getAddress());
            response.put("role", member.getRole().toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public List<Member> getMembers() {
        return memberService.getAllMembers();
    }

    @GetMapping("/check-loginId/{loginId}")
    public ResponseEntity<Map<String, Object>> checkLoginId(@PathVariable String loginId) {
        boolean exists = memberService.existsByLoginId(loginId);

        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("available", !exists);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Map<String, Object>> checkEmail(@PathVariable String email) {
        boolean exists = memberService.existsByEmail(email);

        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("available", !exists);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody ChangePasswordRequestDto requestDto) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth == null || !auth.isAuthenticated()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "인증되지 않은 사용자입니다.");
                return ResponseEntity.status(401).body(response);
            }

            // 새 비밀번호 확인
            if (!requestDto.getNewPassword().equals(requestDto.getConfirmPassword())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            String loginId = auth.getName();
            memberService.changePassword(loginId, requestDto.getCurrentPassword(), requestDto.getNewPassword());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "비밀번호가 변경되었습니다.");

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "비밀번호 변경 중 오류가 발생했습니다.");

            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<Map<String, Object>> deleteAccount() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth == null || !auth.isAuthenticated()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "인증되지 않은 사용자입니다.");
                return ResponseEntity.status(401).body(response);
            }

            String loginId = auth.getName();
            memberService.deleteMember(loginId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원탈퇴가 완료되었습니다.");

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "회원탈퇴 중 오류가 발생했습니다.");

            return ResponseEntity.badRequest().body(response);
        }
    }
}