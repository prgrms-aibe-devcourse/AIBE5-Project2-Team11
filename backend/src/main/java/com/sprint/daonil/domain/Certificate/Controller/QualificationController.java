package com.sprint.daonil.domain.Certificate.Controller;

import com.sprint.daonil.domain.Certificate.Entity.Qualification;
import com.sprint.daonil.domain.Certificate.Service.QualificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/qualifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QualificationController {

    private final QualificationService qualificationService;

    /**
     * 직무 카테고리(depth2)로 자격증 조회
     * @param category 직무 카테고리
     * @return 자격증명 리스트
     */
    @GetMapping("/by-category")
    public ResponseEntity<?> getQualificationsByCategory(@RequestParam String category) {
        try {
            log.info("자격증 조회 요청: category={}", category);
            List<Qualification> qualifications = qualificationService.getQualificationsByCategory(category);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", qualifications);
            response.put("count", qualifications.size());
            response.put("category", category);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("자격증 조회 오류", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "자격증 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 직무분야(fieldId)로 자격증 조회
     * @param fieldId 직무분야 ID
     * @return 자격증 리스트
     */
    @GetMapping("/by-field/{fieldId}")
    public ResponseEntity<?> getQualificationsByField(@PathVariable String fieldId) {
        try {
            log.info("자격증 조회 요청: fieldId={}", fieldId);
            List<Qualification> qualifications = qualificationService.getQualificationsByField(fieldId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", qualifications);
            response.put("count", qualifications.size());
            response.put("fieldId", fieldId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("자격증 조회 오류", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "자격증 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 자격증명으로 검색
     * @param keyword 검색 키워드
     * @return 검색 결과 자격증 리스트
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchQualifications(@RequestParam String keyword) {
        try {
            log.info("자격증 검색 요청: keyword={}", keyword);
            List<Qualification> qualifications = qualificationService.searchQualifications(keyword);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", qualifications);
            response.put("count", qualifications.size());
            response.put("keyword", keyword);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("자격증 검색 오류", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "검색 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 자격증 상세 정보 조회 (자격증명 기반) - 시험 일정 포함
     * @param name 자격증명
     * @return 자격증 상세 정보 및 시험 일정
     */
    @GetMapping("/detail")
    public ResponseEntity<?> getQualificationDetail(
            @RequestParam(value = "name", required = false) String name) {
        try {
            // name이 없으면 에러
            if (name == null || name.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "자격증명(name)이 필요합니다");
                return ResponseEntity.badRequest().body(response);
            }

            log.info("자격증 상세 조회 요청: name={}", name);
            // 시험 일정을 포함하여 조회 (Lazy loading 강제 실행)
            Qualification qualification = qualificationService.getQualificationDetailWithExamDates(name);

            if (qualification == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "해당 자격증을 찾을 수 없습니다");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("name", qualification.getName());
            response.put("jmcd", qualification.getJMCD());
            response.put("course", qualification.getCourse());
            
            // Field 정보
            if (qualification.getField() != null) {
                response.put("fieldId", qualification.getField().getId());
                response.put("depth1", qualification.getField().getDepth1());
                response.put("depth2", qualification.getField().getDepth2());
            }
            
            // 시험 일정 정보 추가
            List<Map<String, Object>> examSchedules = new ArrayList<>();
            if (qualification.getExamDates() != null && !qualification.getExamDates().isEmpty()) {
                for (var examDate : qualification.getExamDates()) {
                    Map<String, Object> schedule = new HashMap<>();
                    
                    // ExamDateId 정보
                    if (examDate.getId() != null) {
                        schedule.put("year", examDate.getId().getYear());
                        schedule.put("period", examDate.getId().getPeriod());
                        schedule.put("jmcd", examDate.getId().getJmCd());
                    }
                    
                    // 필기시험 정보
                    Map<String, Object> docExam = new HashMap<>();
                    docExam.put("regStart", examDate.getDocRegStart());
                    docExam.put("regEnd", examDate.getDocRegEnd());
                    docExam.put("vacancyStart", examDate.getDocVacancyStart());
                    docExam.put("vacancyEnd", examDate.getDocVacancyEnd());
                    docExam.put("examStart", examDate.getDocExamStart());
                    docExam.put("examEnd", examDate.getDocExamEnd());
                    docExam.put("passAnnounce", examDate.getDocPass());
                    schedule.put("docExam", docExam);
                    
                    // 실기시험 정보
                    Map<String, Object> pracExam = new HashMap<>();
                    pracExam.put("regStart", examDate.getPracRegStart());
                    pracExam.put("regEnd", examDate.getPracRegEnd());
                    pracExam.put("vacancyStart", examDate.getPracVacancyStart());
                    pracExam.put("vacancyEnd", examDate.getPracVacancyEnd());
                    pracExam.put("examStart", examDate.getPracExamStart());
                    pracExam.put("examEnd", examDate.getPracExamEnd());
                    pracExam.put("passAnnounce", examDate.getPracPass());
                    schedule.put("pracExam", pracExam);
                    
                    examSchedules.add(schedule);
                }
            }
            
            response.put("examSchedules", examSchedules);
            response.put("scheduleCount", examSchedules.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("자격증 상세 조회 오류", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 모든 자격증 조회
     * @return 자격증 리스트
     */
    @GetMapping
    public ResponseEntity<?> getAllQualifications() {
        try {
            log.info("모든 자격증 조회 요청");
            List<Qualification> qualifications = qualificationService.getAllQualifications();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", qualifications);
            response.put("count", qualifications.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("자격증 조회 오류", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 디버그용: 모든 자격증과 필드 정보 조회 (Field와의 관계 확인)
     * @return 모든 자격증과 그들의 필드 정보
     */
    @GetMapping("/debug/all-with-fields")
    public ResponseEntity<?> debugAllQualificationsWithFields() {
        try {
            log.info("디버그: 모든 자격증 + 필드 정보 조회");
            List<Qualification> qualifications = qualificationService.getAllQualifications();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", qualifications.size());
            
            List<Map<String, Object>> details = new ArrayList<>();
            int nullFieldCount = 0;
            for (Qualification q : qualifications) {
                Map<String, Object> detail = new HashMap<>();
                detail.put("qualification_id", q.getId());
                detail.put("qualification_name", q.getName());
                detail.put("jmcd", q.getJMCD());
                detail.put("qualification_fieldId", q.getField() != null ? q.getField().getId() : "NULL");

                // 중요: Qualification 테이블에는 depth1, depth2가 없습니다!
                // depth1, depth2는 Field 테이블에만 있으며, fieldId로 연결됩니다
                if (q.getField() != null) {
                    detail.put("field_id", q.getField().getId());
                    detail.put("field_depth1", q.getField().getDepth1());
                    detail.put("field_depth2", q.getField().getDepth2());
                } else {
                    detail.put("field_id", "NULL");
                    detail.put("field_depth1", "NULL");
                    detail.put("field_depth2", "NULL");
                    nullFieldCount++;
                }
                details.add(detail);
            }
            
            response.put("qualifications", details);
            response.put("null_fieldId_count", nullFieldCount);
            response.put("with_fieldId_count", qualifications.size() - nullFieldCount);

            // 중복 확인: depth2별 그룹화
            Map<String, Long> depth2Count = qualifications.stream()
                .filter(q -> q.getField() != null)
                .collect(Collectors.groupingBy(
                    q -> q.getField().getDepth2(),
                    Collectors.counting()
                ));
            
            response.put("depth2_summary", depth2Count);
            
            // 찾고 있는 카테고리가 있는지 확인
            response.put("available_depth2_values", depth2Count.keySet());
            
            // 중요 안내
            response.put("important_note",
                "⚠️ Qualification 테이블에는 depth1, depth2가 없습니다! " +
                "depth1, depth2는 Field 테이블에만 있으며, Qualification.fieldId로 연결됩니다. " +
                "null_fieldId_count > 0이면 qualification의 fieldId가 설정되지 않았다는 뜻입니다. " +
                "DB의 qualification 테이블에서 fieldId를 설정해야 합니다.");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("디버그 조회 오류", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "디버그 조회 중 오류: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 디버그용: 프론트의 jobCategories 리스트와 DB의 depth2 비교
     * @param categories 프론트에서 보내는 카테고리 리스트
     * @return 매칭 여부 확인
     */
    @PostMapping("/debug/compare-categories")
    public ResponseEntity<?> debugCompareCategories(@RequestBody List<String> categories) {
        try {
            log.info("디버그: 프론트 카테고리와 DB depth2 비교");
            
            List<Qualification> allQuals = qualificationService.getAllQualifications();
            Set<String> dbDepth2Values = allQuals.stream()
                .filter(q -> q.getField() != null)
                .map(q -> q.getField().getDepth2())
                .collect(Collectors.toSet());
            
            Map<String, Object> response = new HashMap<>();
            response.put("front_categories", categories);
            response.put("db_depth2_values", dbDepth2Values);
            
            List<Map<String, Object>> comparison = new ArrayList<>();
            for (String cat : categories) {
                Map<String, Object> comp = new HashMap<>();
                comp.put("category", cat);
                comp.put("exists_in_db", dbDepth2Values.contains(cat));
                
                // DB에서 몇 개의 자격증이 있는지
                long count = allQuals.stream()
                    .filter(q -> q.getField() != null && cat.equals(q.getField().getDepth2()))
                    .count();
                comp.put("qualification_count", count);
                
                comparison.add(comp);
            }
            
            response.put("comparison", comparison);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("비교 오류", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "비교 중 오류: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

