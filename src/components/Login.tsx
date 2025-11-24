import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { UserController } from '../controllers/UserController';
import { AuthUser } from '../models/User';
import { validateEmail } from '../lib/utils';

interface LoginProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isLogin) {
      // Login
      UserController.login(formData.email, formData.password)
        .then(user => {
          if (!user) {
            toast.error('Correo o contraseña incorrectos');
            return;
          }

          if (user.role === 'admin') {
            toast.success(`¡Bienvenido Administrador, ${user.name}!`);
          } else {
            toast.success(`¡Bienvenido de nuevo, ${user.name}!`);
          }
          onLoginSuccess(user);
        })
        .catch(error => {
          console.error('Error en login:', error);
          toast.error('Error al iniciar sesión');
        });
    } else {
      // Register
      UserController.register(formData.name, formData.email, formData.password)
        .then(user => {
          if (!user) {
            toast.error('Este correo ya está registrado');
            return;
          }

          toast.success('¡Cuenta creada exitosamente!');
          onLoginSuccess(user);
        })
        .catch(error => {
          console.error('Error en registro:', error);
          toast.error('Error al crear cuenta');
        });
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white rounded-lg border-2 border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#fef9fb] rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-[#d9668c]" />
          </div>
          <h2 className="mb-2">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="text-gray-600">
            {isLogin
              ? 'Ingresa a tu cuenta para ver tus pedidos'
              : 'Regístrate para comenzar a realizar pedidos'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#d9668c] ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Juan Pérez"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#d9668c] ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#d9668c] ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#d9668c] ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#d9668c] text-white rounded hover:bg-[#c55579] transition-colors"
          >
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            {' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                setErrors({});
              }}
              className="text-[#d9668c] hover:text-[#c55579] transition-colors"
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}