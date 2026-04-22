package com.sprint.daonil.domain.bookmark.service;

import com.sprint.daonil.domain.bookmark.entity.Bookmark;
import com.sprint.daonil.domain.bookmark.repository.BookmarkRepository;
import com.sprint.daonil.domain.jobposting.dto.JobPostingResponseDto;
import com.sprint.daonil.domain.jobposting.entity.JobPosting;
import com.sprint.daonil.domain.jobposting.repository.JobPostingRepository;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final MemberRepository memberRepository;
    private final JobPostingRepository jobPostingRepository;

    @Transactional
    public boolean toggleBookmark(String loginId, Long jobPostingId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다. loginId=" + loginId));
                
        Optional<Bookmark> optionalBookmark = bookmarkRepository.findByMember_MemberIdAndJobPosting_JobPostingId(member.getMemberId(), jobPostingId);

        if (optionalBookmark.isPresent()) {
            bookmarkRepository.delete(optionalBookmark.get());
            return false; // 북마크 취소됨 (현재 상태 false)
        } else {
            JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공고입니다. id=" + jobPostingId));
            
            Bookmark bookmark = Bookmark.builder()
                    .member(member)
                    .jobPosting(jobPosting)
                    .build();
            bookmarkRepository.save(bookmark);
            return true; // 북마크 추가됨 (현재 상태 true)
        }
    }

    public Page<JobPostingResponseDto> getBookmarkedJobPostings(String loginId, Pageable pageable) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다. loginId=" + loginId));
                
        Page<Bookmark> bookmarks = bookmarkRepository.findByMember_MemberId(member.getMemberId(), pageable);
        return bookmarks.map(bookmark -> JobPostingResponseDto.fromEntity(bookmark.getJobPosting()));
    }
    
    public boolean isBookmarked(String loginId, Long jobPostingId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다. loginId=" + loginId));
        return bookmarkRepository.existsByMember_MemberIdAndJobPosting_JobPostingId(member.getMemberId(), jobPostingId);
    }
}
