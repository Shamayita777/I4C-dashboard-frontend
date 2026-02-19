import axios from 'axios';

const API_BASE_URL = "https://i4c-chatbot.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const reportsAPI = {
  getAll: (params = {}) => api.get('/api/admin/reports', { params }),
  
  getById: (id) => api.get(`/api/admin/reports/${id}`),
  
  updateStatus: (id, status, priority) => 
    api.put(`/api/admin/reports/${id}/status`, { status, priority }),
  
  addNote: (id, note, type = 'COMMENT') => 
    api.post(`/api/admin/reports/${id}/notes`, { note, type }),
  
  export: () => api.get('/api/admin/export', { responseType: 'blob' })
};

export const analyticsAPI = {
  getOverview: () => api.get('/api/admin/analytics/overview')
};

export default api;
