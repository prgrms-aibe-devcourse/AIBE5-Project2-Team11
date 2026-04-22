package com.sprint.daonil.domain.member.controller;

import com.sprint.daonil.config.JwtUtil;
import com.sprint.daonil.domain.company.dto.CompanySignupRequestDto;
import com.sprint.daonil.domain.member.dto.ChangePasswordRequestDto;
import com.sprint.daonil.domain.member.dto.LoginRequestDto;
import com.sprint.daonil.domain.member.dto.SignupRequestDto;
import com.sprint.daonil.domain.member.dto.UpdateMemberInfoRequestDto;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.enumtype.Role;
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

    @PutMapping("/update-info")
    public ResponseEntity<Map<String, Object>> updateMemberInfo(@RequestBody UpdateMemberInfoRequestDto requestDto) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth == null || !auth.isAuthenticated()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "인증되지 않은 사용자입니다.");
                return ResponseEntity.status(401).body(response);
            }

            String loginId = auth.getName();
            Member updatedMember = memberService.updateMemberInfo(loginId, requestDto.getName(), requestDto.getPhoneNumber(), requestDto.getAddress());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원 정보가 수정되었습니다.");
            response.put("name", updatedMember.getName());
            response.put("phoneNumber", updatedMember.getPhoneNumber());
            response.put("address", updatedMember.getAddress());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "회원 정보 수정 중 오류가 발생했습니다.");

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * OAuth2 콜백 - JWT 토큰 검증 및 회원 정보 반환
     */
    @GetMapping("/oauth2/callback")
    public ResponseEntity<Map<String, Object>> oauth2Callback(
            @RequestParam String token,
            @RequestParam Long memberId,
            @RequestParam String provider) {
        try {
            if (!jwtUtil.validateToken(token)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "유효하지 않은 토큰입니다.");
                return ResponseEntity.badRequest().body(response);
            }

            Member member = memberService.getMemberById(memberId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OAuth2 로그인 성공");
            response.put("token", token);
            response.put("memberId", member.getMemberId());
            response.put("loginId", member.getLoginId());
            response.put("email", member.getEmail());
            response.put("name", member.getName());
            response.put("role", member.getRole().toString());
            response.put("provider", provider);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "OAuth2 콜백 처리 중 오류가 발생했습니다.");

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 소셜 계정 조회
     */
    @GetMapping("/social-account/{provider}")
    public ResponseEntity<Map<String, Object>> getSocialAccount(
            @PathVariable String provider) {
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
            boolean hasAccount = memberService.hasSocialAccount(member.getMemberId(), provider);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("linked", hasAccount);
            response.put("provider", provider);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "소셜 계정 조회 중 오류가 발생했습니다.");

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 소셜 계정 해제
     */
    @DeleteMapping("/unlink-social-account/{provider}")
    public ResponseEntity<Map<String, Object>> unlinkSocialAccount(
            @PathVariable String provider) {
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
            memberService.unlinkSocialAccount(member.getMemberId(), provider);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", provider + " 계정 연결이 해제되었습니다.");

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "소셜 계정 해제 중 오류가 발생했습니다.");

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 소셜 로그인 후 역할 및 추가 정보 설정
     * PENDING 상태의 회원이 추가 정보를 입력하고 역할을 선택할 때 사용
     */
    @PostMapping("/complete-registration")
    public ResponseEntity<Map<String, Object>> completeRegistration(
            @RequestBody Map<String, String> requestBody) {
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

            // PENDING 상태 확인
            if (member.getRole() != Role.PENDING) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "이미 역할이 설정된 회원입니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 역할 설정
            String roleStr = requestBody.get("role");
            if (roleStr == null || roleStr.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "역할(JOB_SEEKER 또는 COMPANY)을 선택해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            Role newRole;
            try {
                newRole = Role.valueOf(roleStr.toUpperCase());
                if (newRole == Role.PENDING) {
                    throw new IllegalArgumentException("PENDING은 선택 불가합니다.");
                }
            } catch (IllegalArgumentException e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "유효하지 않은 역할입니다. JOB_SEEKER 또는 COMPANY를 선택하세요.");
                return ResponseEntity.badRequest().body(response);
            }

            String phoneNumber = requestBody.get("phoneNumber");
            String address = requestBody.get("address");

            Member updatedMember = memberService.completeSocialMemberRegistration(
                    member.getMemberId(),
                    newRole,
                    phoneNumber,
                    address
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원 정보 설정이 완료되었습니다.");
            response.put("memberId", updatedMember.getMemberId());
            response.put("role", updatedMember.getRole().toString());
            response.put("name", updatedMember.getName());
            response.put("phoneNumber", updatedMember.getPhoneNumber());
            response.put("address", updatedMember.getAddress());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "회원 정보 설정 중 오류가 발생했습니다.");

            return ResponseEntity.badRequest().body(response);
        }
    }
}