import api from './axios';

/**
 * GPT-4o-mini를 사용한 일반 채팅
 */
export const chatWithAi = async (message) => {
  try {
    const response = await api.post('/api/ai/chat', {
      message: message,
    });
    return response.data.message;
  } catch (error) {
    console.error('Error calling AI chat API:', error);
    throw error;
  }
};

/**
 * 텍스트 임베딩 (text-embedding-3-small)
 * 
 * 역할: 텍스트를 1536차원 벡터로 변환
 * 용도: 유사도 계산, 검색 등에 사용
 */
export const getTextEmbedding = async (text) => {
  try {
    const response = await api.post('/api/ai/embedding', {
      message: text,
    });
    return response.data;  // { text, embedding: [...], dimension: 1536 }
  } catch (error) {
    console.error('Error calling embedding API:', error);
    throw error;
  }
};

/**
 * 채용공고 추천 (임베딩 기반 + 백엔드 필터링)
 *
 * 흐름:
 * 1. 질문을 임베딩으로 변환
 * 2. 지역 + 소분류로 백엔드 재필터링
 * 3. 모든 공고와 유사도 비교
 * 4. TOP 5 공고 자동 선택
 * 5. GPT로 추천 이유 설명
 *
 * @param {string} query - 사용자 질문
 * @param {Array} jobs - 전체 공고 리스트 (버전 호환성을 위해 유지하지만 사용하지 않음)
 * @param {string} region - 지역 필터 (선택)
 * @param {string} subCategory - 소분류 필터 (선택)
 * @returns {Object} { query, topJobs, explanation, count }
 */
export const getAiRecommendation = async (query, jobs, region, subCategory) => {
  try {
    const requestData = {
      query: query,
      region: region,  // 지역 필터
      subCategory: subCategory,  // 소분류 필터
    };

    const response = await api.post('/api/ai/recommend', requestData);
    return response.data;  // { topJobs, explanation, count, filtered_count }
  } catch (error) {
    console.error('Error calling recommendation API:', error);
    throw error;
  }
};

/**
 * 두 텍스트의 유사도 계산 (0~1)
 * 
 * 용도: 테스트, 디버깅, 유사도 확인
 */
export const calculateSimilarity = async (text1, text2) => {
  try {
    const response = await api.post('/api/ai/similarity', {
      text1: text1,
      text2: text2,
    });
    return response.data;  // { similarity, percentage }
  } catch (error) {
    console.error('Error calculating similarity:', error);
    throw error;
  }
};

/**
 * 구조화된 채팅 요청 (role based) - 예약됨
 */
export const chatWithAiStructured = async (messages) => {
  try {
    const response = await api.post('/api/ai/chat', {
      messages: messages,
    });
    return response.data.message;
  } catch (error) {
    console.error('Error calling structured chat API:', error);
    throw error;
  }
};

/**
 * ⭐ NEW: 장애 유형별 공고 추천 (하이브리드 방식)
 * 
 * 공고 제목 → 33개 직업군 가중치 변환 → 장애 유형별 가중치와 매칭 → 점수 계산
 *
 * @param {string} disabilityType - 장애 유형 ("지체장애", "시각장애", "청각장애", "언어장애", "지적장애", "정신장애")
 * @param {number} topN - 상위 몇 개 추천 (기본값: 3)
 * @param {string} region - 지역 필터 (선택, 예: "서울", "경기")
 * @returns {Object} { success, disabilityType, region, recommendations, explanation, count }
 * 
 * 응답 예시:
 * {
 *   "success": true,
 *   "disabilityType": "지체장애",
 *   "region": "서울",
 *   "count": 3,
 *   "totalJobCount": 45,
 *   "recommendations": [
 *     {
 *       "title": "인쇄, 목재, 가구 및 기타 제조 분야 단순 종사원",
 *       "company": "ABC회사",
 *       "matchScore": 0.0542,
 *       "jobCategoryVector": { ... }
 *     }
 *   ],
 *   "explanation": "AI가 생성한 상세 설명..."
 * }
 */
export const getDisabilityBasedRecommendations = async (disabilityType, topN = 3, region = null) => {
  try {
    const requestData = {
      disabilityType: disabilityType,
      topN: topN,
    };
    
    // 지역 필터 추가 (옵션)
    if (region && region !== "전체") {
      requestData.region = region;
    }
    
    const response = await api.post('/api/ai/recommend/disability', requestData);
    return response.data;
  } catch (error) {
    console.error('Error calling disability-based recommendation API:', error);
    throw error;
  }
};
