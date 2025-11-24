import { CartItem, Order, User } from './types';

const CART_KEY = 'pastryshop_cart';
const ORDERS_KEY = 'pastryshop_orders';
const USERS_KEY = 'pastryshop_users';
const CURRENT_USER_KEY = 'pastryshop_current_user';

export const storage = {
  // Cart operations
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  saveCart: (items: CartItem[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  },

  clearCart: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_KEY);
  },

  // Orders operations
  getOrders: (): Order[] => {
    if (typeof window === 'undefined') return [];
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  },

  getAllOrders: (): Order[] => {
    return storage.getOrders();
  },

  getOrdersByUser: (email: string): Order[] => {
    const orders = storage.getOrders();
    return orders.filter(order => order.customerInfo.email.toLowerCase() === email.toLowerCase());
  },

  saveOrder: (order: Order): void => {
    if (typeof window === 'undefined') return;
    const orders = storage.getOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },

  getOrderByToken: (token: string): Order | null => {
    const orders = storage.getOrders();
    return orders.find(order => order.trackingToken === token) || null;
  },

  updateOrderStatus: (orderId: string, status: Order['status']): void => {
    if (typeof window === 'undefined') return;
    const orders = storage.getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      orders[orderIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  },

  // User operations
  getUsers: (): User[] => {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  saveUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getUserByEmail: (email: string): User | null => {
    const users = storage.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getCurrentUser: (): { email: string; name: string; role?: string } | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: { email: string; name: string; role?: string } | null): void => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CURRENT_USER_KEY);
  },
};