
import api from './api';

// Interface pour une commande
export interface Order {
  id?: number;
  clientId: number;
  clientName?: string;
  clientEmail?: string;
  date: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  items: OrderItem[];
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface OrderFilters {
  client?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Service pour les commandes
export const orderService = {
  // GET /api/commandes - Liste toutes les commandes avec filtres optionnels
  getAll: (filters?: OrderFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.client) params.append('client', filters.client);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.dateFrom) params.append('date_from', filters.dateFrom);
    if (filters?.dateTo) params.append('date_to', filters.dateTo);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sortBy) params.append('sort_by', filters.sortBy);
    if (filters?.sortOrder) params.append('sort_order', filters.sortOrder);
    
    return api.get(`/orders/?${params.toString()}`);
  },

  // GET /api/commandes/{id} - Détails d'une commande
  getById: (id: number) => api.get(`/orders/${id}/`),

  // POST /api/commandes - Crée une nouvelle commande
  create: (orderData: Omit<Order, 'id'>) => api.post('/orders/', orderData),

  // PUT /api/commandes/{id} - Met à jour une commande
  update: (id: number, orderData: Partial<Order>) => api.put(`/orders/${id}/`, orderData),

  // DELETE /api/commandes/{id} - Supprime une commande
  delete: (id: number) => api.delete(`/orders/${id}/`),

  // PATCH /api/commandes/{id}/status - Met à jour le statut d'une commande
  updateStatus: (id: number, status: Order['status']) => 
    api.patch(`/orders/${id}/status/`, { status }),
};

// Service pour les clients (pour l'autocomplétion)
export const clientService = {
  getAll: () => api.get('/clients/'),
  search: (query: string) => api.get(`/clients/search/?q=${encodeURIComponent(query)}`),
};

// Service pour les produits (pour la sélection)
export const productService = {
  getAll: () => api.get('/products/'),
  search: (query: string) => api.get(`/products/search/?q=${encodeURIComponent(query)}`),
};

export default orderService;
