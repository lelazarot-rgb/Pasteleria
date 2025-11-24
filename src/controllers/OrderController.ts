// Controllers - Order Controller
import { Order, OrderStatus } from '../models/Order';
import { storage } from '../lib/storage';
import { ordersAPI } from '../lib/api';

export class OrderController {
  static async getAllOrders(): Promise<Order[]> {
    try {
      const response = await ordersAPI.getAll();
      return response.success ? response.orders : [];
    } catch (error) {
      console.error('Error obteniendo pedidos:', error);
      return [];
    }
  }

  static async getOrderByToken(token: string): Promise<Order | null> {
    try {
      const orders = await this.getAllOrders();
      return orders.find(o => o.trackingToken === token) || null;
    } catch (error) {
      console.error('Error obteniendo pedido por token:', error);
      return null;
    }
  }

  static async getOrdersByUser(email: string): Promise<Order[]> {
    try {
      const response = await ordersAPI.getByUserEmail(email);
      return response.success ? response.orders : [];
    } catch (error) {
      console.error('Error obteniendo pedidos de usuario:', error);
      return [];
    }
  }

  static async createOrder(order: Order): Promise<boolean> {
    try {
      const response = await ordersAPI.create(order);
      return response.success;
    } catch (error) {
      console.error('Error creando pedido:', error);
      return false;
    }
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus, adminNotes?: string): Promise<boolean> {
    try {
      const response = await ordersAPI.updateStatus(orderId, status, adminNotes);
      return response.success;
    } catch (error) {
      console.error('Error actualizando estado de pedido:', error);
      return false;
    }
  }

  static async getOrderStats() {
    try {
      const orders = await this.getAllOrders();
      const total = orders.length;
      const pending = orders.filter(o => o.status === 'pending').length;
      const confirmed = orders.filter(o => o.status === 'confirmed').length;
      const preparing = orders.filter(o => o.status === 'preparing').length;
      const delivering = orders.filter(o => o.status === 'delivering').length;
      const delivered = orders.filter(o => o.status === 'delivered').length;
      const cancelled = orders.filter(o => o.status === 'cancelled').length;

      const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0);

      return {
        total,
        pending,
        confirmed,
        preparing,
        delivering,
        delivered,
        cancelled,
        totalRevenue,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de pedidos:', error);
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        preparing: 0,
        delivering: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
      };
    }
  }

  static async getPendingOrders(): Promise<Order[]> {
    const orders = await this.getAllOrders();
    return orders.filter(o => o.status === 'pending');
  }

  static async getActiveOrders(): Promise<Order[]> {
    const orders = await this.getAllOrders();
    return orders.filter(o => 
      o.status !== 'delivered' && o.status !== 'cancelled'
    );
  }
}