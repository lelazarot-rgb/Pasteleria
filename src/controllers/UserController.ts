// Controllers - User Controller
import { User, AuthUser } from '../models/User';
import { storage } from '../lib/storage';
import { usersAPI } from '../lib/api';

export class UserController {
  static async login(email: string, password: string): Promise<AuthUser | null> {
    try {
      const response = await usersAPI.login(email, password);
      
      if (response.success && response.user) {
        const authUser: AuthUser = response.user;
        storage.setCurrentUser(authUser);
        return authUser;
      }
      
      return null;
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  }

  static async register(name: string, email: string, password: string): Promise<AuthUser | null> {
    try {
      const response = await usersAPI.register(name, email, password);
      
      if (response.success && response.user) {
        const authUser: AuthUser = response.user;
        storage.setCurrentUser(authUser);
        return authUser;
      }
      
      return null;
    } catch (error) {
      console.error('Error en registro:', error);
      return null;
    }
  }

  static getCurrentUser(): AuthUser | null {
    return storage.getCurrentUser() as AuthUser | null;
  }

  static logout(): void {
    storage.logout();
  }

  static isAdmin(user: AuthUser | null): boolean {
    return user?.role === 'admin';
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await usersAPI.getAll();
      return response.success ? response.users : [];
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  }

  static async getUserStats() {
    try {
      const users = await UserController.getAllUsers();
      return {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        regularUsers: users.filter(u => u.role === 'user').length,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de usuarios:', error);
      return { total: 0, admins: 0, regularUsers: 0 };
    }
  }

  static async updateUserRole(userId: string, newRole: 'user' | 'admin'): Promise<boolean> {
    try {
      const response = await usersAPI.updateRole(userId, newRole);
      return response.success;
    } catch (error) {
      console.error('Error actualizando rol de usuario:', error);
      return false;
    }
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const response = await usersAPI.delete(userId);
      return response.success;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      return false;
    }
  }
}