package com.sprint.daonil.domain.community.dto;

import com.sprint.daonil.domain.community.entity.Post;

public class PostListResponse {
    private Long postId;
    private String title;
    private String content;
    private String category;
    private int viewCount;
    private int likeCount;
    private String writer; // member name

    // Entity -> DTO
    public PostListResponse(Post post) {
        this.postId = post.getPostId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.category = post.getCategory();
        this.viewCount = post.getViewCount();
        this.likeCount = post.getLikeCount();
        this.writer = post.getMember().getName();
    }
}
