package com.sprint.daonil.domain.qualification.controller;

import com.sprint.daonil.domain.qualification.dto.ExamScheduleDto;
import com.sprint.daonil.domain.qualification.dto.QualificationResponseDto;
import com.sprint.daonil.domain.qualification.service.QualificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/qualifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class QualificationController {

    private final QualificationService qualificationService;

    /**
     * 직무분야별 자격증 조회
     * GET /api/qualifications/by-field/{fieldId}
     */
    @GetMapping("/by-field/{fieldId}")
    public ResponseEntity<Map<String, Object>> getQualificationsByField(@PathVariable String fieldId) {
        try {
            List<QualificationResponseDto> qualifications = qualificationService.getQualificationsByField(fieldId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", qualifications);
            response.put("count", qualifications.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("자격증 조회 실패: {}", e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "자격증 조회에 실패했습니다.");

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * 직무 카테고리로 자격증 조회
     * GET /api/qualifications/by-category?category={category}
     */
    @GetMapping("/by-category")
    public ResponseEntity<Map<String, Object>> getQualificationsByCategory(@RequestParam String category) {
        try {
            List<QualificationResponseDto> qualifications = qualificationService.getQualificationsByCategory(category);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", qualifications);
            response.put("count", qualifications.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("자격증 조회 실패: {}", e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "자격증 조회에 실패했습니다.");
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * 모든 자격증 조회
     * GET /api/qualifications
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllQualifications() {
        try {
            List<QualificationResponseDto> qualifications = qualificationService.getAllQualifications();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", qualifications);
            response.put("count", qualifications.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("자격증 조회 실패: {}", e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "자격증 조회에 실패했습니다.");

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * 자격증 시험일정 조회
     * GET /api/qualifications/{jmcd}/schedules
     */
    @GetMapping("/{jmcd}/schedules")
    public ResponseEntity<Map<String, Object>> getExamSchedules(@PathVariable String jmcd) {
        try {
            List<ExamScheduleDto> schedules = qualificationService.getExamSchedules(jmcd);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", schedules);
            response.put("count", schedules.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("시험일정 조회 실패: {}", e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "시험일정 조회에 실패했습니다.");

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}

