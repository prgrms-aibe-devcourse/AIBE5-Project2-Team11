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
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { keyword }
    });
    return response.data.data || [];
  } catch (err) {
    console.error("자격증 검색 오류:", err);
    return [];
  }
};

/**
 * 자격증 상세 정보 조회
 */
export const getQualificationDetail = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/detail`, {
      params: { name }
    });
    return response.data.data || null;
  } catch (err) {
    console.error("자격증 상세정보 조회 오류:", err);
    return null;
  }
};
