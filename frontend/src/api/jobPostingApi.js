import api from './axios';

export const jobPostingApi = {
  // get job postings list matching filters
  getJobPostings: async (params) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },
  
  // get job posting detail
  getJobPostingDetail: async (jobPostingId) => {
    const response = await api.get(`/jobs/${jobPostingId}`);
    return response.data;
  },

  // get job postings by company id
  getJobPostingsByCompanyId: async (companyId, params) => {
    const response = await api.get('/jobs/company', { params: { companyId, ...params } });
    return response.data;
  },

  // create job posting
  createJobPosting: async (companyId, data) => {
    const response = await api.post('/jobs', data, { params: { companyId } });
    return response.data;
  },

  // update job posting
  updateJobPosting: async (companyId, jobPostingId, data) => {
    const response = await api.put(`/jobs/${jobPostingId}`, data, { params: { companyId } });
    return response.data;
  },

  // close job posting
  closeJobPosting: async (companyId, jobPostingId) => {
    const response = await api.patch(`/jobs/${jobPostingId}/close`, null, { params: { companyId } });
    return response.data;
  }
};
