package com.sprint.daonil.domain.community.dto;

import com.sprint.daonil.domain.community.entity.Post;
import com.sprint.daonil.domain.member.entity.Member;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostWriteRequestDto {
    private String category;
    private String title;
    private String content;

    // DTO -> Entity 변환 메서드
    public Post toEntity(Member member, String imagePath, String filePath) {
        Post post = new Post();

        post.setCategory(this.category);
        post.setTitle(this.title);
        post.setContent(this.content);
        post.setViewCount(0);
        post.setLikeCount(0);
        post.setIsDeleted(false);

        post.setMember(member);
        post.setImageUrl(imagePath);
        post.setAttachmentUrl(filePath);

        return post;
    }
}