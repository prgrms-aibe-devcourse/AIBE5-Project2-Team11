package com.sprint.daonil.domain.jobposting.controller;

import com.sprint.daonil.domain.jobposting.dto.JobPostingRequestDto;
import com.sprint.daonil.domain.jobposting.dto.JobPostingResponseDto;
import com.sprint.daonil.domain.jobposting.service.JobPostingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs") // API 관례상 /api 경로 추가 권장
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    // 채용공고 필터 검색
    @GetMapping
    public ResponseEntity<Page<JobPostingResponseDto>> getJobPostings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String jobCategory,
            @RequestParam(required = false) String workRegion,
            @RequestParam(required = false) String envBothHands,
            @RequestParam(required = false) String envEyesight,
            @RequestParam(required = false) String envHandWork,
            @RequestParam(required = false) String envLiftPower,
            @RequestParam(required = false) String envLstnTalk,
            @RequestParam(required = false) String envStndWalk,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<JobPostingResponseDto> result = jobPostingService.getJobPostings(
            keyword, jobCategory, workRegion,
            envBothHands, envEyesight, envHandWork, envLiftPower, envLstnTalk, envStndWalk,
            pageable);
        return ResponseEntity.ok(result);
    }

    /**
     * 특정 회사 채용공고 전체 조회
     */
    @GetMapping("/company")
    public ResponseEntity<Page<JobPostingResponseDto>> getJobPostingsByCompany(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<JobPostingResponseDto> result = jobPostingService.getJobPostingsByCompanyId(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(result);
    }

    /**
     * 채용공고 상세 조회
     */
    @GetMapping("/{jobPostingId}")
    public ResponseEntity<JobPostingResponseDto> getJobPostingDetail(
            @PathVariable Long jobPostingId) {

        JobPostingResponseDto result = jobPostingService.getJobPostingDetail(jobPostingId);
        return ResponseEntity.ok(result);
    }

    /**
     * 채용공고 등록
     */
    @PostMapping
    public ResponseEntity<JobPostingResponseDto> createJobPosting(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody JobPostingRequestDto requestDto) {

        JobPostingResponseDto result = jobPostingService.createJobPosting(userDetails.getUsername(), requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * 채용공고 수정
     */
    @PutMapping("/{jobPostingId}")
    public ResponseEntity<JobPostingResponseDto> updateJobPosting(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long jobPostingId,
            @RequestBody JobPostingRequestDto requestDto) {

        JobPostingResponseDto result = jobPostingService.updateJobPosting(userDetails.getUsername(), jobPostingId, requestDto);
        return ResponseEntity.ok(result);
    }

    /**
     * 채용공고 마감
     */
    @PatchMapping("/{jobPostingId}/close")
    public ResponseEntity<JobPostingResponseDto> closeJobPosting(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long jobPostingId) {

        JobPostingResponseDto result = jobPostingService.closeJobPosting(userDetails.getUsername(), jobPostingId);
        return ResponseEntity.ok(result);
    }
}