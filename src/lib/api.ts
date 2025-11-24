// API utilities para comunicación con Supabase
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-21c02cea`;

// Headers comunes para todas las peticiones
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
});

// Función helper para manejar respuestas
async function handleResponse(response: Response) {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }
  
  return data;
}

// ============================================
// API DE USUARIOS
// ============================================

export const usersAPI = {
  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  async getAll() {
    const response = await fetch(`${API_URL}/users`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async updateRole(userId: string, role: 'user' | 'admin') {
    const response = await fetch(`${API_URL}/users/${userId}/role`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleResponse(response);
  },

  async delete(userId: string) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// ============================================
// API DE PEDIDOS
// ============================================

export const ordersAPI = {
  async create(orderData: any) {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  async getAll() {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getByUserEmail(email: string) {
    const response = await fetch(`${API_URL}/orders/user/${encodeURIComponent(email)}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async updateStatus(orderId: string, status: string, adminNotes?: string) {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, adminNotes }),
    });
    return handleResponse(response);
  },
};

// ============================================
// API DE TORTAS PERSONALIZADAS
// ============================================

export const customCakesAPI = {
  async save(cakeData: any) {
    const response = await fetch(`${API_URL}/custom-cakes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cakeData),
    });
    return handleResponse(response);
  },

  async getByUserEmail(email: string) {
    const response = await fetch(`${API_URL}/custom-cakes/user/${encodeURIComponent(email)}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Health check
export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('API health check failed:', error);
    return { status: 'error', error };
  }
}
