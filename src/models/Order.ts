// Models - Order
import { CartItem } from './Product';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customerInfo: CustomerInfo;
  deliveryDate: string;
  createdAt: string;
  trackingToken: string;
  updatedAt?: string;
  adminNotes?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

export interface OrderStep {
  name: string;
  completed: boolean;
  date?: string;
}
