package com.sprint.daonil.domain.ai.util;

import java.util.*;

/**
 * 장애 유형 및 중증여부에 따른 직업군 선호도 가중치
 *
 * 각 장애 유형마다 33개 직업군에 대한 선호도 가중치를 정의
 * (실제 데이터가 쌓이면 DB에서 로드하도록 변경 가능)
 */
public class DisabilityJobWeights {

    private static final Map<String, Map<String, Double>> DISABILITY_WEIGHTS = new LinkedHashMap<>();

    static {
        // 1. 지체장애
        Map<String, Double> physicalDisability = new LinkedHashMap<>();
        physicalDisability.put("경영·행정·사무직", 0.3935);
        physicalDisability.put("청소 및 기타 개인서비스직", 0.3017);
        physicalDisability.put("경호·경비직", 0.1163);
        physicalDisability.put("돌봄 서비스직(간병·육아)", 0.0386);
        physicalDisability.put("제조 단순직", 0.0319);
        physicalDisability.put("운전·운송직", 0.0142);
        physicalDisability.put("사회복지·종교직", 0.0139);
        physicalDisability.put("보건·의료직", 0.0137);
        physicalDisability.put("음식 서비스직", 0.0092);
        physicalDisability.put("관리직(임원·부서장)", 0.0076);
        // 나머지는 0.0
        for (String category : JobCategoryClassifier.getAllCategories()) {
            physicalDisability.putIfAbsent(category, 0.0);
        }
        DISABILITY_WEIGHTS.put("지체장애", physicalDisability);

        // 2. 시각장애
        Map<String, Double> visualDisability = new LinkedHashMap<>();
        visualDisability.put("경영·행정·사무직", 0.392392);
        visualDisability.put("청소 및 기타 개인서비스직", 0.271927);
        visualDisability.put("경호·경비직", 0.115886);
        visualDisability.put("보건·의료직", 0.060585);
        visualDisability.put("제조 단순직", 0.034519);
        visualDisability.put("돌봄 서비스직(간병·육아)", 0.033462);
        visualDisability.put("음식 서비스직", 0.015146);
        visualDisability.put("사회복지·종교직", 0.009863);
        visualDisability.put("관리직(임원·부서장)", 0.009158);
        visualDisability.put("영업·판매직", 0.007045);
// 나머지는 0.0
        for (String category : JobCategoryClassifier.getAllCategories()) {
            visualDisability.putIfAbsent(category, 0.0);
        }
        DISABILITY_WEIGHTS.put("시각장애", visualDisability);

// 3. 청각장애
        Map<String, Double> hearingDisability = new LinkedHashMap<>();
        hearingDisability.put("청소 및 기타 개인서비스직", 0.349725);
        hearingDisability.put("경영·행정·사무직", 0.284044);
        hearingDisability.put("경호·경비직", 0.184663);
        hearingDisability.put("제조 단순직", 0.035763);
        hearingDisability.put("돌봄 서비스직(간병·육아)", 0.035076);
        hearingDisability.put("음식 서비스직", 0.018226);
        hearingDisability.put("사회복지·종교직", 0.011348);
        hearingDisability.put("전기·전자 설치·정비·생산직", 0.009629);
        hearingDisability.put("보건·의료직", 0.008941);
        hearingDisability.put("관리직(임원·부서장)", 0.008253);
// 나머지는 0.0
        for (String category : JobCategoryClassifier.getAllCategories()) {
            hearingDisability.putIfAbsent(category, 0.0);
        }
        DISABILITY_WEIGHTS.put("청각장애", hearingDisability);

// 4. 언어장애
        Map<String, Double> speechDisability = new LinkedHashMap<>();
        speechDisability.put("경영·행정·사무직", 0.446309);
        speechDisability.put("청소 및 기타 개인서비스직", 0.305369);
        speechDisability.put("제조 단순직", 0.050336);
        speechDisability.put("경호·경비직", 0.036913);
        speechDisability.put("음식 서비스직", 0.026846);
        speechDisability.put("돌봄 서비스직(간병·육아)", 0.016779);
        speechDisability.put("영업·판매직", 0.013423);
        speechDisability.put("보건·의료직", 0.013423);
        speechDisability.put("섬유·의복 생산직", 0.013423);
        speechDisability.put("건설·채굴직", 0.010067);
// 나머지는 0.0
        for (String category : JobCategoryClassifier.getAllCategories()) {
            speechDisability.putIfAbsent(category, 0.0);
        }
        DISABILITY_WEIGHTS.put("언어장애", speechDisability);

// 5. 지적장애
        Map<String, Double> intellectualDisability = new LinkedHashMap<>();
        intellectualDisability.put("청소 및 기타 개인서비스직", 0.289607);
        intellectualDisability.put("경영·행정·사무직", 0.256960);
        intellectualDisability.put("제조 단순직", 0.130389);
        intellectualDisability.put("음식 서비스직", 0.074771);
        intellectualDisability.put("돌봄 서비스직(간병·육아)", 0.045547);
        intellectualDisability.put("식품 가공·생산직", 0.034753);
        intellectualDisability.put("보건·의료직", 0.027118);
        intellectualDisability.put("인쇄·목재·공예 및 기타 설치·정비·생산직", 0.025933);
        intellectualDisability.put("영업·판매직", 0.021194);
        intellectualDisability.put("예술·디자인·방송직", 0.016192);
// 나머지는 0.0
        for (String category : JobCategoryClassifier.getAllCategories()) {
            intellectualDisability.putIfAbsent(category, 0.0);
        }
        DISABILITY_WEIGHTS.put("지적장애", intellectualDisability);

// 6. 정신장애
        Map<String, Double> mentalDisability = new LinkedHashMap<>();
        mentalDisability.put("경영·행정·사무직", 0.447917);
        mentalDisability.put("청소 및 기타 개인서비스직", 0.187500);
        mentalDisability.put("음식 서비스직", 0.093750);
        mentalDisability.put("돌봄 서비스직(간병·육아)", 0.062500);
        mentalDisability.put("제조 단순직", 0.052083);
        mentalDisability.put("예술·디자인·방송직", 0.031250);
        mentalDisability.put("경호·경비직", 0.020833);
        mentalDisability.put("식품 가공·생산직", 0.020833);
        mentalDisability.put("보건·의료직", 0.020833);
        mentalDisability.put("교육직", 0.010417);
// 나머지는 0.0
        for (String category : JobCategoryClassifier.getAllCategories()) {
            mentalDisability.putIfAbsent(category, 0.0);
        }
        DISABILITY_WEIGHTS.put("정신장애", mentalDisability);

        // 장애 유형이 없거나 전체 경우 (균등 분배 또는 기본값)
        Map<String, Double> defaultWeights = new LinkedHashMap<>();
        double uniformWeight = 1.0 / JobCategoryClassifier.getAllCategories().size();
        for (String category : JobCategoryClassifier.getAllCategories()) {
            defaultWeights.put(category, uniformWeight);
        }
        DISABILITY_WEIGHTS.put("전체", defaultWeights);
    }

    /**
     * 장애 유형에 따른 직업군 가중치 조회
     *
     * @param disabilityType 장애 유형 (예: "지체장애", "시각장애")
     * @return 직업군별 가중치 맵
     */
    public static Map<String, Double> getWeightsByDisability(String disabilityType) {
        Map<String, Double> weights = DISABILITY_WEIGHTS.get(disabilityType);
        if (weights == null) {
            // 알 수 없는 장애 유형의 경우 기본값 반환
            return DISABILITY_WEIGHTS.get("전체");
        }
        return new HashMap<>(weights);
    }

    /**
     * 중증도를 반영한 가중치 조정 (선택사항)
     * 현재는 미사용, 나중에 필요시 구현
     *
     * @param weights 기본 가중치
     * @param severity 중증도 ("경증", "중증")
     * @return 조정된 가중치
     */
    public static Map<String, Double> adjustBySeverity(Map<String, Double> weights, String severity) {
        // TODO: 중증도에 따른 가중치 조정 로직 (필요시 구현)
        return weights;
    }

    /**
     * 모든 장애 유형 목록
     */
    public static List<String> getAllDisabilityTypes() {
        return new ArrayList<>(DISABILITY_WEIGHTS.keySet());
    }
}

