package com.sprint.daonil.domain.community.repository;

import com.sprint.daonil.domain.community.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<PostLike, Long> {
    // 활성화된 게시글 좋아요 개수 조회
    @Query("""
    select count(pl)
    from PostLike pl
    where pl.post.postId = :postId
      and pl.isActive = true
    """)
    int countByPostId(@Param("postId") Long postId);

    // 특정 게시글에 대한 특정 회원의 좋아요 조회
    @Query("""
    select pl
    from PostLike pl
    where pl.post.postId = :postId
      and pl.member.memberId = :memberId
    """)
    Optional<PostLike> findByPostAndMember( @Param("postId") Long postId, @Param("memberId") Long memberId);



    // 활성화된 댓글 좋아요 개수 조회
    @Query("""
    select count(pl)
    from PostLike pl
    where pl.comment.commentId = :commentId
      and pl.isActive = true
    """)
    int countByCommentId(@Param("commentId") Long commentId);

    // 특정 댓글에 대한 특정 회원의 좋아요 조회
    @Query("""
    select pl
    from PostLike pl
    where pl.comment.commentId = :commentId
      and pl.member.memberId = :memberId
    """)
    Optional<PostLike> findByCommentAndMember( @Param("commentId") Long commentId, @Param("memberId") Long memberId);
}
