package com.sprint.daonil.domain.resume.controller;

import com.sprint.daonil.domain.resume.dto.ResumeListResponseDto;
import com.sprint.daonil.domain.resume.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/resumes")
public class ResumeController {
    private final ResumeService resumeService;

    // 이력서 목록 조회
    @GetMapping
    public ResponseEntity<Object> getResumeList() {
        // 로그인 사용자의 정보 [임시 사용]
        Long userId = 1L;

        List<ResumeListResponseDto>  resumeList =   resumeService.getResumeList(userId);

        if (resumeList == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "존재하지 않는 회원입니다."));
        }

        return ResponseEntity.ok(resumeList);
    }




}


// // 이력서 상세 조회
//@GetMapping("/{resumeId}")
//public Object getResumeDetail(@PathVariable Long resumeId) {
//    return ResponseEntity.ok(resumeService.getResumeDetail(userId, resumeId));
//}
//
//    // 이력서 생성
//    @PostMapping
//    public Object createResume(@RequestBody Object request) {
//        return resumeService.createResume(request);
//    }
//
//    // 이력서 수정
//    @PatchMapping("/{resumeId}")
//    public Object updateResume(
//            @PathVariable Long resumeId,
//            @RequestBody Object request
//    ) {
//        return resumeService.updateResume(resumeId, request);
//    }
//
//    // 이력서 삭제 (soft delete)
//    @PatchMapping("/{resumeId}/status")
//    public Object deleteResume(@PathVariable Long resumeId) {
//        return resumeService.deleteResume(resumeId);
//    }
//
//    // 이력서 공개 여부 설정
//    @PatchMapping("/{resumeId}/public")
//    public Object updatePublicStatus(
//            @PathVariable Long resumeId,
//            @RequestBody Object request
//    ) {
//        return resumeService.updatePublicStatus(resumeId, request);
//    }
