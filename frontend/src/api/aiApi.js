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
 * 채용공고 추천 (임베딩 기반)
 * 
 * 흐름:
 * 1. 질문을 임베딩으로 변환
 * 2. 모든 공고와 유사도 비교
 * 3. TOP 5 공고 자동 선택
 * 4. GPT로 추천 이유 설명
 * 
 * @param {string} query - 사용자 질문
 * @param {Array} jobs - 전체 공고 리스트 (전체를 넘김, 서버가 필터링)
 * @returns {Object} { query, topJobs, explanation, count }
 */
export const getAiRecommendation = async (query, jobs) => {
  try {
    const response = await api.post('/api/ai/recommend', {
      query: query,
      jobs: jobs,  // 전체 공고 리스트
    });
    return response.data;  // { topJobs, explanation, count }
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

