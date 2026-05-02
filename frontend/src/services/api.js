import axios from 'axios';

// Use Vite proxy in development, full URL in production
const API_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || 'https://eli-pay.onrender.com/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  setTransactionPin: (pin) => api.post('/users/set-pin', { pin }),
};

// Account APIs
export const accountAPI = {
  getBalance: () => api.get('/accounts/balance'),
  nameEnquiry: (accountNumber) => api.post('/accounts/name-enquiry', { accountNumber }),
  getTransactions: () => api.get('/accounts/transactions'),
  getTransactionStatus: (reference) => api.get(`/accounts/transaction/${reference}`),
};

// Transfer APIs
export const transferAPI = {
  transfer: (data) => api.post('/transfers', data),
};

export default api;
