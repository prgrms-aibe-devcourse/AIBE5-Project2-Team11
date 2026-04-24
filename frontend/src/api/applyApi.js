import api from './axios';

export const applyApi = {
    // 기업용: 특정 공고의 지원자 목록 조회
    getApplicants: async (jobPostingId) => {
        const response = await api.get(`/jobs/${jobPostingId}/applicants`);
        return response.data;
    },

    // 기업용: 지원자 상태 업데이트
    updateStatus: async (applicationId, status) => {
        const response = await api.patch(`/jobs/application/${applicationId}/status`, { status });
        return response.data;
    }
};
