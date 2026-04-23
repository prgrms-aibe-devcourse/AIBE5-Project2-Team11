package com.sprint.daonil.domain.community.service;

import com.sprint.daonil.domain.community.dto.*;
import com.sprint.daonil.domain.community.entity.Post;
import com.sprint.daonil.domain.community.entity.PostLike;
import com.sprint.daonil.domain.community.repository.CommentRepository;
import com.sprint.daonil.domain.community.repository.LikeRepository;
import com.sprint.daonil.domain.community.repository.PostRepository;
import com.sprint.daonil.domain.member.entity.Member;
import com.sprint.daonil.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final LikeRepository likeRepository;


    // 전체 조회( (카테고리 필터 + 페이징 + 댓글 수 포함 + 최신순 정렬)
    @Transactional(readOnly = true)
    public Page<PostListResponseDto> getPostList(String keyword, String category, String sort, int page) {
        Pageable pageable = PageRequest.of(page, 10);

        Page<Object[]> postPage;

        // 인기순 정렬 (좋아요 수 기준)
        if ("popular".equals(sort)) {

            if (keyword != null && category != null) {
                postPage = postRepository.findByCategoryAndKeywordOrderByLike(category, keyword, pageable);
            } else if (keyword != null) {
                postPage = postRepository.findByKeywordOrderByLike(keyword, pageable);
            } else if (category != null) {
                postPage = postRepository.findByCategoryOrderByLike(category, pageable);
            } else {
                postPage = postRepository.findAllOrderByLike(pageable);
            }

            return postPage.map(obj -> {
                Post post = (Post) obj[0];
                long commentCount = (long) obj[1];
                long likeCount =  (long) obj[2]; // likeCount도 쿼리에서 가져옴

                return new PostListResponseDto(post, commentCount, likeCount);
            });

        }

        // 최신순 정렬
        Pageable sortedPageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdAt"));

        if (keyword != null && category != null) {
            postPage = postRepository.findByCategoryAndKeyword(category, keyword, sortedPageable);
        } else if (keyword != null) {
            postPage = postRepository.findByKeyword(keyword, sortedPageable);
        } else if (category != null) {
            postPage = postRepository.findByCategoryWithCommentCount(category, sortedPageable);
        } else {
            postPage = postRepository.findPostsWithCommentCount(sortedPageable);
        }

        // DTO 변환
        return postPage.map(obj -> {
            Post post = (Post) obj[0];
            long commentCount = (long) obj[1];
            long likeCount  = likeRepository.countByPostId(post.getPostId());

            return new PostListResponseDto(post, commentCount, likeCount);
        });
    }


    // 상세 조회 + 조회수 증가
    @Transactional
    public PostDetailResponseDto getPostDetail(Long postId, String loginId) {
        // 게시글 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글이 존재하지 않습니다.")
                );

        // 조회수 증가 로직
        post.setViewCount(post.getViewCount() + 1);

        // 댓글 DTO 변환
        List<CommentResponseDto> commentDtos = post.getComments().stream()
                .map(comment -> {
                    int likeCount = likeRepository.countByCommentId(comment.getCommentId());
                    boolean isCommentLikeActive = false;

                    if (loginId != null && !loginId.isBlank()) {
                        Member member = memberRepository.findByLoginId(loginId).orElse(null);

                        if (member != null) {
                            isCommentLikeActive = likeRepository.findByCommentAndMember(comment.getCommentId(), member.getMemberId())
                                    .map(PostLike::getIsActive).orElse(false);
                        }
                    }

                    return new CommentResponseDto(comment, likeCount, isCommentLikeActive);
                }).toList();

        // 게시글 상세 DTO 변환
        boolean isPostLikeActive = false; // 현재 로그인한 사용자가 좋아요를 눌렀는지 여부
        if (loginId != null && !loginId.isBlank()) {
            Member member = memberRepository.findByLoginId(loginId).orElse(null); // 없으면 null 처리

            if (member != null) {
                isPostLikeActive = likeRepository.findByPostAndMember(post.getPostId(), member.getMemberId())
                        .map(PostLike::getIsActive).orElse(false);
            }
        }

        int postLikeCount  = likeRepository.countByPostId(post.getPostId()); // 좋아요 개수

        return new PostDetailResponseDto(post ,isPostLikeActive, postLikeCount, commentDtos);
    }


    // 생성
    @Transactional
    public Long createPost(PostWriteRequestDto dto, MultipartFile image, MultipartFile file, String loginId) {
        // 작성자 세팅
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."));

        // 이미지 업로드
        String imagePath =  null;
        if (image != null && !image.isEmpty()) {  // 이미지 존재하는 경우
            imagePath = saveFile(member.getMemberId(), image, "post_images");
        }

        // 파일 업로드
        String filePath = null;
        if (file != null && !file.isEmpty()) {  // 파일 존재하는 경우
            filePath = saveFile(member.getMemberId(), file, "post_files");
        }

        // 게시물 Entity 생성
        Post post = dto.toEntity(member, imagePath, filePath);

        // 저장
        Post savedPost = postRepository.save(post);

        return savedPost.getPostId();
    }


    // 수정
    @Transactional
    public Long updatePost(PostWriteRequestDto dto, MultipartFile image, MultipartFile file, String loginId, Long postId) {

        // 게시글 조회
        Post post = postRepository.findById(postId).orElseThrow(() ->
                new ResponseStatusException( HttpStatus.NOT_FOUND, "게시글이 존재하지 않습니다."));

        // 권한 검증
        if (!post.getMember().getLoginId().equals(loginId)) {
            throw new ResponseStatusException( HttpStatus.FORBIDDEN, "수정 권한이 없습니다.");
        }

        // 업데이트 (수정된 필드에 대해서만 덮어쓰기)
        if (dto.getCategory() != null) { // 게시판 유형 교체
            post.setCategory(dto.getCategory());
        }
        if (dto.getTitle() != null) { // 제목 교체
            post.setTitle(dto.getTitle());
        }
        if (dto.getContent() != null) {// 내용 교체
            post.setContent(dto.getContent());
        }
        if (image != null && !image.isEmpty()) { // 이미지 교체
            String imagePath = saveFile(post.getMember().getMemberId(), image, "post_images");
            post.setImageUrl(imagePath);
        }
        if (file != null && !file.isEmpty()) { // 파일 교체
            String filePath = saveFile(post.getMember().getMemberId(), file, "post_files");
            post.setAttachmentUrl(filePath);
        }

        // 저장
        Post updatedPost = postRepository.save(post);

        return updatedPost.getPostId();
    }


    // 삭제
    @Transactional
    public Long deletePost(Long postId, String loginId) {
        // 게시글 조회
        Post post = postRepository.findById(postId).orElseThrow(() ->
                new ResponseStatusException( HttpStatus.NOT_FOUND, "게시글이 존재하지 않습니다."));

        // 작성자 검증
        if (!post.getMember().getLoginId().equals(loginId)) {
            throw new ResponseStatusException( HttpStatus.FORBIDDEN, "삭제 권한이 없습니다.");
        }

        // 삭제
        postRepository.delete(post);

        return postId;
    }


    // 게시글 좋아요 활성 & 비활성 처리
    @Transactional
    public LikeResponseDto changePostLikeStatus(Long postId, String loginId) {
        // 회원 조회
        Member member = memberRepository.findByLoginId(loginId).orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다.")); // 로그인 회원만 사용 가능

        // 게시글 좋아요 조회 (존재하면 가져오고, 없으면 새로 생성)
        PostLike like = likeRepository.findByPostAndMember(postId, member.getMemberId())
                .orElseGet(() -> { //  좋아요 없으면 새로 생성
                    // 게시글 조회
                    Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("존재하지 않는 게시글입니다."));
                    // 게시글 좋아요 생성
                    PostLike newLike = new PostLike();
                    newLike.setPost(post);
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


    // =========== 로컬 파일 저장 메서드 =============
    private String saveFile(Long userId, MultipartFile file, String type) {
        try {
            // 용량 체크
            long MAX_SIZE = 50 * 1024 * 1024; // 50MB // Spring 설정 기준
            if (file.getSize() > MAX_SIZE) {
                throw new ResponseStatusException( HttpStatus.PAYLOAD_TOO_LARGE, "파일 용량이 50MB를 초과했습니다.");
            }

            // 저장 경로
            String baseDir = "C:/daonil/" + type + "/"; // 기본 저장 루트 + 타입별 폴더
            String userDirPath = baseDir + userId + "/"; // 유저별 폴더
            File userDir = new File(userDirPath);

            if (!userDir.exists()) { // 폴더 없으면 생성
                userDir.mkdirs();
            }

            // 최종 저장 경로
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String filePath = userDirPath + fileName;
            file.transferTo(new File(filePath));

            return "/uploads/" + type + "/" + userId + "/" + fileName;

        } catch (IOException e) {
            throw new ResponseStatusException( HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장 실패");
        }
    }



}