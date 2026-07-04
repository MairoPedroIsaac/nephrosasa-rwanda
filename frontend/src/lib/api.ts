/**
 * API Client for HealthVault Rwanda
 * This file handles all HTTP requests to the Django backend
 */

import axios from 'axios';

// Get API URL from environment variable
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = (!RAW_API_URL.endsWith('/api') && !RAW_API_URL.endsWith('/api/')) 
  ? `${RAW_API_URL.replace(/\/$/, '')}/api` 
  : RAW_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add authentication token to requests automatically
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (saved during login)
    const token = localStorage.getItem('access_token');
    
    // Check if the route is for authentication (login or register)
    const isAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
    
    if (token && !isAuthRoute) {
      // Add token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh automatically when access token expires
apiClient.interceptors.response.use(
  (response) => response, // If successful, just return response
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't tried to refresh yet
    const isAuthRoute = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register');
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Request new access token using refresh token
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        
        // Save new access token
        localStorage.setItem('access_token', access);
        
        // Update original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry original request with new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// Export API URL for use in other files
export { API_URL };