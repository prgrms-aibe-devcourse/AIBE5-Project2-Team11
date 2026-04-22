package com.sprint.daonil.domain.resume.repository;

import com.sprint.daonil.domain.resume.entity.Resume;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    // 특정 유저의 모든 이력서 조회
    List<Resume> findAllByMember_MemberId(Long memberId);

    // 특정 유저의 특정 이력서 조회
    Optional<Resume> findByResumeIdAndMember_MemberId(Long resumeId, Long memberId);

    // 이력서 리스트 조회용 (요청 사용자의 삭제되지 않은 이력서만 조회 + 공개 여부에 따른 정렬)
    @Query("""
        SELECT r
        FROM Resume r
        WHERE r.member.memberId = :memberId
        AND r.isDeleted = false
        ORDER BY 
        CASE WHEN r.isPublic = true THEN 0 ELSE 1 END,
        r.updatedAt DESC
    """)
    Page<Resume> findByMemberIdOrderByPublicFirst( @Param("memberId") Long memberId,Pageable pageable );
}
