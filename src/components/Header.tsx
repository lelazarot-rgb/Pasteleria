import { ShoppingCart, User, LogOut, Shield, LayoutDashboard } from 'lucide-react';
import { AuthUser } from '../models/User';

type View = 'home' | 'admin' | 'tracking' | 'customize' | 'checkout' | 'myorders' | 'contact' | 'login';

interface HeaderProps {
  onNavigate: (view: View) => void;
  currentView: View;
  cartItemCount: number;
  currentUser: AuthUser | null;
  onLogout: () => void;
  isAdmin: boolean;
}

export function Header({ onNavigate, currentView, cartItemCount, currentUser, onLogout, isAdmin }: HeaderProps) {
  const navItems = isAdmin ? [
    { label: 'Panel Admin', view: 'admin' as View, icon: LayoutDashboard },
    { label: 'Tracking', view: 'tracking' as View },
    { label: 'Contacto', view: 'contact' as View },
  ] : [
    { label: 'Catálogo', view: 'home' as View },
    { label: 'Personalizar', view: 'customize' as View },
    ...(currentUser ? [{ label: 'Mis Pedidos', view: 'myorders' as View }] : []),
    { label: 'Tracking', view: 'tracking' as View },
    { label: 'Contacto', view: 'contact' as View },
  ];

  return (
    <header className="bg-[#faf6eb] px-6 py-6 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <button 
          onClick={() => onNavigate(isAdmin ? 'admin' : 'home')}
          className="bg-white px-3 py-2 rounded hover:shadow-md transition-shadow"
        >
          <h1 className="text-[#d9668c]">
            {isAdmin && <Shield className="inline-block mr-2 size-5" />}
            The PastryShop
          </h1>
        </button>
        
        <nav className="flex items-center gap-5">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onNavigate(item.view)}
              className={`text-[#262626] hover:text-[#d9668c] transition-colors flex items-center gap-1 ${
                currentView === item.view ? 'text-[#d9668c]' : ''
              }`}
            >
              {item.icon && <item.icon size={16} />}
              {item.label}
            </button>
          ))}
          
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded ${
                isAdmin ? 'bg-blue-100 border border-blue-300' : 'bg-white'
              }`}>
                {isAdmin ? (
                  <Shield size={16} className="text-blue-600" />
                ) : (
                  <User size={16} className="text-[#d9668c]" />
                )}
                <span className={isAdmin ? 'text-blue-900' : 'text-[#262626]'}>
                  {currentUser.name}
                </span>
              </div>
              <button 
                onClick={onLogout}
                className="text-[#262626] hover:text-[#d9668c] transition-colors flex items-center gap-1"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className={`text-[#262626] hover:text-[#d9668c] transition-colors flex items-center gap-1 ${
                currentView === 'login' ? 'text-[#d9668c]' : ''
              }`}
            >
              <User size={18} />
              Login
            </button>
          )}

          {!isAdmin && currentView !== 'checkout' && (
            <button 
              onClick={() => onNavigate('checkout')}
              className="relative text-[#262626] hover:text-[#d9668c] transition-colors"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d9668c] text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}