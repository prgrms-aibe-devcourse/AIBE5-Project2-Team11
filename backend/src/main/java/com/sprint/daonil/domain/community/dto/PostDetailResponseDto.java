package com.sprint.daonil.domain.community.dto;

import com.sprint.daonil.domain.community.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostDetailResponseDto {

     private Long postId;
     private String category;
     private String title;

     private String writer; // member loginId
     private String createdAt;
     private int viewCount;
     private int likeCount;
     private int commentCount;
     private boolean isLikeActive; // 현재 사용자가 좋아요를 눌렀는지 여부

     private String content;
     private String imageUrl;
     private String fileUrl;

     private List<CommentResponseDto> comments;

     // Entity -> DTO
     public PostDetailResponseDto(Post post, boolean isLikeActive, int likeCount, List<CommentResponseDto> comments) {
          this.postId = post.getPostId();
          this.category = post.getCategory();
          this.title = post.getTitle();

          this.writer = post.getMember().getLoginId();
          this.createdAt = post.getCreatedAt().toString();
          this.viewCount = post.getViewCount();
          this.likeCount = likeCount;
          this.commentCount = comments.size();
          this.isLikeActive = isLikeActive;

          this.content = post.getContent();
          this.imageUrl = post.getImageUrl();
          this.fileUrl = post.getAttachmentUrl();

          this.comments = comments;
     }
}
