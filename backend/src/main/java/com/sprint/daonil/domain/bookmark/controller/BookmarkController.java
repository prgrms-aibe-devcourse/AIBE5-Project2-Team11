package com.sprint.daonil.domain.bookmark.controller;

import com.sprint.daonil.domain.bookmark.service.BookmarkService;
import com.sprint.daonil.domain.jobposting.dto.JobPostingResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    // 북마크 토글 (추가/취소)
    @PostMapping("/{jobPostingId}")
    public ResponseEntity<Map<String, Object>> toggleBookmark(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long jobPostingId) {
            
        String loginId = userDetails.getUsername();
        boolean isBookmarked = bookmarkService.toggleBookmark(loginId, jobPostingId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("isBookmarked", isBookmarked);
        response.put("message", isBookmarked ? "북마크에 추가되었습니다." : "북마크가 취소되었습니다.");
        
        return ResponseEntity.ok(response);
    }

    // 마이페이지 스크랩(북마크) 목록 조회
    @GetMapping
    public ResponseEntity<Page<JobPostingResponseDto>> getBookmarkedJobPostings(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
            
        String loginId = userDetails.getUsername();
        Page<JobPostingResponseDto> response = bookmarkService.getBookmarkedJobPostings(loginId, pageable);
        return ResponseEntity.ok(response);
    }
    
    // 특정 공고 북마크 여부 확인 ( 상세 페이지 조회시 사용 )
    @GetMapping("/{jobPostingId}/status")
    public ResponseEntity<Map<String, Boolean>> checkBookmarkStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long jobPostingId) {
            
        boolean isBookmarked = false;
        if (userDetails != null) {
            String loginId = userDetails.getUsername();
            isBookmarked = bookmarkService.isBookmarked(loginId, jobPostingId);
        }
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("isBookmarked", isBookmarked);
        
        return ResponseEntity.ok(response);
    }
}
