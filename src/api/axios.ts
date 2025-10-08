import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const authData = localStorage.getItem('synkicycle-auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed.state?.accessToken) {
          config.headers.Authorization = `Bearer ${parsed.state.accessToken}`;
        }
      } catch (e) {
        console.error('Failed to parse auth data:', e);
      }
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  (error: AxiosError) => {
    // Handle different types of errors
    if (error.response) {
      const { status, data } = error.response;
      
      console.error('❌ API Error Response:', {
        status,
        url: error.config?.url,
        data,
      });
      
      // Handle specific error cases
      switch (status) {
        case 401:
          // Clear auth data on unauthorized
          localStorage.removeItem('synkicycle-auth');
          break;
        case 422:
          console.error('Validation failed:', data);
          break;
        case 429:
          console.error('Rate limit exceeded');
          break;
        default:
          console.error(`Unexpected error: ${status}`);
      }
    } else if (error.request) {
      console.error('❌ Network Error:', error.message);
    } else {
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for common HTTP methods
export const apiClient = {
  get: <T = any>(url: string, config = {}) => 
    api.get<T>(url, config).then(response => response.data),
    
  post: <T = any>(url: string, data = {}, config = {}) => 
    api.post<T>(url, data, config).then(response => response.data),
    
  put: <T = any>(url: string, data = {}, config = {}) => 
    api.put<T>(url, data, config).then(response => response.data),
    
  patch: <T = any>(url: string, data = {}, config = {}) => 
    api.patch<T>(url, data, config).then(response => response.data),
    
  delete: <T = any>(url: string, config = {}) => 
    api.delete<T>(url, config).then(response => response.data),
};

export { api };
export type { AxiosInstance, AxiosResponse, AxiosError };
