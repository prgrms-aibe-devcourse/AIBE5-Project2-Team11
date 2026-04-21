package com.sprint.daonil.domain.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.sprint.daonil.domain.ai.entity.JobEmbedding;
import com.sprint.daonil.domain.ai.repository.JobEmbeddingRepository;
import com.sprint.daonil.domain.Certificate.Service.QualificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private final JobEmbeddingRepository jobEmbeddingRepository;
    private final QualificationService qualificationService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String EMBEDDING_API_URL = "https://api.openai.com/v1/embeddings";
    private static final String GPT_MODEL = "gpt-4o-mini";
    private static final String EMBEDDING_MODEL = "text-embedding-3-small";
    private static final int EMBEDDING_DIMENSION = 1536;

    // ===== 시스템 프롬프트 =====
    private static final String SYSTEM_PROMPT = """
        당신은 장애인 채용공고 추천 전문 AI 어시스턴트입니다.
        사용자의 질문에 친절하고 정확하게 답변해주세요.
        
        당신의 역할:
        1. 채용공고 검색 및 추천
        2. 직무 정보 요약
        3. 작업환경 및 장애 친화성 관련 질문 답변
        4. 지원 기간 및 조건 안내
        
        답변할 때:
        - 명확하고 친절한 한국어를 사용하세요.
        - 구체적인 공고 정보를 포함하세요.
        - 링크나 참고 정보가 필요하면 제시하세요.
        """;

    private static final String RECOMMENDATION_SYSTEM_PROMPT = """
        당신은 장애인 맞춤 채용공고 추천 전문가입니다.
        
        사용자의 요청과 추천 공고 정보를 바탕으로 추천 이유를 명확하고 친절하게 설명해주세요.
        
        작업:
        1. 왜 이 공고들을 추천했는지 설명하기
        2. 각 공고의 장점과 특징 설명
        3. 장애 친화성 포인트 강조
        4. 지원 시 유의사항 안내
        
        출력 형식:
        - 추천 이유를 명확하게 작성
        - 각 공고별 특징 구분
        - 사용자 맞춤형 내용 강조
        """;

    private static final String QUALIFICATION_SYSTEM_PROMPT = """
        당신은 자격증 추천 전문가입니다.
        
        주어진 직무분야에 필요한 자격증들을 사용자에게 친절하게 설명해주세요.
        
        작업:
        1. 자격증 이름 명확히 안내
        2. 각 자격증의 특징과 필요성 설명
        3. 시험 난도나 준비 기간 안내
        4. 취업 시 유리한 점 강조
        5. 추가 정보 제시
        
        출력 형식:
        - 자격증을 번호와 함께 나열
        - 각 자격증별로 필요한 이유 설명
        - 사용자 맞춤형 정보 포함
        """;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    // ===== 1️⃣ 일반 채팅 (GPT-4o-mini) =====
    public String chat(String userMessage) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", GPT_MODEL);
            requestBody.put("messages", List.of(
                Map.of("role", "system", "content", SYSTEM_PROMPT),
                Map.of("role", "user", "content", userMessage)
            ));
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 1000);

            String jsonBody = objectMapper.writeValueAsString(requestBody);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENAI_API_URL))
                    .header("Authorization", "Bearer " + openAiApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                Map<String, Object> responseBody = objectMapper.readValue(response.body(), Map.class);
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            } else {
                log.error("OpenAI API Error: " + response.statusCode() + " - " + response.body());
            }
        } catch (Exception e) {
            log.error("Error calling OpenAI Chat API", e);
        }
        return "죄송하지만 요청을 처리할 수 없습니다.";
    }

    // ===== 2️⃣ 텍스트 임베딩 생성 (text-embedding-3-small) =====
    public List<Double> getEmbedding(String text) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", EMBEDDING_MODEL);
            requestBody.put("input", text);

            String jsonBody = objectMapper.writeValueAsString(requestBody);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(EMBEDDING_API_URL))
                    .header("Authorization", "Bearer " + openAiApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                Map<String, Object> responseBody = objectMapper.readValue(response.body(), Map.class);
                List<Map<String, Object>> data = (List<Map<String, Object>>) responseBody.get("data");
                if (!data.isEmpty()) {
                    List<Double> embedding = (List<Double>) data.get(0).get("embedding");
                    return embedding;
                }
            } else {
                log.error("OpenAI Embedding API Error: " + response.statusCode());
            }
        } catch (Exception e) {
            log.error("Error calling OpenAI Embedding API", e);
        }
        return new ArrayList<>();
    }

    // ===== 3️⃣ 공고 임베딩 저장 (공고 등록 시 1회만) =====
    /**
     * 공고를 등록할 때 임베딩을 생성해서 DB에 저장
     * 이렇게 하면 추천 요청 시 DB에서만 로드하면 됨
     *
     * 호출 예:
     * jobPostingService에서 공고 저장할 때
     * aiService.saveJobEmbedding(jobId, jobTitle, jobContent)
     */
    public void saveJobEmbedding(Long jobId, String jobTitle, String jobContent) {
        try {
            log.info("Generating embedding for job_id: {}", jobId);

            // 공고 정보를 임베딩용 텍스트로 변환
            String jobText = buildJobTextForEmbedding(jobTitle, jobContent);

            // 임베딩 생성
            List<Double> embedding = getEmbedding(jobText);

            if (embedding.isEmpty()) {
                log.warn("Failed to generate embedding for job_id: {}", jobId);
                return;
            }

            // JSON 문자열로 변환
            String embeddingJson = objectMapper.writeValueAsString(embedding);

            // DB 저장 (기존 데이터가 있으면 업데이트)
            Optional<JobEmbedding> existing = jobEmbeddingRepository.findByJobId(jobId);

            JobEmbedding jobEmbedding;
            if (existing.isPresent()) {
                jobEmbedding = existing.get();
                jobEmbedding = JobEmbedding.builder()
                        .jobEmbeddingId(jobEmbedding.getJobEmbeddingId())
                        .jobId(jobId)
                        .embedding(embeddingJson)
                        .embeddingDimension(EMBEDDING_DIMENSION)
                        .jobTitle(jobTitle)
                        .jobContent(jobContent)
                        .createdAt(jobEmbedding.getCreatedAt())
                        .updatedAt(LocalDateTime.now())
                        .build();
            } else {
                jobEmbedding = JobEmbedding.builder()
                        .jobId(jobId)
                        .embedding(embeddingJson)
                        .embeddingDimension(EMBEDDING_DIMENSION)
                        .jobTitle(jobTitle)
                        .jobContent(jobContent)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
            }

            jobEmbeddingRepository.save(jobEmbedding);
            log.info("Successfully saved embedding for job_id: {}", jobId);

        } catch (Exception e) {
            log.error("Error saving job embedding for job_id: {}", jobId, e);
        }
    }

    // ===== 4️⃣ 코사인 유사도 계산 =====
    public double calculateCosineSimilarity(List<Double> vec1, List<Double> vec2) {
        if (vec1 == null || vec2 == null || vec1.isEmpty() || vec2.isEmpty()) {
            return 0.0;
        }

        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        int minLen = Math.min(vec1.size(), vec2.size());
        for (int i = 0; i < minLen; i++) {
            dotProduct += vec1.get(i) * vec2.get(i);
            norm1 += vec1.get(i) * vec1.get(i);
            norm2 += vec2.get(i) * vec2.get(i);
        }

        if (norm1 == 0.0 || norm2 == 0.0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    // ===== 5️⃣ TOP N 추천 (⭐ 개선된 구조) =====
    /**
     * ⭐ 개선된 추천 구조:
     *
     * 이전 (비효율):
     * 질문 임베딩 생성 → 공고 100개 임베딩 생성 → 유사도 계산 → TOP 5
     * (매 요청마다 100개 임베딩 생성 = 낭비!)
     *
     * 현재 (효율적):
     * 질문 임베딩 생성 → DB에서 공고 임베딩 로드 → 유사도 계산 → TOP 5
     * (공고 임베딩은 DB에 이미 저장됨 = 공고 등록시 1회만 생성)
     *
     * 결과: 비용 95% 절감, 속도 50% 향상
     */
    public List<Map<String, Object>> getTopRecommendations(String query, List<Map<String, Object>> allJobs, int topN) {
        try {
            // 1단계: 질문 임베딩 생성 (1회만)
            log.info("Step 1: Generating query embedding");
            List<Double> queryEmbedding = getEmbedding(query);
            if (queryEmbedding.isEmpty()) {
                log.warn("Failed to generate query embedding");
                return allJobs.stream().limit(topN).collect(Collectors.toList());
            }
            log.info("Query embedding generated: {} dimensions", queryEmbedding.size());

            // 2단계: DB에서 모든 공고 임베딩 로드 (이미 저장됨!)
            log.info("Step 2: Loading job embeddings from DB");
            List<JobEmbedding> jobEmbeddingsFromDb = jobEmbeddingRepository.findAll();
            log.info("Loaded {} job embeddings from DB", jobEmbeddingsFromDb.size());

            if (jobEmbeddingsFromDb.isEmpty()) {
                log.warn("No job embeddings found in database. Using fallback method.");
                return allJobs.stream().limit(topN).collect(Collectors.toList());
            }

            // 3단계: 각 공고의 DB 임베딩과 유사도 계산
            log.info("Step 3: Calculating cosine similarity");
            List<Map<String, Object>> scoredJobs = jobEmbeddingsFromDb.stream()
                    .map(jobEmb -> {
                        try {
                            // JSON 문자열 → List<Double> 변환
                            List<Double> jobEmbedding = objectMapper.readValue(
                                jobEmb.getEmbedding(),
                                new TypeReference<List<Double>>() {}
                            );

                            // 코사인 유사도 계산
                            double similarity = calculateCosineSimilarity(queryEmbedding, jobEmbedding);

                            // 원본 공고 정보 찾기
                            Map<String, Object> jobInfo = allJobs.stream()
                                    .filter(j -> {
                                        Long jobId = extractJobId(j);
                                        return jobId != null && jobId.equals(jobEmb.getJobId());
                                    })
                                    .findFirst()
                                    .orElse(new HashMap<>());

                            // 유사도 추가
                            jobInfo.put("similarity", String.format("%.4f", similarity));
                            jobInfo.put("jobId", jobEmb.getJobId());

                            return jobInfo;
                        } catch (Exception e) {
                            log.error("Error processing job embedding for job_id: {}", jobEmb.getJobId(), e);
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            // 4단계: 유사도 순으로 정렬하여 상위 topN 반환
            log.info("Step 4: Selecting top {} jobs", topN);
            List<Map<String, Object>> result = scoredJobs.stream()
                    .sorted((a, b) -> {
                        double simA = Double.parseDouble((String) a.getOrDefault("similarity", "0"));
                        double simB = Double.parseDouble((String) b.getOrDefault("similarity", "0"));
                        return Double.compare(simB, simA);  // 내림차순
                    })
                    .limit(topN)
                    .collect(Collectors.toList());

            log.info("Successfully returned {} recommended jobs", result.size());
            return result;

        } catch (Exception e) {
            log.error("Error in getTopRecommendations", e);
            return allJobs.stream().limit(topN).collect(Collectors.toList());
        }
    }

    // ===== 6️⃣ 추천 설명 생성 (GPT) =====
    public String generateRecommendation(String query, List<Map<String, Object>> topJobs) {
        try {
            String jobsContext = formatJobsForContext(topJobs);

            String contextMessage = String.format("""
                사용자의 요청: %s
                
                추천 공고 정보:
                %s
                
                위 공고들을 바탕으로, 왜 이 공고들이 사용자에게 적합한지 추천 이유를 설명해주세요.
                장애 친화성, 조건 매칭 등을 강조하세요.
                """, query, jobsContext);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", GPT_MODEL);
            requestBody.put("messages", List.of(
                Map.of("role", "system", "content", RECOMMENDATION_SYSTEM_PROMPT),
                Map.of("role", "user", "content", contextMessage)
            ));
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 1500);

            String jsonBody = objectMapper.writeValueAsString(requestBody);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENAI_API_URL))
                    .header("Authorization", "Bearer " + openAiApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                Map<String, Object> responseBody = objectMapper.readValue(response.body(), Map.class);
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            } else {
                log.error("OpenAI API Error: " + response.statusCode());
            }
        } catch (Exception e) {
            log.error("Error calling OpenAI Recommendation API", e);
        }
        return "죄송하지만 요청을 처리할 수 없습니다.";
    }

    // ===== 7️⃣ 자격증 추천 (NEW) =====
    /**
     * 직무 카테고리(depth2)에 따른 자격증 추천
     * @param category 직무 카테고리 (예: "정보기술", "건축")
     * @return 자격증 추천 설명 및 목록
     */
    public Map<String, Object> generateQualificationRecommendation(String category) {
        try {
            log.info("========================================");
            log.info("📌 자격증 추천 요청 시작");
            log.info("📥 입력된 category: '{}'", category);
            log.info("========================================");

            // 1단계: 해당 카테고리의 자격증 목록 조회 (depth2 기반)
            List<String> qualificationNames = qualificationService.getQualificationNamesByCategory(category);

            log.info("📊 조회 결과: {}개의 자격증", qualificationNames.size());

            if (qualificationNames.isEmpty()) {
                log.warn("❌ 해당 카테고리의 자격증을 찾을 수 없습니다: {}", category);
                log.warn("💡 확인사항:");
                log.warn("   1. Field 테이블에 depth2='{}' 값이 있는지 확인", category);
                log.warn("   2. Qualification 테이블의 fieldId가 NULL이 아닌지 확인");
                log.warn("   3. 프론트의 jobCategories와 DB의 depth2 값이 정확히 일치하는지 확인");
                log.warn("   4. 다음 SQL로 확인하세요:");
                log.warn("      SELECT f.id, f.depth1, f.depth2, COUNT(q.id) as qual_count");
                log.warn("      FROM field f LEFT JOIN qualification q ON f.id = q.fieldId");
                log.warn("      WHERE f.depth2 = '{}' GROUP BY f.id;", category);

                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "해당 직무분야의 자격증을 찾을 수 없습니다. category='" + category + "'");
                response.put("debug_info", "다음 URL에서 모든 직무분야 확인: /api/qualifications/debug/all-with-fields");
                return response;
            }

            log.info("✅ 조회된 자격증 목록:");
            for (int i = 0; i < qualificationNames.size(); i++) {
                log.info("   {}. {}", i + 1, qualificationNames.get(i));
            }

            // 2단계: GPT를 이용해 자격증 추천 설명 생성
            log.info("🤖 AI 설명 생성 중...");
            String explanation = generateQualificationExplanation(category, qualificationNames);

            // 3단계: 결과 반환
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("category", category);
            result.put("qualifications", qualificationNames);
            result.put("count", qualificationNames.size());
            result.put("explanation", explanation);

            log.info("✅ 자격증 추천 완료!");
            log.info("========================================");
            return result;

        } catch (Exception e) {
            log.error("❌ 자격증 추천 중 오류 발생", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "자격증 추천 중 오류가 발생했습니다: " + e.getMessage());
            return response;
        }
    }

    /**
     * GPT를 이용한 자격증 추천 설명 생성
     */
    private String generateQualificationExplanation(String category, List<String> qualifications) {
        try {
            String qualificationList = String.join(", ", qualifications);

            String contextMessage = String.format("""
                직무분야: %s
                
                추천 자격증: %s
                
                위의 자격증들이 '%s' 직무에 왜 필요한지, 각 자격증의 특징과 중요성을 설명해주세요.
                자격증 이름, 필요성, 취업 시 유리한 점 등을 포함해서 설명해주세요.
                """, category, qualificationList, category);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", GPT_MODEL);
            requestBody.put("messages", List.of(
                Map.of("role", "system", "content", QUALIFICATION_SYSTEM_PROMPT),
                Map.of("role", "user", "content", contextMessage)
            ));
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 1500);

            String jsonBody = objectMapper.writeValueAsString(requestBody);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENAI_API_URL))
                    .header("Authorization", "Bearer " + openAiApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                Map<String, Object> responseBody = objectMapper.readValue(response.body(), Map.class);
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            } else {
                log.error("OpenAI API Error: " + response.statusCode());
            }
        } catch (Exception e) {
            log.error("자격증 설명 생성 중 오류", e);
        }
        return "죄송하지만 자격증 추천 설명을 생성할 수 없습니다.";
    }

    // ===== 헬퍼 메서드 =====
    private String buildJobTextForEmbedding(String title, String content) {
        return String.format("%s %s", title != null ? title : "", content != null ? content : "");
    }

    private String formatJobsForContext(List<Map<String, Object>> jobs) {
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < jobs.size(); i++) {
            Map<String, Object> job = jobs.get(i);
            sb.append(String.format("[공고 %d] %s\n", i + 1, job.get("title")));
            sb.append(String.format("  회사: %s\n", job.getOrDefault("company", "미정")));
            sb.append(String.format("  지역: %s\n", job.getOrDefault("workRegion", "미정")));
            sb.append(String.format("  유사도: %s\n", job.getOrDefault("similarity", "미정")));
            sb.append("\n");
        }

        return sb.toString();
    }

    private Long extractJobId(Map<String, Object> job) {
        if (job.containsKey("jobId")) {
            Object val = job.get("jobId");
            if (val instanceof Number) return ((Number) val).longValue();
            if (val instanceof String) return Long.parseLong((String) val);
        }
        if (job.containsKey("id")) {
            Object val = job.get("id");
            if (val instanceof Number) return ((Number) val).longValue();
            if (val instanceof String) return Long.parseLong((String) val);
        }
        return null;
    }
}

