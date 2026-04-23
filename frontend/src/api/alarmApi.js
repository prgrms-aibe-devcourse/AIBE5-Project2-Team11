import axios from './axios';

/**
 * 현재 로그인한 회원의 모든 알림 조회
 * @returns {Promise} 알림 목록
 */
export const fetchAlarms = async () => {
  try {
    const response = await axios.get('/api/alarms');
    return response.data;
  } catch (error) {
    console.error('알림 조회 실패:', error);
    throw error;
  }
};

/**
 * 현재 로그인한 회원의 읽지 않은 알림만 조회
 * @returns {Promise} 읽지 않은 알림 목록
 */
export const fetchUnreadAlarms = async () => {
  try {
    const response = await axios.get('/api/alarms/unread');
    return response.data;
  } catch (error) {
    console.error('읽지 않은 알림 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 알림을 읽음 처리
 * @param {number} alarmId - 알림 ID
 * @returns {Promise} 업데이트된 알림 정보
 */
export const markAlarmAsRead = async (alarmId) => {
  try {
    const response = await axios.put(`/api/alarms/${alarmId}`);
    return response.data;
  } catch (error) {
    console.error(`알림 ${alarmId} 읽음 처리 실패:`, error);
    throw error;
  }
};

/**
 * 알림 삭제
 * @param {number} alarmId - 알림 ID
 * @returns {Promise} 삭제 결과 메시지
 */
export const deleteAlarm = async (alarmId) => {
  try {
    const response = await axios.delete(`/api/alarms/${alarmId}`);
    return response.data;
  } catch (error) {
    console.error(`알림 ${alarmId} 삭제 실패:`, error);
    throw error;
  }
};

