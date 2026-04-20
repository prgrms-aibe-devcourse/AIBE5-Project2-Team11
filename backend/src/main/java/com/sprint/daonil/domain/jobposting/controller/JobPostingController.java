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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jobs") // API 관례상 /api 경로 추가 권장
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    // 채용공고 필터 검색
    @GetMapping
    public ResponseEntity<Page<JobPostingResponseDto>> getJobPostings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String jobCategory,
            @RequestParam(required = false) String workRegion,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<JobPostingResponseDto> result = jobPostingService.getJobPostings(keyword, jobCategory, workRegion, pageable);
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
     * 현재는 @RequestParam으로 companyId를 받지만, 이후 시큐리티 도입 시 인증 객체에서 추출하도록 변경 필요
     */
    @PostMapping
    public ResponseEntity<JobPostingResponseDto> createJobPosting(
            @RequestParam Long companyId,
            @RequestBody JobPostingRequestDto requestDto) {

        JobPostingResponseDto result = jobPostingService.createJobPosting(companyId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * 채용공고 수정
     */
    @PutMapping("/{jobPostingId}")
    public ResponseEntity<JobPostingResponseDto> updateJobPosting(
            @RequestParam Long companyId,
            @PathVariable Long jobPostingId,
            @RequestBody JobPostingRequestDto requestDto) {

        JobPostingResponseDto result = jobPostingService.updateJobPosting(companyId, jobPostingId, requestDto);
        return ResponseEntity.ok(result);
    }

    /**
     * 채용공고 마감
     */
    @PatchMapping("/{jobPostingId}/close")
    public ResponseEntity<JobPostingResponseDto> closeJobPosting(
            @RequestParam Long companyId,
            @PathVariable Long jobPostingId) {

        JobPostingResponseDto result = jobPostingService.closeJobPosting(companyId, jobPostingId);
        return ResponseEntity.ok(result);
    }
}