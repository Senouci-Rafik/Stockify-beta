import BaseService from './baseService';
import { Product } from '@/types/product';

class ProductService extends BaseService {
  private readonly endpoint = '/products';


  async getAll(): Promise<{ data: Product[] }> {
    return this.get<Product[]>(this.endpoint);
  }

  async getById(id: number): Promise<{ data: Product }> {
    return this.get<Product>(`${this.endpoint}/${id}`);
  }

  async create(data: FormData): Promise<{ data: Product }> {
    return this.post<Product>(this.endpoint, data);
  }

  async update(id: number, data: Partial<Product>): Promise<{ data: Product }> {
    return this.put<Product>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: number): Promise<{ data: Product }> {
    return this.deleteResource<Product>(`${this.endpoint}/${id}`);
  }

  // Endpoints spécifiques
  async getByGamme(gammeId: string): Promise<{ data: Product[] }> {
    return this.get<Product[]>(`${this.endpoint}/by-gamme/${gammeId}`);
  }

  async getByFamille(familleId: string): Promise<{ data: Product[] }> {
    return this.get<Product[]>(`${this.endpoint}/by-famille/${familleId}`);
  }
}

export const productService = new ProductService(); 