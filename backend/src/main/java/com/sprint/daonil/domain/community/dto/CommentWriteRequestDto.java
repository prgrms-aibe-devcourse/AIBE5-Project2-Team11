package com.sprint.daonil.domain.community.dto;

import com.sprint.daonil.domain.community.entity.Post;
import com.sprint.daonil.domain.community.entity.PostComment;
import com.sprint.daonil.domain.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentWriteRequestDto{
    private String content;

    // DTO -> Entity 변환 메서드
    public PostComment toEntity(Post post, Member member) {
        PostComment comment = new PostComment();

        comment.setPost(post);
        comment.setMember(member);
        comment.setContent(this.getContent());
        comment.setIsDeleted(false);

        return comment;
    }

}
