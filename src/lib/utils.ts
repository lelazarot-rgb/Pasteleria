import { Order, OrderStatus, OrderStep } from './types';

export function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `PTS-${timestamp}-${random}`;
}

export function generateTrackingToken(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 10; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

export function formatCurrency(amount: number): string {
  return `S/. ${amount.toFixed(2)}`;
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getOrderSteps(status: OrderStatus): OrderStep[] {
  const steps: OrderStep[] = [
    { name: 'Pedido recibido', completed: false },
    { name: 'Confirmado', completed: false },
    { name: 'En preparación', completed: false },
    { name: 'En camino', completed: false },
    { name: 'Entregado', completed: false },
  ];

  const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered'];
  const currentIndex = statusOrder.indexOf(status);

  steps.forEach((step, index) => {
    if (index <= currentIndex) {
      step.completed = true;
    }
  });

  if (status === 'cancelled') {
    return [
      { name: 'Pedido recibido', completed: true },
      { name: 'Cancelado', completed: true },
    ];
  }

  return steps;
}

export function getMinDeliveryDate(): string {
  const today = new Date();
  today.setDate(today.getDate() + 2); // Mínimo 2 días de anticipación
  return today.toISOString().split('T')[0];
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^[0-9]{9}$/;
  return re.test(phone.replace(/\s/g, ''));
}

export function calculateItemPrice(basePrice: number, sizeMultiplier: number): number {
  return basePrice * sizeMultiplier;
}