package com.sprint.daonil.domain.apply.repository;


import com.sprint.daonil.domain.apply.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    // 중복 지원 체크용 메서드
    boolean existsByMember_MemberIdAndJobPosting_JobPostingId(Long memberId, Long jobPostingId);
}