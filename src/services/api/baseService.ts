import axios, { AxiosInstance } from 'axios';
import { API_URL } from '@/config';

class BaseService {
  protected api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour gérer les erreurs
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || 'Une erreur est survenue';
        throw new Error(message);
      }
    );
  }

  protected async get<T>(endpoint: string): Promise<{ data: T }> {
    const response = await this.api.get(endpoint);
    return response.data;
  }

  protected async post<T>(endpoint: string, data: any): Promise<{ data: T }> {
    const response = await this.api.post(endpoint, data);
    return response.data;
  }

  protected async put<T>(endpoint: string, data: any): Promise<{ data: T }> {
    const response = await this.api.put(endpoint, data);
    return response.data;
  }

  protected async patch<T>(endpoint: string, data: any): Promise<{ data: T }> {
    const response = await this.api.patch(endpoint, data);
    return response.data;
  }

  protected async deleteResource<T>(endpoint: string): Promise<{ data: T }> {
    const response = await this.api.delete(endpoint);
    return response.data;
  }
}

export default BaseService; 