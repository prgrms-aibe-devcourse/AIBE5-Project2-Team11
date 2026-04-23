package com.sprint.daonil.domain.community.dto;

import com.sprint.daonil.domain.community.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostListResponseDto {
    private Long postId;
    private String title;
    private String content;
    private String category;
    private int viewCount;
    private long likeCount;
    private long commentCount;
    private String writer; // member name
    private LocalDateTime createdAt;

    // Entity -> DTO
    public PostListResponseDto(Post post, long commentCount, long likeCount) {
        this.postId = post.getPostId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.category = post.getCategory();
        this.viewCount = post.getViewCount();
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.writer = post.getMember().getName();
        this.createdAt = post.getCreatedAt();
    }
}
