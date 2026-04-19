package com.sprint.daonil.domain.jobposting.service;

import com.sprint.daonil.domain.company.entity.Company;
import com.sprint.daonil.domain.company.repository.CompanyRepository;
import com.sprint.daonil.domain.jobposting.dto.JobPostingRequestDto;
import com.sprint.daonil.domain.jobposting.dto.JobPostingResponseDto;
import com.sprint.daonil.domain.jobposting.entity.JobPosting;
import com.sprint.daonil.domain.jobposting.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final CompanyRepository companyRepository;

    // 채용공고 목록 조회 (다중 필터 + 페이징)
    @Transactional(readOnly = true)
    public Page<JobPostingResponseDto> getJobPostings(String keyword, String jobCategory,
                                                      String workRegion, Pageable pageable) {
        return jobPostingRepository.findByFilters(keyword, jobCategory, workRegion, false, pageable)
                .map(JobPostingResponseDto::fromEntity);
    }

    // 채용공고 상세 조회 (조회수 증가 포함)
    public JobPostingResponseDto getJobPostingDetail(Long jobPostingId) {
        // 1. DB 단에서 직접 조회수 증가 (동시성 문제 방지)
        jobPostingRepository.incrementViewCount(jobPostingId);

        // 2. 증가된 상태의 엔티티 조회
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new IllegalArgumentException("채용공고를 찾을 수 없습니다."));

        return JobPostingResponseDto.fromEntity(jobPosting);
    }

    // 채용공고 등록 (Builder 패턴 적용)
    public JobPostingResponseDto createJobPosting(Long companyId, JobPostingRequestDto requestDto) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("회사를 찾을 수 없습니다."));

        JobPosting jobPosting = requestDto.toEntity(company);

        JobPosting savedJobPosting = jobPostingRepository.save(jobPosting);

        return JobPostingResponseDto.fromEntity(savedJobPosting);
    }

    // 채용공고 수정 (Dirty Checking 및 권한 검증)
    public JobPostingResponseDto updateJobPosting(Long companyId, Long jobPostingId, JobPostingRequestDto requestDto) {
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new IllegalArgumentException("채용공고를 찾을 수 없습니다."));

        validateCompanyAccess(jobPosting, companyId);

        // 엔티티의 비즈니스 메서드 호출. 트랜잭션 종료 시 알아서 UPDATE 쿼리 발생
        jobPosting.update(requestDto);

        return JobPostingResponseDto.fromEntity(jobPosting);
    }

    // 채용공고 마감 (Dirty Checking 및 권한 검증)
    public JobPostingResponseDto closeJobPosting(Long companyId, Long jobPostingId) {
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new IllegalArgumentException("채용공고를 찾을 수 없습니다."));

        validateCompanyAccess(jobPosting, companyId);

        // 엔티티 상태 변경
        jobPosting.close();

        return JobPostingResponseDto.fromEntity(jobPosting);
    }

    // 작성 기업 권한 검증 공통 로직
    private void validateCompanyAccess(JobPosting jobPosting, Long companyId) {
        if (!jobPosting.getCompany().getCompanyId().equals(companyId)) {
            throw new IllegalArgumentException("해당 채용공고에 대한 권한이 없습니다.");
        }
    }
}