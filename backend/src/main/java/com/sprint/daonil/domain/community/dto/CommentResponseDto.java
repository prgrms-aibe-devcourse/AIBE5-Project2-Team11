package com.sprint.daonil.domain.community.dto;

import com.sprint.daonil.domain.community.entity.PostComment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponseDto {
    private Long commentId;
    private String content;
    private String writer; // member loginId
    private String createdAt;
    private int likeCount;
    private boolean isLikeActive; // 현재 사용자가 좋아요를 눌렀는지 여부

    // Entity -> DTO
    public CommentResponseDto(PostComment postComment, int likeCount, boolean isLikeActive) {
        this.commentId = postComment.getCommentId();
        this.content = postComment.getContent();
        this.writer = postComment.getMember().getLoginId();
        this.createdAt = postComment.getCreatedAt().toString();
        this.likeCount = likeCount;
        this.isLikeActive = isLikeActive;
    }
}
