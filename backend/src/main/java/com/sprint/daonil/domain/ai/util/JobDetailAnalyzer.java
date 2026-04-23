package com.sprint.daonil.domain.ai.util;

import java.util.*;

/**
 * 공고의 상세 특성을 분석하여 더 정교한 매칭 점수를 제공
 */
public class JobDetailAnalyzer {

    /**
     * 공고의 상세 특성 분석 (더 정교한 버전 - 미세한 차이 생성)
     * 
     * @param title 공고 제목
     * @param content 공고 내용
     * @param companyName 회사명
     * @param jobPostingId 공고 ID (난수 생성용)
     * @return 상세 특성 점수 (0.0 ~ 1.0)
     */
    public static double analyzeJobDetails(String title, String content, String companyName, Long jobPostingId) {
        double score = 0.5;  // 기본 점수

        String fullText = (title != null ? title : "") + " " + (content != null ? content : "");
        String lowerText = fullText.toLowerCase();

        // 1. 회사 규모/유형에 따른 점수
        score += analyzeCompanyType(companyName, lowerText);

        // 2. 업무 특성에 따른 점수
        score += analyzeWorkCharacteristics(lowerText);

        // 3. 고객응대 여부
        score += analyzeCustomerInteraction(lowerText);

        // 4. 원격근무 가능성
        score += analyzeRemoteWork(lowerText);

        // 5. 야근/출장 여부
        score += analyzeOvertime(lowerText);

        // 6. 신입/경력 여부
        score += analyzeCareerLevel(lowerText);

        // 7. 미세한 변동성 추가 (공고별 고유특성)
        score += generateMicroVariation(title, content, companyName, jobPostingId);

        // 점수 범위 조정 (0.0 ~ 1.0)
        return Math.max(0.0, Math.min(1.0, score));
    }

    /**
     * 공고별 미세한 변동성 생성
     * 동일한 직업군의 공고들도 약간씩 다른 점수가 나오도록 함
     */
    private static double generateMicroVariation(String title, String content, String companyName, Long jobPostingId) {
        double variation = 0;

        // 1. 제목 길이에 따른 미세 조정 (30~50글자가 적당)
        if (title != null) {
            int titleLen = title.length();
            if (titleLen >= 30 && titleLen <= 50) {
                variation += 0.02;  // 적절한 길이의 제목 = 좋음
            } else if (titleLen < 20) {
                variation -= 0.01;  // 너무 짧음
            } else if (titleLen > 60) {
                variation += 0.01;  // 상세한 설명
            }
        }

        // 2. 회사명 길이와 특수문자 (큰 회사명일수록 큰 회사)
        if (companyName != null) {
            if (companyName.contains("주)") || companyName.contains("(주)")) {
                variation += 0.01;
            }
            if (companyName.length() > 15) {
                variation += 0.015;  // 긴 회사명 = 상세
            }
        }

        // 3. Content 풍부도에 따른 조정
        if (content != null && content.length() > 500) {
            variation += 0.025;  // 상세한 설명
        } else if (content != null && content.length() > 200) {
            variation += 0.015;
        } else if (content == null || content.isEmpty()) {
            variation -= 0.02;  // 설명 부족
        }

        // 4. ID 기반 의사난수 생성 (같은 공고는 같은 값, 다른 공고는 다른 값)
        if (jobPostingId != null) {
            long seed = jobPostingId % 100;
            double idVariation = (seed - 50) * 0.0002;  // -0.01 ~ +0.01 범위
            variation += idVariation;
        }

        // 5. 특정 키워드의 조합에 따른 미세 조정
        String lowerText = ((title != null ? title : "") + (content != null ? content : "")).toLowerCase();
        int keywordCount = 0;
        if (hasKeyword(lowerText, "복리후생")) keywordCount++;
        if (hasKeyword(lowerText, "교육")) keywordCount++;
        if (hasKeyword(lowerText, "경력개발")) keywordCount++;
        if (hasKeyword(lowerText, "복지")) keywordCount++;
        if (hasKeyword(lowerText, "성과급")) keywordCount++;

        variation += keywordCount * 0.008;

        return variation;
    }

    /**
     * 공고의 상세 특성 분석 (기존 버전 - 호환성 유지)
     */
    public static double analyzeJobDetails(String title, String content, String companyName) {
        return analyzeJobDetails(title, content, companyName, null);
    }

    /**
     * 회사 규모/유형 분석
     */
    private static double analyzeCompanyType(String companyName, String jobText) {
        double score = 0;

        if (companyName == null) companyName = "";
        String lowerName = companyName.toLowerCase();

        // 공공기관 (공공기관은 장애인 친화적일 가능성 높음)
        if (lowerName.contains("공사") || lowerName.contains("공단") ||
            lowerName.contains("재단") || lowerName.contains("청") ||
            jobText.contains("공공기관") || jobText.contains("공기업")) {
            score += 0.15;
        }

        // 대기업 (장애인 고용 정책이 잘 갖춰져 있을 가능성)
        if (lowerName.contains("현대") || lowerName.contains("삼성") ||
            lowerName.contains("lg") || lowerName.contains("롯데") ||
            lowerName.contains("sk") || lowerName.contains("한국") ||
            jobText.contains("대기업")) {
            score += 0.1;
        }

        return score;
    }

    /**
     * 업무 특성 분석
     */
    private static double analyzeWorkCharacteristics(String lowerText) {
        double score = 0;

        // 실내 사무 업무 (지체장애 친화적)
        if (hasKeyword(lowerText, "사무", "행정", "데이터", "입력", "문서", "실내")) {
            score += 0.1;
        }

        // 단순 반복 업무 (지적장애 친화적)
        if (hasKeyword(lowerText, "단순", "반복", "조립", "정렬", "분류")) {
            score += 0.08;
        }

        // 기술/전문 업무 (학습 기회)
        if (hasKeyword(lowerText, "프로그래밍", "설계", "분석", "개발", "기술")) {
            score += 0.05;
        }

        return score;
    }

    /**
     * 고객응대 여부 분석
     * 고객응대가 많으면 언어장애/청각장애에 불리
     */
    private static double analyzeCustomerInteraction(String lowerText) {
        double score = 0;

        if (hasKeyword(lowerText, "고객응대", "전화", "상담", "고객서비스", "콜센터", "상담원")) {
            score -= 0.15;  // 감점
        } else {
            score += 0.1;   // 고객응대 없으면 가점
        }

        return score;
    }

    /**
     * 원격근무 가능성 분석
     * 원격근무 가능하면 이동 제약 있는 장애인에게 유리
     */
    private static double analyzeRemoteWork(String lowerText) {
        double score = 0;

        if (hasKeyword(lowerText, "원격근무", "재택근무", "유연근무", "재택", "재택 가능", "원격")) {
            score += 0.12;
        } else if (hasKeyword(lowerText, "현장", "야외", "외근", "방문")) {
            score -= 0.1;  // 외근이 많으면 감점
        }

        return score;
    }

    /**
     * 야근/출장 여부 분석
     * 야근/출장이 많으면 정신장애/지적장애에 불리
     */
    private static double analyzeOvertime(String lowerText) {
        double score = 0;

        if (hasKeyword(lowerText, "야근없음", "규칙적", "정시퇴근", "워라밸", "휴무")) {
            score += 0.1;
        } else if (hasKeyword(lowerText, "야근", "출장", "긴급", "긴급호출")) {
            score -= 0.08;
        }

        return score;
    }

    /**
     * 신입/경력 분석
     * 신입 모집이면 경력 없는 장애인에게 유리
     */
    private static double analyzeCareerLevel(String lowerText) {
        double score = 0;

        if (hasKeyword(lowerText, "신입", "미경력", "경험무관", "신입환영")) {
            score += 0.1;
        } else if (hasKeyword(lowerText, "경력", "경력사원", "3년 이상")) {
            score -= 0.05;
        }

        return score;
    }

    /**
     * 키워드 포함 여부
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
     * 공고의 세부 분류명 반환 (UI 표시용)
     */
    public static String getJobDetailCategory(String title, String content, String companyName) {
        String lowerText = ((title != null ? title : "") + " " + (content != null ? content : "")).toLowerCase();

        if (hasKeyword(lowerText, "고객", "상담", "전화")) {
            return "고객응대 업무";
        } else if (hasKeyword(lowerText, "원격", "재택")) {
            return "원격근무 가능";
        } else if (hasKeyword(lowerText, "프로그래밍", "개발", "설계")) {
            return "기술직";
        } else if (hasKeyword(lowerText, "관리", "감독", "팀장")) {
            return "관리직";
        } else if (hasKeyword(lowerText, "실내", "사무", "행정")) {
            return "실내 사무직";
        } else if (hasKeyword(lowerText, "단순", "반복", "조립")) {
            return "단순 반복 업무";
        } else if (hasKeyword(lowerText, "야외", "현장", "이동")) {
            return "야외/현장 업무";
        } else {
            return "일반 사무직";
        }
    }
}

