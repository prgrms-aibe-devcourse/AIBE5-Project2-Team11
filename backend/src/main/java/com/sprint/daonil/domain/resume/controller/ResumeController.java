package com.sprint.daonil.domain.resume.controller;

import com.sprint.daonil.domain.resume.dto.ResumeWriteRequestDto;
import com.sprint.daonil.domain.resume.dto.ResumeDetailResponseDto;
import com.sprint.daonil.domain.resume.dto.ResumeListResponseDto;
import com.sprint.daonil.domain.resume.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/resumes")
public class ResumeController {
    private final ResumeService resumeService;

    // 이력서 목록 조회
    @GetMapping
    public ResponseEntity<Object> getResumeList(@PageableDefault(size = 5) Pageable pageable) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        Page<ResumeListResponseDto> resumeList =   resumeService.getResumeList(loginId,pageable);

        return ResponseEntity.ok(resumeList);
    }


    // 이력서 상세 조회
    @GetMapping("/{resumeId}")
    public ResponseEntity<Object> getResumeDetail(@PathVariable Long resumeId) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        ResumeDetailResponseDto resumeDetail = resumeService.getResumeDetail(loginId, resumeId);

        return ResponseEntity.ok(resumeDetail);
    }


    // 이력서 생성
    @PostMapping
    public ResponseEntity<Map<String, Object>>  createResume(@RequestPart("data") ResumeWriteRequestDto dto,
                                             @RequestPart(value = "image", required = false) MultipartFile image) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        Long createdResumeId = resumeService.createResume(loginId, dto, image);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("message", "이력서 생성 완료", "resumeId", createdResumeId));
    }

     // 이력서 수정
     @PatchMapping("/{resumeId}")
     public ResponseEntity<Map<String, Object>> updateResume( @PathVariable Long resumeId,
                                            @RequestPart("data") ResumeWriteRequestDto dto,
                                            @RequestPart(value = "image", required = false) MultipartFile image) {
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
         String loginId = auth.getName();

         Long updatedResumeId = resumeService.updateResume(loginId, resumeId, dto, image);

         return ResponseEntity.ok(Map.of("message", "이력서 수정 완료", "resumeId", updatedResumeId));
     }


    // 이력서 삭제 (soft delete)
    @PatchMapping("/{resumeId}/status")
    public ResponseEntity<Map<String, Object>> deleteResume(@PathVariable Long resumeId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        Long resultResumeId = resumeService.deleteResume(loginId, resumeId);

        return ResponseEntity.ok( Map.of("message", "이력서 삭제 완료","resumeId", resultResumeId) );
    }


    // 이력서 공개 여부 설정
    @PatchMapping("/{resumeId}/public")
    public ResponseEntity<Map<String, Object>> updatePublicStatus( @PathVariable Long resumeId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginId = auth.getName();

        Long resultResumeId = resumeService.updatePublicStatus(loginId, resumeId);

        return ResponseEntity.ok( Map.of("message", "대표 이력서 설정 완료", "resumeId", resultResumeId) );
    }


}

