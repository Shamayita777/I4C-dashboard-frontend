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
  getAll: (params = {}) => api.get('/reports', { params }),
  
  getById: (id) => api.get(`/reports/${id}`),
  
  updateStatus: (id, status, priority) => 
    api.put(`/reports/${id}/status`, { status, priority }),
  
  addNote: (id, note, type = 'COMMENT') => 
    api.post(`/reports/${id}/notes`, { note, type }),
  
  export: () => api.get('/export', { responseType: 'blob' })
};

export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview')
};

export default api;
