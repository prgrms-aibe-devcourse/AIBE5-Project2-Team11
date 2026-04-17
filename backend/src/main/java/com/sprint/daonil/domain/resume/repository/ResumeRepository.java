package com.sprint.daonil.domain.resume.repository;

import com.sprint.daonil.domain.resume.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    // 이력서 리스트 조회용 (요청 사용자의 삭제되지 않은 이력서만 조회)
    List<Resume> findByMember_MemberIdAndIsDeletedFalse(Long memberId);
}
