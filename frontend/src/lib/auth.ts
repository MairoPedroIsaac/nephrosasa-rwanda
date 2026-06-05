/**
 * Authentication Helper Functions
 * Handles login, logout, and checking authentication status
 */

import apiClient from './api';

// TypeScript interface for login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// TypeScript interface for registration data
interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  phone_number: string;
  user_type: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  national_id?: string;
}

// TypeScript interface for user data
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  user_type: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  date_of_birth?: string;
  national_id?: string;
}

/**
 * Login function
 * Sends credentials to backend, stores tokens
 */
export const login = async (credentials: LoginCredentials) => {
  // MOCK LOGIN FOR VIDEO DEMO
  if (credentials.email === 'demo@gmail.com' || credentials.email === 'i.pedro@alustudent.com' || credentials.email === 'mairopedroisaac@gmail.com') {
    const mockUser: User = {
      id: 1, email: credentials.email, first_name: 'Isaac', last_name: 'Pedro', phone_number: '+250781234567', user_type: 'PATIENT'
    };
    localStorage.setItem('access_token', 'mock_token');
    localStorage.setItem('refresh_token', 'mock_refresh');
    localStorage.setItem('user', JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  }
  if (credentials.email === 'doctor@gmail.com') {
    const mockUser: User = {
      id: 2, email: 'doctor@gmail.com', first_name: 'Jane', last_name: 'Smith', phone_number: '+250781234568', user_type: 'DOCTOR'
    };
    localStorage.setItem('access_token', 'mock_token');
    localStorage.setItem('refresh_token', 'mock_refresh');
    localStorage.setItem('user', JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  }

  try {
    const response = await apiClient.post('/auth/login/', credentials);
    
    const { access, refresh, user } = response.data;
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed. Please try again.',
    };
  }
};

/**
 * Register function
 * Creates new user account
 */
export const register = async (data: RegisterData) => {
  // MOCK REGISTER FOR VIDEO DEMO
  return { success: true, data: { ...data, id: Math.floor(Math.random() * 1000) } };

  try {
    const response = await apiClient.post('/auth/register/', data);
    
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed. Please try again.',
    };
  }
};

/**
 * Logout function
 * Removes tokens and redirects to login
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  // Check if access token exists
  const token = localStorage.getItem('access_token');
  return !!token; // !! converts to boolean (true if exists, false if null)
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Get user type (PATIENT, DOCTOR, ADMIN)
 */
export const getUserType = (): string | null => {
  const user = getCurrentUser();
  return user?.user_type || null;
};