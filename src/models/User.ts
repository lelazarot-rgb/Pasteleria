// Models - User
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthUser {
  email: string;
  name: string;
  role: 'user' | 'admin';
}
