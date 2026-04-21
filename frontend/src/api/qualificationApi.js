import axios from "./axios";

const API_BASE_URL = "/api/qualifications";

/**
 * 직무분야별 자격증 조회
 */
export const getQualificationsByField = async (fieldId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/by-field/${fieldId}`);
    return response.data.data || [];
  } catch (err) {
    console.error("자격증 조회 오류:", err);
    return [];
  }
};

/**
 * 직무 카테고리로 자격증 조회 (권장)
 */
export const getQualificationsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/by-category`, {
      params: { category }
    });
    return response.data.data || [];
  } catch (err) {
    console.error("자격증 조회 오류:", err);
    return [];
  }
};

/**
 * 모든 자격증 조회
 */
export const getAllQualifications = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.data || [];
  } catch (err) {
    console.error("자격증 조회 오류:", err);
    return [];
  }
};

/**
 * 자격증 시험일정 조회
 */
export const getExamSchedules = async (jmcd) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${jmcd}/schedules`);
    return response.data.data || [];
  } catch (err) {
    console.error("시험일정 조회 오류:", err);
    return [];
  }
};

/**
 * 자격증 이름으로 검색
 */
export const searchQualifications = async (keyword) => {
  try {
    console.log("자격증 검색: keyword=" + keyword);
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { keyword }
    });
    // 백엔드 응답 구조: { success, data: [...], count, keyword }
    console.log("검색 결과:", response.data);
    return response.data.data || [];
  } catch (err) {
    console.error("자격증 검색 오류:", err);
    console.error("검색 요청 URL:", err.config?.url);
    console.error("에러 상태:", err.response?.status);
    console.error("에러 메시지:", err.response?.data);
    return [];
  }
};

/**
 * 자격증 상세 정보 조회
 */
export const getQualificationDetail = async (name) => {
  try {
    console.log("API 호출: /api/qualifications/detail?name=" + encodeURIComponent(name));
    const response = await axios.get(`/api/qualifications/detail?name=${encodeURIComponent(name)}`);
    // 백엔드 응답 구조: { success, name, jmcd, examSchedules, ... }
    return response.data || null;
  } catch (err) {
    console.error("자격증 상세정보 조회 오류:", err);
    console.error("요청 URL:", err.config?.url);
    console.error("에러 상태:", err.response?.status);
    console.error("에러 메시지:", err.response?.data);
    return null;
  }
};

/**
 * AI 기반 자격증 추천 (depth2 필터링)
 * 직무 카테고리를 기반으로 field table의 depth2와 비교하여 자격증 추천
 */
export const getAiQualificationRecommendation = async (category) => {
  try {
    const response = await axios.post("/api/ai/recommend/qualifications", {
      category
    });
    return response.data || null;
  } catch (err) {
    console.error("AI 자격증 추천 오류:", err);
    return null;
  }
};

