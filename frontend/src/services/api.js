import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Health API
export const healthAPI = {
  getHealth: () => api.get('/health'),
  getN8NHealth: () => api.get('/health/n8n'),
  getAIHealth: () => api.get('/health/ai'),
};

// Workflows API
export const workflowsAPI = {
  getWorkflows: (params = {}) => api.get('/workflows', { params }),
  getWorkflow: (id) => api.get(`/workflows/${id}`),
  createWorkflow: (data) => api.post('/workflows', data),
  updateWorkflow: (id, data) => api.put(`/workflows/${id}`, data),
  deleteWorkflow: (id) => api.delete(`/workflows/${id}`),
  executeWorkflow: (id, inputData = null) => api.post(`/workflows/${id}/execute`, { input_data: inputData }),
  activateWorkflow: (id) => api.post(`/workflows/${id}/activate`),
  deactivateWorkflow: (id) => api.post(`/workflows/${id}/deactivate`),
  getWorkflowExecutions: (id, limit = 20) => api.get(`/workflows/${id}/executions`, { params: { limit } }),
  getWorkflowStatistics: (id) => api.get(`/workflows/${id}/statistics`),
  analyzeWorkflow: (id) => api.get(`/workflows/${id}/analyze`),
};

// AI API
export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  generateWorkflow: (data) => api.post('/ai/generate-workflow', data),
  optimizeWorkflow: (data) => api.post('/ai/optimize-workflow', data),
  fillParameters: (data) => api.post('/ai/fill-parameters', data),
  explainWorkflow: (workflowId, aiProvider = 'llama') => 
    api.post(`/ai/explain-workflow/${workflowId}`, { ai_provider: aiProvider }),
  getConversationHistory: (sessionId) => api.get(`/ai/conversation-history/${sessionId}`),
  getProvidersStatus: () => api.get('/ai/providers/status'),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.detail || error.response.data?.message || 'An error occurred';
    return { error: true, message, status: error.response.status };
  } else if (error.request) {
    // Request was made but no response received
    return { error: true, message: 'Network error - please check your connection', status: 0 };
  } else {
    // Something else happened
    return { error: true, message: error.message || 'An unexpected error occurred', status: 0 };
  }
};

// React Query helpers
export const queryKeys = {
  health: ['health'],
  workflows: ['workflows'],
  workflow: (id) => ['workflow', id],
  workflowExecutions: (id) => ['workflow-executions', id],
  workflowStats: (id) => ['workflow-stats', id],
  aiProviders: ['ai-providers'],
  conversation: (sessionId) => ['conversation', sessionId],
};

export default api;