package com.sprint.daonil.domain.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * 장애 맞춤형 공고 추천 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisabilityJobRecommendationResponseDto {

    // 공고 ID
    private Long jobPostingId;

    // 공고 제목
    private String title;

    // 회사명
    private String companyName;

    // 지역
    private String region;

    // 직업군
    private String jobCategory;

    // 추천 점수 (0~1 사이)
    private Double matchScore;

    // 공고의 직업군 분포 (설명용)
    private Map<String, Double> jobCategoryVector;

    // 설명 (왜 이 공고를 추천했는지)
    private String explanation;
}

