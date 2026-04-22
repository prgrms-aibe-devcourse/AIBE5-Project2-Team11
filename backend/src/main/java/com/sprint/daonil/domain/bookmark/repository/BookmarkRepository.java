package com.sprint.daonil.domain.bookmark.repository;

import com.sprint.daonil.domain.bookmark.entity.Bookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    
    // 북마크 존재 여부 확인
    boolean existsByMember_MemberIdAndJobPosting_JobPostingId(Long memberId, Long jobPostingId);
    
    // 회원의 특정 북마크 찾기
    Optional<Bookmark> findByMember_MemberIdAndJobPosting_JobPostingId(Long memberId, Long jobPostingId);
    
    // 회원의 북마크 목록 조회 (페이지네이션)
    Page<Bookmark> findByMember_MemberId(Long memberId, Pageable pageable);
}
