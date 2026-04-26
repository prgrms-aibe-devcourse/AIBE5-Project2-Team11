package com.sprint.daonil.domain.report.controller;

import com.sprint.daonil.domain.alarm.service.AlarmService;
import com.sprint.daonil.domain.report.dto.ReportRequestDto;
import com.sprint.daonil.domain.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // 게시글 신고
    @PostMapping("/posts/{postId}/report")
    public ResponseEntity<Map<String, Object>> reportPost( @PathVariable Long postId, @RequestBody ReportRequestDto requestDto) {
        String loginId = SecurityContextHolder.getContext().getAuthentication().getName();

        Long reportId = reportService.reportPost(loginId, postId, requestDto.getReason());



        return ResponseEntity.ok(Map.of("message", "게시글 신고가 접수되었습니다.", "reportId", reportId));
    }

    // 댓글 신고
    @PostMapping("/posts/comments/{commentId}/report")
    public ResponseEntity<Map<String, Object>> reportComment( @PathVariable Long commentId, @RequestBody ReportRequestDto requestDto) {
        String loginId = SecurityContextHolder.getContext().getAuthentication().getName();

        Long reportId = reportService.reportComment(loginId, commentId, requestDto.getReason());

        return ResponseEntity.ok(Map.of("message", "댓글 신고가 접수되었습니다.", "reportId", reportId));
    }
}