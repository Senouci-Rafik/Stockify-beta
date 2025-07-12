
export interface OrderItem {
  productId: number | string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface OrderFormValues {
  clientId: string | number;
  items: OrderItem[];
}

export interface Client {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}
