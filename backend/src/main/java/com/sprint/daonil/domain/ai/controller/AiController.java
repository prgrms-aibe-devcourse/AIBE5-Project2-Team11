package com.sprint.daonil.domain.ai.controller;

import com.sprint.daonil.domain.ai.dto.AiChatRequest;
import com.sprint.daonil.domain.ai.dto.AiChatResponse;
import com.sprint.daonil.domain.ai.dto.AiRecommendRequest;
import com.sprint.daonil.domain.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;

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
     * 채용공고 추천 (개선된 버전)
     *
     * 방식: 임베딩 기반 유사도 검색 → TOP 5 선택 → GPT로 설명
     *
     * Request:
     * {
     *   "query": "사용자 질문",
     *   "jobs": [ { 공고 객체들... } ]  // 전체 공고 리스트
     * }
     *
     * Process:
     * 1. 질문 임베딩 생성
     * 2. 각 공고와 유사도 계산
     * 3. TOP 5 선택
     * 4. GPT에 설명 요청
     */
    @PostMapping("/recommend")
    public ResponseEntity<Map<String, Object>> recommend(@RequestBody Map<String, Object> request) {
        try {
            String query = (String) request.get("query");
            List<Map<String, Object>> jobs = (List<Map<String, Object>>) request.get("jobs");

            log.info("Recommendation request: query={}, jobs count={}", query, jobs != null ? jobs.size() : 0);

            if (jobs == null || jobs.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "공고 데이터가 없습니다"));
            }

            // 1단계: 임베딩 기반 TOP 5 추천 공고 선택
            int topN = 5;
            List<Map<String, Object>> topJobs = aiService.getTopRecommendations(query, jobs, topN);

            // 2단계: 선택된 공고에 대한 추천 설명 생성
            String explanation = aiService.generateRecommendation(query, topJobs);

            Map<String, Object> response = new HashMap<>();
            response.put("query", query);
            response.put("topJobs", topJobs);
            response.put("explanation", explanation);
            response.put("count", topJobs.size());

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
}

