package com.sprint.daonil.domain.ai.util;

import java.util.*;

/**
 * 공고 제목을 33개 직업군으로 분류하는 유틸리티
 * 규칙 기반 + 키워드 기반 방식 사용
 */
public class JobCategoryClassifier {

    // 직업군별 키워드 매핑
    private static final Map<String, List<String>> CATEGORY_KEYWORDS = new LinkedHashMap<>();

    static {
        // 33개 직업군별 키워드 정의 (더 세밀하게 구분)
        CATEGORY_KEYWORDS.put("제조 단순직", 
            Arrays.asList("단순", "생산", "포장", "조립", "라인", "작업자", "작업원", "제조", "생산직", "공장"));
        
        CATEGORY_KEYWORDS.put("인쇄·목재·공예 및 기타 설치·정비·생산직",
            Arrays.asList("인쇄", "목재", "가구", "공예", "제작", "목공", "설치", "정비", "마감", "조각"));
        
        CATEGORY_KEYWORDS.put("경영·행정·사무직",
            Arrays.asList("사무", "행정", "총무", "문서", "보조원", "서무", "관리", "사원", "비서", "데이터", "입력", "출장", "회의", "기획"));
        
        CATEGORY_KEYWORDS.put("청소 및 기타 개인서비스직",
            Arrays.asList("청소", "미화", "환경미화", "개인서비스", "정소", "세척", "위생"));
        
        CATEGORY_KEYWORDS.put("경호·경비직",
            Arrays.asList("경비", "보안", "주차관리", "경호", "관리", "순찰", "감시"));
        
        CATEGORY_KEYWORDS.put("음식 서비스직",
            Arrays.asList("조리", "주방", "디저트", "카페", "서빙", "음식", "식당", "요리사", "조리사", "쉐프", "음식업"));
        
        CATEGORY_KEYWORDS.put("사회복지·종교직",
            Arrays.asList("사회복지", "복지", "생활지도", "종교", "상담", "돌봄", "사회", "종교단체"));
        
        CATEGORY_KEYWORDS.put("보건·의료직",
            Arrays.asList("간호", "병원", "의료", "재활", "치료", "보건", "간호사", "의사", "약사", "임상", "의료진"));
        
        CATEGORY_KEYWORDS.put("운전·운송직",
            Arrays.asList("운전", "운송", "배송", "물류", "기사", "드라이버", "배달", "화물"));
        
        CATEGORY_KEYWORDS.put("영업·판매직",
            Arrays.asList("영업", "판매", "상담원", "외부영업", "세일즈", "판매사원", "마케팅"));
        
        CATEGORY_KEYWORDS.put("기계 설치·정비·생산직",
            Arrays.asList("기계", "설치", "정비", "유지보수", "기술자", "기공", "기계사", "정비사"));
        
        CATEGORY_KEYWORDS.put("금속·재료 설치·정비·생산직(판금·단조·주조·용접·도장 등)",
            Arrays.asList("금속", "재료", "판금", "단조", "주조", "용접", "도장", "도금", "열처리", "금속가공"));
        
        CATEGORY_KEYWORDS.put("전기·전자 설치·정비·생산직",
            Arrays.asList("전기", "전자", "설치", "정비", "시공", "기술", "전기공", "전자"));
        
        CATEGORY_KEYWORDS.put("식품 가공·생산직",
            Arrays.asList("식품", "가공", "생산", "포장", "음식", "식품업체", "제과", "제빵"));
        
        CATEGORY_KEYWORDS.put("정보통신 설치·정비직",
            Arrays.asList("통신", "네트워크", "설치", "정비", "IT기술", "통신기술"));
        
        CATEGORY_KEYWORDS.put("건설·채굴직",
            Arrays.asList("건설", "채굴", "시공", "토목", "구조물", "건축", "채광"));
        
        CATEGORY_KEYWORDS.put("화학·환경 설치·정비·생산직",
            Arrays.asList("화학", "환경", "처리", "설치", "정비", "화학공정"));
        
        CATEGORY_KEYWORDS.put("섬유·의복 생산직",
            Arrays.asList("섬유", "의복", "의류", "봉제", "생산", "직물", "패션"));
        
        CATEGORY_KEYWORDS.put("돌봄 서비스직(간병·육아)",
            Arrays.asList("돌봄", "간병", "육아", "보육", "케어", "간병인", "어린이집", "유치원"));
        
        CATEGORY_KEYWORDS.put("미용·예식 서비스직",
            Arrays.asList("미용", "예식", "뷰티", "헤어", "메이크업", "이용", "네일"));
        
        CATEGORY_KEYWORDS.put("여행·숙박·오락 서비스직",
            Arrays.asList("여행", "숙박", "호텔", "관광", "가이드", "오락", "리조트", "콘도"));
        
        CATEGORY_KEYWORDS.put("스포츠·레크리에이션직",
            Arrays.asList("스포츠", "레크리에이션", "운동", "피트니스", "강사", "트레이너"));
        
        CATEGORY_KEYWORDS.put("관리직(임원·부서장)",
            Arrays.asList("관리자", "임원", "부서장", "팀장", "감독", "이사", "이사", "조직", "지배인"));
        
        CATEGORY_KEYWORDS.put("농림어업직",
            Arrays.asList("농업", "축산", "임업", "어업", "농장", "축사", "경영"));
        
        CATEGORY_KEYWORDS.put("교육직",
            Arrays.asList("교사", "강사", "교수", "교육", "학원", "강의", "튜터"));
        
        CATEGORY_KEYWORDS.put("금융·보험직",
            Arrays.asList("금융", "보험", "은행", "펀드", "투자", "증권", "신용"));
        
        CATEGORY_KEYWORDS.put("법률직",
            Arrays.asList("법률", "법무", "변호사", "판사", "검사", "법률상담"));
        
        CATEGORY_KEYWORDS.put("정보통신 연구개발직 및 공학기술직",
            Arrays.asList("개발", "연구", "프로그래머", "개발자", "엔지니어", "IT", "소프트웨어", "웹"));
        
        CATEGORY_KEYWORDS.put("제조 연구개발직 및 공학기술직",
            Arrays.asList("연구", "개발", "엔지니어", "기술", "제조기술", "공정", "설계"));
        
        CATEGORY_KEYWORDS.put("건설·채굴 연구개발직 및 공학기술직",
            Arrays.asList("건설기술", "토목기술", "개발", "연구", "토목", "건축기술"));
        
        CATEGORY_KEYWORDS.put("자연·생명과학 연구직",
            Arrays.asList("연구", "과학", "생명과학", "생물", "실험실", "박사", "연구원"));
        
        CATEGORY_KEYWORDS.put("인문·사회과학 연구직",
            Arrays.asList("연구", "사회과학", "인문", "조사", "분석", "통계", "사회"));
        
        CATEGORY_KEYWORDS.put("예술·디자인·방송직",
            Arrays.asList("디자인", "예술", "방송", "영상", "그래픽", "아트", "디자이너", "크리에이터"));
    }

    /**
     * 공고 제목을 33개 직업군에 대한 가중치로 분류 (더 정교한 버전)
     * title과 content를 함께 고려
     * 
     * @param title 공고 제목
     * @param content 공고 내용 (선택사항)
     * @return 직업군별 가중치 맵 (합계 = 1.0)
     */
    public static Map<String, Double> classifyTitleAndContent(String title, String content) {
        if (title == null || title.trim().isEmpty()) {
            return new HashMap<>();
        }

        String fullText = (title != null ? title : "") + " " + (content != null ? content : "");
        String lowerText = fullText.toLowerCase();
        Map<String, Integer> scores = new LinkedHashMap<>();

        // 각 직업군에 대해 키워드 매칭 점수 계산
        for (Map.Entry<String, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            String category = entry.getKey();
            List<String> keywords = entry.getValue();
            int score = 0;

            for (String keyword : keywords) {
                // title에서 찾은 키워드에 가중치 부여 (더 중요함)
                if (title != null && title.toLowerCase().contains(keyword.toLowerCase())) {
                    score += 3;  // title에서 찾으면 3배 가중치
                }
                // content에서 찾은 키워드
                if (content != null && content.toLowerCase().contains(keyword.toLowerCase())) {
                    score += 1;
                }
            }

            if (score > 0) {
                scores.put(category, score);
            }
        }

        // 정규화 (합계 = 1.0)
        Map<String, Double> weights = new LinkedHashMap<>();
        if (scores.isEmpty()) {
            return weights;
        }

        int totalScore = scores.values().stream().mapToInt(Integer::intValue).sum();
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            weights.put(entry.getKey(), (double) entry.getValue() / totalScore);
        }

        return weights;
    }

    /**
     * 공고 제목을 33개 직업군에 대한 가중치로 분류 (기존 버전 - 호환성 유지)
     * 
     * @param title 공고 제목
     * @return 직업군별 가중치 맵 (합계 = 1.0)
     */
    public static Map<String, Double> classifyTitle(String title) {
        return classifyTitleAndContent(title, null);
    }

    /**
     * 두 벡터의 내적 계산 (추천 점수)
     * 
     * @param jobVector 공고의 직업군 가중치
     * @param userVector 사용자의 직업군 선호도
     * @return 매칭 점수
     */
    public static double calculateMatchScore(Map<String, Double> jobVector, 
                                            Map<String, Double> userVector) {
        double score = 0.0;
        for (Map.Entry<String, Double> entry : jobVector.entrySet()) {
            String category = entry.getKey();
            double weight = entry.getValue();
            double userWeight = userVector.getOrDefault(category, 0.0);
            score += weight * userWeight;
        }
        return score;
    }

    /**
     * 모든 직업군 목록 반환
     */
    public static List<String> getAllCategories() {
        return new ArrayList<>(CATEGORY_KEYWORDS.keySet());
    }
}

