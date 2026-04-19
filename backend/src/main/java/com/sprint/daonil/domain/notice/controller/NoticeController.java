package com.sprint.daonil.domain.notice.controller;

import com.sprint.daonil.domain.notice.dto.NoticeDTO;
import com.sprint.daonil.domain.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NoticeController {

    private final NoticeService noticeService;

    /**
     * 모든 공지사항 조회 (페이징)
     * GET /api/notices?page=1&size=10
     */
    @GetMapping
    public ResponseEntity<Page<NoticeDTO>> getAllNotices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<NoticeDTO> notices = noticeService.getAllNotices(page, size);
        return ResponseEntity.ok(notices);
    }

    /**
     * 공지사항 검색
     * GET /api/notices/search?keyword=검색어&page=1&size=10
     */
    @GetMapping("/search")
    public ResponseEntity<Page<NoticeDTO>> searchNotices(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<NoticeDTO> notices = noticeService.searchNotices(keyword, page, size);
        return ResponseEntity.ok(notices);
    }

    /**
     * 특정 공지사항 조회
     * GET /api/notices/{noticeId}
     */
    @GetMapping("/{noticeId}")
    public ResponseEntity<NoticeDTO> getNoticeById(@PathVariable Long noticeId) {
        NoticeDTO notice = noticeService.getNoticeById(noticeId);
        return ResponseEntity.ok(notice);
    }

    /**
     * 공지사항 생성 (관리자용)
     * POST /api/notices
     */
    @PostMapping
    public ResponseEntity<NoticeDTO> createNotice(@RequestBody NoticeDTO noticeDTO) {
        NoticeDTO createdNotice = noticeService.createNotice(noticeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNotice);
    }

    /**
     * 공지사항 수정 (관리자용)
     * PUT /api/notices/{noticeId}
     */
    @PutMapping("/{noticeId}")
    public ResponseEntity<NoticeDTO> updateNotice(
            @PathVariable Long noticeId,
            @RequestBody NoticeDTO noticeDTO) {
        NoticeDTO updatedNotice = noticeService.updateNotice(noticeId, noticeDTO);
        return ResponseEntity.ok(updatedNotice);
    }

    /**
     * 공지사항 삭제 (관리자용)
     * DELETE /api/notices/{noticeId}
     */
    @DeleteMapping("/{noticeId}")
    public ResponseEntity<String> deleteNotice(@PathVariable Long noticeId) {
        noticeService.deleteNotice(noticeId);
        return ResponseEntity.ok("공지사항이 삭제되었습니다.");
    }
}

