package com.sprint.daonil.domain.apply.repository;


import com.sprint.daonil.domain.apply.entity.Application;
import com.sprint.daonil.domain.apply.eunmtype.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    // 중복 지원 체크용 메서드
    boolean existsByMember_MemberIdAndJobPosting_JobPostingId(Long memberId, Long jobPostingId);

    // 로그인한 사용자의 모든 지원 목록 조회
    Page<Application> findByMember_LoginId(String loginId, Pageable pageable);

    // 로그인한 사용자 지원 상태 필터 적용 조회
    Page<Application> findByMember_LoginIdAndStatus(String loginId, Status status, Pageable pageable);

    // 공고별 지원자 목록 조회 (기업용)
    java.util.List<Application> findByJobPosting_JobPostingIdOrderByAppliedAtDesc(Long jobPostingId);
}