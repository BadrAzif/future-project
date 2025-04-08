import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json', // Ensure JSON payloads
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  requestPasswordReset: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getProfile: () => api.get('/auth/profile')
};

export const socialApi = {
  google: (data) => api.post('/auth/social/google', data),
  facebook: (data) => api.post('/auth/social/facebook', data),
  github: (data) => api.post('/auth/social/github', data),
  apple: (data) => api.post('/auth/social/apple', data)
};

export default api;
