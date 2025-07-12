export interface Product {
  id: number;
  reference: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  gamme?: string;
  famille?: string;
  couleur?: string;
  emballage?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  gamme: string;
  famille: string;
  emballage: 'seau-metallique' | 'seau-plastique';
  quantite: string;
  poids: string;
  couleurs: string[];
  date_fabrication?: Date;
  date_expiration?: Date;
  image?: File;
} 