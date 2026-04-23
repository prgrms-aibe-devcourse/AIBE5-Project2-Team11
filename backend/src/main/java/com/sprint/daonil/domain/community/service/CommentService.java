package com.sprint.daonil.domain.community.service;

import com.sprint.daonil.domain.community.dto.CommentWriteRequestDto;
import com.sprint.daonil.domain.community.dto.LikeResponseDto;
import com.sprint.daonil.domain.community.entity.Post;
import com.sprint.daonil.domain.community.entity.PostComment;
import com.sprint.daonil.domain.community.entity.PostLike;
import com.sprint.daonil.domain.community.repository.CommentRepository;
import com.sprint.daonil.domain.community.repository.LikeRepository;
import com.sprint.daonil.domain.community.repository.PostRepository;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final LikeRepository likeRepository;

    // 댓글 작성
    @Transactional
    public Long createComment(Long postId, CommentWriteRequestDto dto, String loginId) {
        // 게시글 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 게시글입니다."));

        // 회원 조회
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."));

        // 댓글 Entity 생성
        PostComment comment = dto.toEntity(post, member);

        // 저장
        PostComment saved = commentRepository.save(comment);

        return saved.getCommentId();
    }


    // 댓글  수정
    @Transactional
    public Long updateComment(Long postId, Long commentId, CommentWriteRequestDto dto, String loginId) {
        // 댓글 조회
        PostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 댓글입니다."));

        // 댓글 소속  게시글 체크
        if (!comment.getPost().getPostId().equals(postId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 접근입니다.");
        }

        // 권한 체크
        if (!comment.getMember().getLoginId().equals(loginId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다.");
        }

        // 수정
        comment.setContent(dto.getContent());

        return comment.getCommentId();
    }


    // 댓글 삭제
    @Transactional
    public Long deleteComment(Long postId, Long commentId, String loginId) {
        // 댓글 조회
        PostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 댓글입니다."));

        // 댓글 소속  게시글 체크
        if (!comment.getPost().getPostId().equals(postId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 접근입니다.");
        }

        // 권한 체크
        if (!comment.getMember().getLoginId().equals(loginId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제 권한이 없습니다.");
        }

        // 댓글 삭제
        commentRepository.delete(comment);

        return commentId;
    }

    @Transactional
    public LikeResponseDto changeCommentLikeStatus(Long commentId, String loginId) {

        // 회원 조회
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));

        // 댓글 좋아요 조회 (존재하면 가져오고, 없으면 새로 생성)
        PostLike like = likeRepository.findByCommentAndMember(commentId, member.getMemberId())
                .orElseGet(() -> { //  좋아요 없으면 새로 생성
                    // 댓글 조회
                    PostComment comment = commentRepository.findById(commentId).orElseThrow(() -> new RuntimeException("존재하지 않는 댓글입니다."));
                    // 댓글 좋아요 생성
                    PostLike newLike = new PostLike();
                    newLike.setComment(comment);
                    newLike.setMember(member);
                    newLike.setIsActive(true);
                    return newLike;
                });

        // 좋아요 상태 전환 (활성 -> 비활성, 비활성 -> 활성)
        if (like.getPostLikeId() != null) {
            like.setIsActive(!like.getIsActive());
        }

        PostLike saved = likeRepository.save(like);

        return new LikeResponseDto( saved.getPostLikeId(), saved.getIsActive());
    }

}
