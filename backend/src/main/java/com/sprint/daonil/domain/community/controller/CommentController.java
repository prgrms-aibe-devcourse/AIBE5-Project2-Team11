package com.sprint.daonil.domain.community.controller;

import com.sprint.daonil.domain.community.dto.CommentWriteRequestDto;
import com.sprint.daonil.domain.community.dto.LikeResponseDto;
import com.sprint.daonil.domain.community.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    // 댓글 작성
    @PostMapping("/{postId}/comments")
    public ResponseEntity<Map<String, Object>> createComment(
            @PathVariable Long postId, @RequestBody CommentWriteRequestDto dto) {
        // 접근 사용자 정보
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        Long createdCommentId = commentService.createComment(postId, dto, loginId);

        return ResponseEntity.ok(Map.of("message", "댓글 생성 완료", "commentId", createdCommentId ));
    }

    // 댓글 수정
    @PatchMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Map<String, Object>> updateComment(
            @PathVariable Long postId, @PathVariable Long commentId, @RequestBody CommentWriteRequestDto dto) {
        // 접근 사용자 정보
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        Long updatedCommentId  = commentService.updateComment(postId, commentId, dto, loginId);

        return ResponseEntity.ok(Map.of("message", "댓글 수정 완료", "commentId", updatedCommentId ));
    }

    // 댓글 삭제
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Map<String, Object>> deleteComment(
            @PathVariable Long postId, @PathVariable Long commentId) {
        // 접근 사용자 정보
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        Long deletedCommentId = commentService.deleteComment(postId, commentId, loginId);

        return ResponseEntity.ok(Map.of("message", "댓글 삭제 완료", "commentId", deletedCommentId ));
    }

    // 댓글 좋아요 활성 & 비활성 처리
    @PostMapping("/{postId}/comments/{commentId}/likes")
    public ResponseEntity<Map<String, Object>> changeCommentLikeStatus(@PathVariable Long commentId) {
        // 접근 사용자 정보
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        LikeResponseDto result = commentService.changeCommentLikeStatus(commentId,loginId);

        return ResponseEntity.ok(Map.of(
                "message", "처리 완료", "likeId", result.getLikeId(), "isActive", result.getIsActive()));
    }
}
