import axios from 'axios';
import { User } from '@/types/auth';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/users/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('token', access);
        error.config.headers.Authorization = `Bearer ${access}`;
        return api(error.config);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// User service for authentication and user management
export const authService = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/users/token/', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  register: (userData: any) => api.post('/users/register/', userData),
  getCurrentUser: () => api.get('/users/profile/'),
  refreshToken: () => api.post('/users/token/refresh/'),
};

// User service for user management
export const userService = {
  getAll: () => api.get('/users/'),
  getById: (id: string) => api.get(`/users/${id}/`),
  create: async (userData: any) => {
    const response = await api.post('/users/create/', userData);
    return response.data;
  },
  update: (id: string, userData: any) => api.put(`/users/${id}/`, userData),
  delete: (id: string) => api.delete(`/users/${id}/`),
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile/');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },
  updateProfile: async (userData: any) => {
    try {
      const response = await api.patch('/users/update/', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  resetPassword: async (email: string) => {
    const response = await api.post('/users/password-reset/request/', { email });
    return response.data;
  },
  confirmPasswordReset: async (userId: number, password: string) => {
    const response = await api.post(`/users/password-reset/confirm/${userId}/`, { password });
    return response.data;
  },
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get('/users/profile/');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/users/token/', { email, password });
      const { access, refresh, user } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await api.post('/users/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post('/users/token/refresh/', {
        refresh: refreshToken
      });
      const { access } = response.data;
      localStorage.setItem('token', access);
      return access;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
};

// Product service for product management
export const productService = {
  getAll: () => api.get('/products/'),
  getById: (id: number) => api.get(`/products/${id}/`),
  create: (data: any) => api.post('/products/', data),
  update: (id: number, data: any) => api.put(`/products/${id}/`, data),
  delete: (id: number) => api.delete(`/products/${id}/`),
  getByGamme: (gammeId: number) => api.get(`/products/by_gamme/?gamme_id=${gammeId}`),
  getByFamille: (familleId: number) => api.get(`/products/by_famille/?famille_id=${familleId}`),
};

// Gamme service
export const gammeService = {
  getAll: () => api.get('/gammes/'),
  getById: (id: number) => api.get(`/gammes/${id}/`),
  create: (data: any) => api.post('/gammes/', data),
  update: (id: number, data: any) => api.put(`/gammes/${id}/`, data),
  delete: (id: number) => api.delete(`/gammes/${id}/`),
};

// Famille service
export const familleService = {
  getAll: () => api.get('/familles/'),
  getById: (id: number) => api.get(`/familles/${id}/`),
  create: (data: any) => api.post('/familles/', data),
  update: (id: number, data: any) => api.put(`/familles/${id}/`, data),
  delete: (id: number) => api.delete(`/familles/${id}/`),
  getByGamme: (gammeId: number) => api.get(`/familles/by_gamme/?gamme_id=${gammeId}`),
};

// Emballage service
export const emballageService = {
  getAll: () => api.get('/emballages/'),
  getById: (id: number) => api.get(`/emballages/${id}/`),
  create: (data: any) => api.post('/emballages/', data),
  update: (id: number, data: any) => api.put(`/emballages/${id}/`, data),
  delete: (id: number) => api.delete(`/emballages/${id}/`),
};

export default api;
