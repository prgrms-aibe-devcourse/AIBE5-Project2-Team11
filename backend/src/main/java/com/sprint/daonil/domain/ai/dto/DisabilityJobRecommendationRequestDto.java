package com.sprint.daonil.domain.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * 장애 맞춤형 공고 추천 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisabilityJobRecommendationRequestDto {
    // 사용자의 장애 유형 (예: "지체장애", "시각장애")
    private String disabilityType;

    // 사용자의 중증도 (예: "경증", "중증")
    private String severity;

    // 지역 필터 (선택)
    private String region;

    // 직무 필터 (선택)
    private String jobCategory;

    // 페이지 번호
    private int page;

    // 페이지 크기
    private int size;
}

