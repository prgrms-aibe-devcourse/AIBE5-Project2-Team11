package com.sprint.daonil.domain.ai.controller;

import com.sprint.daonil.domain.ai.dto.AiChatRequest;
import com.sprint.daonil.domain.ai.dto.AiChatResponse;
import com.sprint.daonil.domain.ai.dto.AiRecommendRequest;
import com.sprint.daonil.domain.ai.service.AiService;
import com.sprint.daonil.domain.jobposting.entity.JobPosting;
import com.sprint.daonil.domain.jobposting.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;
    private final JobPostingRepository jobPostingRepository;

    /**
     * GPT-4o-mini를 사용한 일반 채팅
     */
    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        try {
            log.info("Chat request: {}", request.getMessage());
            String response = aiService.chat(request.getMessage());
            return ResponseEntity.ok(new AiChatResponse(response));
        } catch (Exception e) {
            log.error("Error in chat endpoint", e);
            return ResponseEntity.badRequest().body(new AiChatResponse("오류가 발생했습니다."));
        }
    }

    /**
     * 텍스트 임베딩 - text-embedding-3-small 사용
     *
     * 임베딩은 벡터화된 결과를 반환하며, 유사도 검색에 사용됨
     */
    @PostMapping("/embedding")
    public ResponseEntity<?> getEmbedding(@RequestBody AiChatRequest request) {
        try {
            log.info("Embedding request: {}", request.getMessage());
            List<Double> embedding = aiService.getEmbedding(request.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("text", request.getMessage());
            response.put("embedding", embedding);
            response.put("dimension", embedding.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in embedding endpoint", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 채용공고 추천 (DB 직접 조회 + 필터링)
     *
     * Request:
     * {
     *   "query": "사용자 질문",
     *   "region": "서울",  // work_region에서 검색
     *   "subCategory": "사회복지·종교직"  // sub_category와 정확히 매칭
     * }
     *
     * Process:
     * 1. DB에서 region + subCategory로 필터링된 공고 조회
     * 2. 임베딩 기반 TOP 5 추천 공고 선택
     * 3. GPT로 추천 설명 생성
     */
    @PostMapping("/recommend")
    public ResponseEntity<Map<String, Object>> recommend(@RequestBody Map<String, Object> request) {
        try {
            String query = (String) request.get("query");
            String region = (String) request.get("region");
            String subCategory = (String) request.get("subCategory");

            log.info("Recommendation request: query={}, region={}, subCategory={}", query, region, subCategory);

            // 1단계: DB에서 필터링된 공고 조회
            List<JobPosting> dbJobs = jobPostingRepository.findAll();

            // 지역 필터링
            if (region != null && !region.isEmpty() && !"전체".equals(region)) {
                dbJobs = dbJobs.stream()
                        .filter(job -> job.getWorkRegion() != null && job.getWorkRegion().contains(region))
                        .collect(Collectors.toList());
            }
            
            // 소분류 필터링
            if (subCategory != null && !subCategory.isEmpty()) {
                dbJobs = dbJobs.stream()
                        .filter(job -> subCategory.equals(job.getSubCategory()))
                        .collect(Collectors.toList());
            }

            log.info("Filtered jobs from DB: {} jobs", dbJobs.size());

            if (dbJobs.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "해당 조건의 공고가 없습니다"));
            }

            // JobPosting을 Map으로 변환 (AI 서비스에 전달)
            List<Map<String, Object>> filteredJobsMap = dbJobs.stream()
                    .map(job -> {
                        Map<String, Object> jobMap = new HashMap<>();
                        jobMap.put("id", job.getJobPostingId());  // 프론트엔드가 찾는 필드
                        jobMap.put("job_posting_id", job.getJobPostingId());
                        jobMap.put("title", job.getTitle());
                        jobMap.put("jobNm", job.getTitle());
                        jobMap.put("company", job.getCompany() != null ? job.getCompany().getCompanyName() : "미정");
                        jobMap.put("busplaName", job.getCompany() != null ? job.getCompany().getCompanyName() : "미정");
                        jobMap.put("sub_category", job.getSubCategory());
                        jobMap.put("job_category", job.getSubCategory());
                        jobMap.put("work_region", job.getWorkRegion());
                        jobMap.put("content", job.getContent());
                        return jobMap;
                    })
                    .collect(Collectors.toList());

            // 2단계: 임베딩 기반 TOP 5 추천 공고 선택
            int topN = 5;
            List<Map<String, Object>> topJobs = aiService.getTopRecommendations(query, filteredJobsMap, topN);

            // 3단계: 선택된 공고에 대한 추천 설명 생성
            String explanation = aiService.generateRecommendation(query, topJobs);

            Map<String, Object> response = new HashMap<>();
            response.put("query", query);
            response.put("topJobs", topJobs);
            response.put("explanation", explanation);
            response.put("count", topJobs.size());
            response.put("filtered_count", filteredJobsMap.size());
            response.put("region", region);
            response.put("subCategory", subCategory);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in recommend endpoint", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "오류가 발생했습니다: " + e.getMessage()));
        }
    }

    /**
     * 유사도 계산 테스트 엔드포인트
     *
     * 두 텍스트의 임베딩 유사도를 계산
     */
    @PostMapping("/similarity")
    public ResponseEntity<?> calculateSimilarity(@RequestBody Map<String, String> request) {
        try {
            String text1 = request.get("text1");
            String text2 = request.get("text2");

            log.info("Similarity request: text1={}, text2={}", text1, text2);

            List<Double> embedding1 = aiService.getEmbedding(text1);
            List<Double> embedding2 = aiService.getEmbedding(text2);

            double similarity = aiService.calculateCosineSimilarity(embedding1, embedding2);

            Map<String, Object> response = new HashMap<>();
            response.put("text1", text1);
            response.put("text2", text2);
            response.put("similarity", similarity);
            response.put("percentage", String.format("%.2f%%", similarity * 100));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in similarity endpoint", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "오류가 발생했습니다"));
        }
    }

    /**
     * 자격증 추천 엔드포인트
     *
     * 직무 카테고리(depth2)에 따른 자격증 추천
     *
     * Request:
     * {
     *   "category": "정보기술" 또는 "건축" 등 직무명
     * }
     *
     * Response:
     * {
     *   "success": true,
     *   "category": "정보기술",
     *   "qualifications": ["정보처리기사", "리눅스마스터", ...],
     *   "count": 5,
     *   "explanation": "AI가 생성한 자격증 추천 설명"
     * }
     */
    @PostMapping("/recommend/qualifications")
    public ResponseEntity<Map<String, Object>> recommendQualifications(@RequestBody Map<String, String> request) {
        try {
            String category = request.get("category");

            if (category == null || category.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "직무 카테고리를 입력해주세요"));
            }

            log.info("Qualification recommendation request: category={}", category);

            Map<String, Object> result = aiService.generateQualificationRecommendation(category);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error in qualification recommendation endpoint", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "오류가 발생했습니다: " + e.getMessage()));
        }
    }

    /**
     * ⭐ 새로운 엔드포인트: 장애 유형별 공고 추천 (하이브리드 방식)
     *
     * 공고 제목 → 33개 직업군 가중치 변환 → 장애 유형별 가중치와 매칭 → 점수 계산
     *
     * Request:
     * {
     *   "disabilityType": "지체장애", "시각장애", "청각장애", "언어장애", "지적장애", "정신장애"
     *   "region": "서울" (선택사항)
     *   "topN": 3 (상위 몇 개 추천할 것인지, 기본값 3)
     * }
     *
     * Response:
     * {
     *   "success": true,
     *   "disabilityType": "지체장애",
     *   "region": "서울",
     *   "recommendations": [
     *     {
     *       "title": "공고 제목",
     *       "company": "회사명",
     *       "region": "지역",
     *       "matchScore": 0.0542,
     *       "jobCategoryVector": { ... },
     *       "explanation": "이 공고는..."
     *     }
     *   ]
     * }
     */
    @PostMapping("/recommend/disability")
    public ResponseEntity<Map<String, Object>> recommendByDisability(@RequestBody Map<String, Object> request) {
        try {
            String disabilityType = (String) request.get("disabilityType");
            String region = (String) request.get("region");
            Integer topN = (Integer) request.getOrDefault("topN", 3);

            if (disabilityType == null || disabilityType.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "장애 유형을 입력해주세요"));
            }

            log.info("Disability-based recommendation request: disability={}, region={}, topN={}", disabilityType, region, topN);

            // 1단계: DB에서 모든 활성화된 공고 조회
            List<JobPosting> allJobs = jobPostingRepository.findAll().stream()
                    .filter(job -> !job.getIsClosed())  // 마감되지 않은 공고만
                    .collect(Collectors.toList());

            // 지역 필터링
            if (region != null && !region.isEmpty() && !"전체".equals(region)) {
                allJobs = allJobs.stream()
                        .filter(job -> job.getWorkRegion() != null && job.getWorkRegion().contains(region))
                        .collect(Collectors.toList());
                log.info("Filtered by region: {} (jobs: {})", region, allJobs.size());
            }

            // JobPosting을 Map으로 변환
            List<Map<String, Object>> jobsMap = allJobs.stream()
                    .map(job -> {
                        Map<String, Object> jobMap = new HashMap<>();
                        jobMap.put("id", job.getJobPostingId());
                        jobMap.put("jobPostingId", job.getJobPostingId());
                        jobMap.put("job_posting_id", job.getJobPostingId());
                        jobMap.put("title", job.getTitle());
                        jobMap.put("jobNm", job.getTitle());
                        jobMap.put("company", job.getCompany() != null ? job.getCompany().getCompanyName() : "미정");
                        jobMap.put("busplaName", job.getCompany() != null ? job.getCompany().getCompanyName() : "미정");
                        jobMap.put("sub_category", job.getSubCategory());
                        jobMap.put("job_category", job.getSubCategory());
                        jobMap.put("work_region", job.getWorkRegion());
                        jobMap.put("content", job.getContent());
                        return jobMap;
                    })
                    .collect(Collectors.toList());

            log.info("Total jobs loaded: {}", jobsMap.size());

            // 2단계: 장애 유형별 추천 점수 계산
            List<Map<String, Object>> recommendations = aiService.getDisabilityBasedRecommendations(
                    jobsMap,
                    disabilityType,
                    topN
            );

            // 3단계: 추천 설명 생성 (선택사항)
            String explanation = aiService.generateDisabilityRecommendationExplanation(
                    disabilityType,
                    recommendations
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("disabilityType", disabilityType);
            if (region != null && !region.isEmpty()) {
                response.put("region", region);
            }
            response.put("count", recommendations.size());
            response.put("totalJobCount", jobsMap.size());
            response.put("recommendations", recommendations);
            response.put("explanation", explanation);

            log.info("Successfully generated {} recommendations for disability: {}", recommendations.size(), disabilityType);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error in disability-based recommendation endpoint", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "오류가 발생했습니다: " + e.getMessage()));
        }
    }

}
