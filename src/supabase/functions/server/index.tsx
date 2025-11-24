import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Prefijo de rutas
const prefix = '/make-server-21c02cea';

// ============================================
// RUTAS DE USUARIOS
// ============================================

// Registrar usuario
app.post(`${prefix}/users/register`, async (c) => {
  try {
    const { name, email, password } = await c.req.json();
    
    // Verificar si el usuario ya existe
    const existingUsers = await kv.get('users') || [];
    const userExists = existingUsers.find((u: any) => u.email === email);
    
    if (userExists) {
      return c.json({ error: 'El email ya está registrado' }, 400);
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    await kv.set('users', existingUsers);

    return c.json({ 
      success: true,
      user: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      }
    });
  } catch (error) {
    console.log('Error registrando usuario:', error);
    return c.json({ error: 'Error al registrar usuario' }, 500);
  }
});

// Login de usuario
app.post(`${prefix}/users/login`, async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    // Admin predeterminado
    if (email === 'admin@tortasmarlyn.com' && password === 'admin123') {
      return c.json({
        success: true,
        user: {
          email: 'admin@tortasmarlyn.com',
          name: 'Administrador',
          role: 'admin',
        }
      });
    }

    const users = await kv.get('users') || [];
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      return c.json({ error: 'Credenciales inválidas' }, 401);
    }

    return c.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error) {
    console.log('Error en login:', error);
    return c.json({ error: 'Error al iniciar sesión' }, 500);
  }
});

// Obtener todos los usuarios (solo admin)
app.get(`${prefix}/users`, async (c) => {
  try {
    const users = await kv.get('users') || [];
    return c.json({ success: true, users });
  } catch (error) {
    console.log('Error obteniendo usuarios:', error);
    return c.json({ error: 'Error al obtener usuarios' }, 500);
  }
});

// Actualizar rol de usuario
app.patch(`${prefix}/users/:id/role`, async (c) => {
  try {
    const { id } = c.req.param();
    const { role } = await c.req.json();
    
    const users = await kv.get('users') || [];
    const userIndex = users.findIndex((u: any) => u.id === id);
    
    if (userIndex === -1) {
      return c.json({ error: 'Usuario no encontrado' }, 404);
    }

    users[userIndex].role = role;
    await kv.set('users', users);

    return c.json({ success: true, user: users[userIndex] });
  } catch (error) {
    console.log('Error actualizando rol de usuario:', error);
    return c.json({ error: 'Error al actualizar rol' }, 500);
  }
});

// Eliminar usuario
app.delete(`${prefix}/users/:id`, async (c) => {
  try {
    const { id } = c.req.param();
    
    const users = await kv.get('users') || [];
    const filteredUsers = users.filter((u: any) => u.id !== id);
    
    if (filteredUsers.length === users.length) {
      return c.json({ error: 'Usuario no encontrado' }, 404);
    }

    await kv.set('users', filteredUsers);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error eliminando usuario:', error);
    return c.json({ error: 'Error al eliminar usuario' }, 500);
  }
});

// ============================================
// RUTAS DE PEDIDOS
// ============================================

// Crear pedido
app.post(`${prefix}/orders`, async (c) => {
  try {
    const orderData = await c.req.json();
    
    const orders = await kv.get('orders') || [];
    const newOrder = {
      ...orderData,
      id: `order_${Date.now()}`,
      orderNumber: `TM${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    orders.push(newOrder);
    await kv.set('orders', orders);

    return c.json({ success: true, order: newOrder });
  } catch (error) {
    console.log('Error creando pedido:', error);
    return c.json({ error: 'Error al crear pedido' }, 500);
  }
});

// Obtener todos los pedidos
app.get(`${prefix}/orders`, async (c) => {
  try {
    const orders = await kv.get('orders') || [];
    return c.json({ success: true, orders });
  } catch (error) {
    console.log('Error obteniendo pedidos:', error);
    return c.json({ error: 'Error al obtener pedidos' }, 500);
  }
});

// Obtener pedidos por email
app.get(`${prefix}/orders/user/:email`, async (c) => {
  try {
    const { email } = c.req.param();
    const orders = await kv.get('orders') || [];
    const userOrders = orders.filter((o: any) => o.customerInfo.email === email);
    
    return c.json({ success: true, orders: userOrders });
  } catch (error) {
    console.log('Error obteniendo pedidos de usuario:', error);
    return c.json({ error: 'Error al obtener pedidos' }, 500);
  }
});

// Actualizar estado de pedido
app.patch(`${prefix}/orders/:id/status`, async (c) => {
  try {
    const { id } = c.req.param();
    const { status, adminNotes } = await c.req.json();
    
    const orders = await kv.get('orders') || [];
    const orderIndex = orders.findIndex((o: any) => o.id === id);
    
    if (orderIndex === -1) {
      return c.json({ error: 'Pedido no encontrado' }, 404);
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    if (adminNotes) {
      orders[orderIndex].adminNotes = adminNotes;
    }

    await kv.set('orders', orders);
    return c.json({ success: true, order: orders[orderIndex] });
  } catch (error) {
    console.log('Error actualizando estado de pedido:', error);
    return c.json({ error: 'Error al actualizar pedido' }, 500);
  }
});

// ============================================
// RUTAS DE TORTAS PERSONALIZADAS
// ============================================

// Guardar diseño de torta personalizada
app.post(`${prefix}/custom-cakes`, async (c) => {
  try {
    const cakeData = await c.req.json();
    
    const customCakes = await kv.get('custom_cakes') || [];
    const newCake = {
      ...cakeData,
      id: `cake_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    customCakes.push(newCake);
    await kv.set('custom_cakes', customCakes);

    return c.json({ success: true, cake: newCake });
  } catch (error) {
    console.log('Error guardando torta personalizada:', error);
    return c.json({ error: 'Error al guardar diseño' }, 500);
  }
});

// Obtener diseños de tortas por usuario
app.get(`${prefix}/custom-cakes/user/:email`, async (c) => {
  try {
    const { email } = c.req.param();
    const customCakes = await kv.get('custom_cakes') || [];
    const userCakes = customCakes.filter((cake: any) => cake.userEmail === email);
    
    return c.json({ success: true, cakes: userCakes });
  } catch (error) {
    console.log('Error obteniendo diseños de tortas:', error);
    return c.json({ error: 'Error al obtener diseños' }, 500);
  }
});

// Ruta de health check
app.get(`${prefix}/health`, (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);