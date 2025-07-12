import BaseService from './baseService';
import { Emballage } from '@/types/emballage';

class EmballageService extends BaseService {
  private readonly endpoint = '/emballages';

  async getAll(): Promise<{ data: Emballage[] }> {
    return this.get<Emballage[]>(this.endpoint);
  }

  async getById(id: number): Promise<{ data: Emballage }> {
    return this.get<Emballage>(`${this.endpoint}/${id}`);
  }

  async create(data: Emballage): Promise<{ data: Emballage }> {
    return this.post<Emballage>(this.endpoint, data);
  }

  async update(id: number, data: Partial<Emballage>): Promise<{ data: Emballage }> {
    return this.put<Emballage>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: number): Promise<{ data: Emballage }> {
    return this.deleteResource<Emballage>(`${this.endpoint}/${id}`);
  }
}

export const emballageService = new EmballageService(); 