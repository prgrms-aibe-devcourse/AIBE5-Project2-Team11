package com.sprint.daonil.domain.ai.util;

import java.util.*;

/**
 * 공고의 작업환경과 사용자의 장애 유형을 매칭하는 유틸리티
 * 공고에서 요구하는 작업 환경과 사용자가 할 수 있는 작업 환경을 비교
 */
public class WorkEnvironmentMatcher {

    /**
     * 공고의 작업환경 요구사항에 대한 점수 계산
     *
     * @param jobTitle 공고 제목
     * @param jobContent 공고 내용
     * @param userDisabilityType 사용자 장애 유형
     * @param userEnvBothHands 사용자 양손 사용 가능 여부
     * @param userEnvStndWalk 사용자 서서/걷기 가능 여부
     * @param userEnvEyesight 사용자 시력 필요 여부
     * @return 작업환경 매칭 점수 (0.0 ~ 1.0)
     */
    public static double calculateEnvironmentMatchScore(
            String jobTitle,
            String jobContent,
            String userDisabilityType,
            boolean userEnvBothHands,
            boolean userEnvStndWalk,
            boolean userEnvEyesight) {

        String fullText = (jobTitle != null ? jobTitle : "") + " " + (jobContent != null ? jobContent : "");
        String lowerText = fullText.toLowerCase();

        double score = 0.5;  // 기본 점수

        // 1. 시각 요구사항
        boolean needsEyesight = hasEyesightRequirement(lowerText);
        if (needsEyesight && !userEnvEyesight) {
            // 시력이 필요한데 사용자가 시력 제약
            score -= 0.3;
        } else if (!needsEyesight && userEnvEyesight) {
            // 시력이 불필요하면 OK
            score += 0.1;
        }

        // 2. 양손 요구사항
        boolean needsBothHands = hasBothHandsRequirement(lowerText);
        if (needsBothHands && !userEnvBothHands) {
            // 양손이 필요한데 사용자가 한손만 사용 가능
            score -= 0.3;
        } else if (!needsBothHands) {
            // 양손이 불필요하면 OK
            score += 0.1;
        }

        // 3. 서있기/걷기 요구사항
        EnvironmentRequirement envReq = detectEnvironmentRequirement(lowerText);
        if (envReq == EnvironmentRequirement.STANDING_WALKING && !userEnvStndWalk) {
            // 서있거나 많이 움직여야 하는데 사용자가 앉아만 있어야 함
            score -= 0.4;
        } else if (envReq == EnvironmentRequirement.SITTING_ALLOWED && userEnvStndWalk) {
            // 앉아만 있어도 되면 좋음
            score += 0.2;
        } else if (envReq == EnvironmentRequirement.SITTING_ONLY && !userEnvStndWalk) {
            // 앉아서만 하는 업무 + 사용자도 앉아만 가능 = 완벽 매칭
            score += 0.3;
        }

        // 4. 장애 유형별 추가 보정
        score = adjustScoreByDisabilityType(score, userDisabilityType, lowerText);

        // 점수 범위 조정 (0.0 ~ 1.0)
        return Math.max(0.0, Math.min(1.0, score));
    }

    /**
     * 작업환경 요구사항 감지
     */
    private static EnvironmentRequirement detectEnvironmentRequirement(String lowerText) {
        // 앉아서만 하는 업무
        if (hasKeyword(lowerText, "앉아", "책상", "컴퓨터", "사무", "데이터", "입력", "키보드", "마우스", "실내")) {
            return EnvironmentRequirement.SITTING_ONLY;
        }

        // 앉았다 섰다 가능
        if (hasKeyword(lowerText, "부분", "이동", "왕래", "경우", "필요", "점검", "순회")) {
            return EnvironmentRequirement.SITTING_ALLOWED;
        }

        // 서있거나 많이 움직여야 함
        if (hasKeyword(lowerText, "서서", "서있", "걷", "이동", "배송", "운전", "순찰", "야외", "외부", "매장", "점포", "현장")) {
            return EnvironmentRequirement.STANDING_WALKING;
        }

        return EnvironmentRequirement.UNKNOWN;
    }

    /**
     * 시력 요구사항 감지
     */
    private static boolean hasEyesightRequirement(String lowerText) {
        return hasKeyword(lowerText, "시력", "시각", "색상", "색깔", "색구분", "화면", "모니터", "영상", "보안", "감시", "관찰");
    }

    /**
     * 양손 요구사항 감지
     */
    private static boolean hasBothHandsRequirement(String lowerText) {
        return hasKeyword(lowerText, "양손", "조작", "조립", "용접", "용접공", "조각", "그리기", "악기", "악수", "악력");
    }

    /**
     * 키워드 포함 여부 확인
     */
    private static boolean hasKeyword(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    /**
     * 장애 유형별 추가 보정
     */
    private static double adjustScoreByDisabilityType(double score, String disabilityType, String jobText) {
        if (disabilityType == null) return score;

        switch (disabilityType) {
            case "지체장애":
                // 앉아서 가능한 업무 가점
                if (jobText.contains("앉아") || jobText.contains("사무")) {
                    score += 0.1;
                }
                break;

            case "시각장애":
                // 시력이 불필요한 업무 가점
                if (!jobText.contains("화면") && !jobText.contains("모니터")) {
                    score += 0.15;
                }
                break;

            case "청각장애":
                // 청각이 불필요한 업무 가점
                if (!jobText.contains("전화") && !jobText.contains("상담") && !jobText.contains("고객응대")) {
                    score += 0.1;
                }
                break;

            case "언어장애":
                // 언어 능력이 덜 필요한 업무 가점
                if (!jobText.contains("상담") && !jobText.contains("고객") && !jobText.contains("영업")) {
                    score += 0.1;
                }
                break;

            case "지적장애":
                // 단순 반복 업무 가점
                if (jobText.contains("반복") || jobText.contains("단순") || jobText.contains("조립")) {
                    score += 0.15;
                }
                break;

            case "정신장애":
                // 스트레스 적은 업무 가점
                if (!jobText.contains("영업") && !jobText.contains("고객") && !jobText.contains("긴급")) {
                    score += 0.1;
                }
                break;
        }

        return score;
    }

    /**
     * 작업환경 요구사항 열거형
     */
    enum EnvironmentRequirement {
        SITTING_ONLY,      // 앉아서만 가능
        SITTING_ALLOWED,   // 앉았다 섰다 가능
        STANDING_WALKING,  // 서있거나 많이 움직임
        UNKNOWN            // 미상
    }
}

