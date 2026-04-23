package com.sprint.daonil.domain.community.controller;

import com.sprint.daonil.domain.community.dto.LikeResponseDto;
import com.sprint.daonil.domain.community.dto.PostWriteRequestDto;
import com.sprint.daonil.domain.community.dto.PostDetailResponseDto;
import com.sprint.daonil.domain.community.dto.PostListResponseDto;
import com.sprint.daonil.domain.community.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 게시글 리스트 조회
    @GetMapping
    public Page<PostListResponseDto> getPostList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(defaultValue = "0") int page  ) {
        return postService.getPostList(keyword, category, sort, page);
    }


    // 게시글  상세 조회 (댓글 리스트 포함)
    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponseDto> getPost(@PathVariable Long postId) {
        // 접근 사용자 정보
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        PostDetailResponseDto response = postService.getPostDetail(postId, loginId);

        return ResponseEntity.ok(response);
    }


    // 게시글 생성
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(
            @RequestPart("data") PostWriteRequestDto dto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        // 접근 사용자 정보
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        Long createdPostId = postService.createPost(dto, image, file, loginId);

        return ResponseEntity.ok(Map.of("message", "게시글 생성 완료", "postId", createdPostId ));
    }


    // 게시글 수정
    @PatchMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable Long postId,
            @RequestPart("data") PostWriteRequestDto dto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        // 접근 사용자 정보
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        Long updatedPostId =  postService.updatePost(dto, image, file, loginId, postId);
        return ResponseEntity.ok(Map.of("message", "게시글 수정 완료", "postId", updatedPostId ));
    }


    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long postId) {
        // 접근 사용자 정보
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        Long deletedPostId = postService.deletePost(postId, loginId);

        return ResponseEntity.ok(Map.of("message", "게시글 삭제 완료","postId", deletedPostId));
    }


    // 게시글 좋아요 활성 & 비활성 처리
    @PostMapping("/{postId}/likes")
    public ResponseEntity<Map<String, Object>> changePostLikeStatus( @PathVariable Long postId) {
        // 접근 사용자 정보
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        LikeResponseDto result = postService.changePostLikeStatus(postId, loginId);

        return ResponseEntity.ok(Map.of(
                "message", "처리 완료", "likeId", result.getLikeId(), "isActive", result.getIsActive()));
    }
}