package com.sprint.daonil.domain.apply.service;

import com.sprint.daonil.domain.apply.dto.ApplicationApplicantResponseDto;
import com.sprint.daonil.domain.apply.dto.ApplicationCreateRequestDto;
import com.sprint.daonil.domain.apply.dto.ApplicationDetailResponseDto;
import com.sprint.daonil.domain.apply.dto.ApplicationListResponseDto;
import com.sprint.daonil.domain.apply.entity.Application;
import com.sprint.daonil.domain.apply.eunmtype.Status;
import com.sprint.daonil.domain.apply.repository.ApplicationRepository;
import com.sprint.daonil.domain.jobposting.entity.JobPosting;
import com.sprint.daonil.domain.jobposting.repository.JobPostingRepository;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.entity.Profile;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import com.sprint.daonil.domain.member.repository.ProfileRepository;
import com.sprint.daonil.domain.resume.entity.Resume;
import com.sprint.daonil.domain.resume.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ResumeRepository resumeRepository;
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;

    // 공고 지원
    @Transactional
    public Long apply(Long jobPostingId, ApplicationCreateRequestDto dto, String loginId) {
        // 회원 조회
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."));

        // 공고 조회
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 공고입니다."));

        // 이력서 조회
        Resume resume = resumeRepository.findById(dto.getResumeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 이력서입니다."));
        if (!resume.getMember().getMemberId().equals(member.getMemberId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 이력서만 사용할 수 있습니다.");
        }

        // 중복 지원 체크
        if (applicationRepository.existsByMember_MemberIdAndJobPosting_JobPostingId(member.getMemberId(), jobPostingId) ) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 지원한 공고입니다.");
        }

        // 지원 Entity 생성
        Application application = new Application();
        application.setJobPosting(jobPosting);
        application.setResume(resume);
        application.setMember(member);
        application.setStatus(Status.SUBMITTED);

        // 저장
        Application saved = applicationRepository.save(application);
        return saved.getApplicationId();
    }


    // 지원자의 지원 내역 리스트 조회
    public Page<ApplicationListResponseDto> getMyApplications(String loginId, int page, int size, String status) {
        // 회원 조회
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."));


        // 조회
        Pageable pageable = PageRequest.of(page, size);
        Page<Application> applications;

        if (status != null) { // 지원상태 필터링
            applications = applicationRepository.findByMember_LoginIdAndStatus(loginId, Status.valueOf(status), pageable);
        } else { // 전체 조회
            applications = applicationRepository.findByMember_LoginId(loginId, pageable);
        }

        return applications.map(ApplicationListResponseDto::new);
    }


    // 지원 정보 상세 조회
    @Transactional(readOnly = true)
    public ApplicationDetailResponseDto getMyApplicationDetail(Long applicationId, String loginId) {

        // 회원 조회
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."));

        // 지원 내역 조회
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "지원 내역이 존재하지 않습니다."));

        // 권한 체크
        if (!application.getMember().getMemberId().equals(member.getMemberId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "접근 권한이 없습니다.");
        }

        // 회원 Profile 조회 (ResumeDetailResponseDto에 필요)
        Profile profile = profileRepository.findByMemberId(member.getMemberId()).orElse(null);

        // DTO 변환
        return ApplicationDetailResponseDto.from(application, profile);
    }



    // 지원 취소
    @Transactional
    public Long cancelApplication(Long applicationId, String loginId) {
        // 회원 조회
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."));

        // 지원 내역 조회
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "지원 내역이 존재하지 않습니다."));

        // 본인 지원인지 검증
        if (!application.getMember().getMemberId().equals(member.getMemberId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "지원 취소 권한이 없습니다.");
        }

        // 상태 검증 (SUBMITTED만 삭제 가능)
        if (application.getStatus() != Status.SUBMITTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "서류 검토 또는 면접이 진행 중인 지원은 취소할 수 없습니다.");
        }

        // 삭제
        applicationRepository.delete(application);
        return applicationId;
    }

    // 기업용: 특정 공고의 지원자 목록 조회
    @Transactional(readOnly = true)
    public java.util.List<ApplicationApplicantResponseDto> getApplicantsByJobPosting(Long jobPostingId, String loginId) {
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 공고입니다."));

        // 권한 체크: 요청자가 해당 공고를 올린 기업인지 확인
        if (!jobPosting.getCompany().getMember().getLoginId().equals(loginId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "해당 공고의 지원자 목록을 볼 권한이 없습니다.");
        }

        return applicationRepository.findByJobPosting_JobPostingIdOrderByAppliedAtDesc(jobPostingId)
                .stream()
                .map(ApplicationApplicantResponseDto::from)
                .collect(java.util.stream.Collectors.toList());
    }

    // 기업용: 지원자 상태 변경
    @Transactional
    public void updateApplicationStatus(Long applicationId, String statusStr, String loginId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "지원 내역이 존재하지 않습니다."));

        // 권한 체크: 요청자가 해당 공고를 올린 기업인지 확인
        if (!application.getJobPosting().getCompany().getMember().getLoginId().equals(loginId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "지원자 상태를 변경할 권한이 없습니다.");
        }

        try {
            Status status = Status.valueOf(statusStr);
            application.setStatus(status);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 상태 값입니다.");
        }
    }
}