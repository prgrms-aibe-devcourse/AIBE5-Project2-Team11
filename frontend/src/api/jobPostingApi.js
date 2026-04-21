import api from './axios';

export const jobPostingApi = {
  // get job postings list matching filters
  getJobPostings: async (params) => {
    const response = await api.get('/api/jobs', { params });
    return response.data;
  },

  // get job posting detail
  getJobPostingDetail: async (jobPostingId) => {
    const response = await api.get(`/api/jobs/${jobPostingId}`);
    return response.data;
  },

  // get job postings by company id
  getJobPostingsByCompanyId: async (params) => {
    const response = await api.get('/api/jobs/company', { params: { ...params } });
    return response.data;
  },

  // create job posting
  createJobPosting: async (data) => {
    const response = await api.post('/api/jobs', data);
    return response.data;
  },

  // update job posting
  updateJobPosting: async (jobPostingId, data) => {
    const response = await api.put(`/api/jobs/${jobPostingId}`, data);
    return response.data;
  },

  // close job posting
  closeJobPosting: async (jobPostingId) => {
    const response = await api.patch(`/api/jobs/${jobPostingId}/close`);
    return response.data;
  }
};
