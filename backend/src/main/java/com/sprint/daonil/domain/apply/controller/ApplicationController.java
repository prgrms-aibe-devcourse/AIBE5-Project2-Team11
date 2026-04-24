package com.sprint.daonil.domain.apply.controller;

import com.sprint.daonil.domain.apply.dto.ApplicationCreateRequestDto;
import com.sprint.daonil.domain.apply.dto.ApplicationDetailResponseDto;
import com.sprint.daonil.domain.apply.entity.Application;
import com.sprint.daonil.domain.apply.service.ApplicationService;
import com.sprint.daonil.domain.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/jobs")
public class ApplicationController {

    private final ApplicationService applicationService;

    // 공고 지원
    @PostMapping("/{job_posting_id}/application")
    public ResponseEntity<Map<String, Object>> apply(
            @PathVariable("job_posting_id") Long jobPostingId,
            @RequestBody ApplicationCreateRequestDto request
    ) {
        // 접근 사용자 정보
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        Long createdApplicationId = applicationService.apply(jobPostingId, request, loginId);

        return ResponseEntity.status(201)
                .body(Map.of("message", "공고 지원 완료", "applicationId", createdApplicationId));
    }


    // 지원 목록 조회
    @GetMapping("/application")
    public ResponseEntity<?> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status
    ) {
        // 접근 사용자 정보
        String loginId = SecurityContextHolder.getContext().getAuthentication().getName();

        return ResponseEntity.ok( applicationService.getMyApplications(loginId, page, size, status) );
    }


    // 지원 상세 조회
    @GetMapping("/application/{application_id}")
    public ResponseEntity<ApplicationDetailResponseDto> getDetail(@PathVariable("application_id") Long applicationId) {
        // 접근 사용자 정보
        String loginId = SecurityContextHolder.getContext().getAuthentication().getName();


        return ResponseEntity.ok(applicationService.getMyApplicationDetail(applicationId, loginId)
        );
    }

    // 지원 취소
    @DeleteMapping("/application/{application_id}")
    public ResponseEntity<Map<String, Object>> cancel(@PathVariable("application_id") Long applicationId) {
        // 접근 사용자 정보
        String loginId = SecurityContextHolder.getContext().getAuthentication().getName();

        Long deletedApplicationId = applicationService.cancelApplication(applicationId, loginId);

        return ResponseEntity.ok(Map.of("message", "지원 취소 완료", "applicationId", deletedApplicationId));
    }
}