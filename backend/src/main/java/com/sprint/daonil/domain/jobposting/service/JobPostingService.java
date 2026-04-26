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
    private final com.sprint.daonil.domain.apply.repository.ApplicationRepository applicationRepository;

    // 채용공고 목록 조회 (다중 필터 + 페이징)
    @Transactional(readOnly = true)
    public Page<JobPostingResponseDto> getJobPostings(String keyword, String mainCategory, String subCategory,
                                                      String workRegion,
                                                      String envBothHands, String envEyesight, 
                                                      String envHandWork, String envLiftPower, 
                                                      String envLstnTalk, String envStndWalk,
                                                      Pageable pageable) {
        return jobPostingRepository.findByFilters(keyword, mainCategory, subCategory, workRegion, 
                envBothHands, envEyesight, envHandWork, envLiftPower, envLstnTalk, envStndWalk,
                false, pageable)
                .map(job -> {
                    int count = applicationRepository.countByJobPosting_JobPostingId(job.getJobPostingId());
                    return JobPostingResponseDto.fromEntity(job, count);
                });
    }

    // 특정 회사 채용공고 목록 조회
    @Transactional(readOnly = true)
    public Page<JobPostingResponseDto> getJobPostingsByCompanyId(String loginId, Pageable pageable) {
        return jobPostingRepository.findByCompany_Member_LoginId(loginId, pageable)
                .map(job -> {
                    int count = applicationRepository.countByJobPosting_JobPostingId(job.getJobPostingId());
                    return JobPostingResponseDto.fromEntity(job, count);
                });
    }

    // 채용공고 상세 조회 (조회수 증가 포함)
    public JobPostingResponseDto getJobPostingDetail(Long jobPostingId) {
        // 1. DB 단에서 직접 조회수 증가 (동시성 문제 방지)
        jobPostingRepository.incrementViewCount(jobPostingId);

        // 2. 증가된 상태의 엔티티 조회
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new IllegalArgumentException("채용공고를 찾을 수 없습니다."));

        int count = applicationRepository.countByJobPosting_JobPostingId(jobPostingId);

        return JobPostingResponseDto.fromEntity(jobPosting, count);
    }

    // 채용공고 등록 (Builder 패턴 적용)
    public JobPostingResponseDto createJobPosting(String loginId, JobPostingRequestDto requestDto) {
        Company company = companyRepository.findByMember_LoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("기업 정보를 찾을 수 없습니다."));

        JobPosting jobPosting = requestDto.toEntity(company);

        JobPosting savedJobPosting = jobPostingRepository.save(jobPosting);

        return JobPostingResponseDto.fromEntity(savedJobPosting);
    }

    // 채용공고 수정 (Dirty Checking 및 권한 검증)
    public JobPostingResponseDto updateJobPosting(String loginId, Long jobPostingId, JobPostingRequestDto requestDto) {
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new IllegalArgumentException("채용공고를 찾을 수 없습니다."));

        validateCompanyAccess(jobPosting, loginId);

        // 엔티티의 비즈니스 메서드 호출. 트랜잭션 종료 시 알아서 UPDATE 쿼리 발생
        jobPosting.update(requestDto);

        return JobPostingResponseDto.fromEntity(jobPosting);
    }

    // 채용공고 마감 (Dirty Checking 및 권한 검증)
    public JobPostingResponseDto closeJobPosting(String loginId, Long jobPostingId) {
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new IllegalArgumentException("채용공고를 찾을 수 없습니다."));

        validateCompanyAccess(jobPosting, loginId);

        // 엔티티 상태 변경
        jobPosting.close();

        return JobPostingResponseDto.fromEntity(jobPosting);
    }

    // 작성 기업 권한 검증 공통 로직
    private void validateCompanyAccess(JobPosting jobPosting, String loginId) {
        if (!jobPosting.getCompany().getMember().getLoginId().equals(loginId)) {
            throw new IllegalArgumentException("해당 채용공고에 대한 권한이 없습니다.");
        }
    }
}