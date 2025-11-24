import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductDetail } from './components/ProductDetail';
import { OrderTracking } from './components/OrderTracking';
import { Checkout } from './components/Checkout';
import { CustomizeCake } from './components/CustomizeCake';
import { MyOrders } from './components/MyOrders';
import { Login } from './components/Login';
import { Contact } from './components/Contact';
import { LandingPage } from './views/LandingPage';
import { AdminDashboard } from './views/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import { useCart } from './hooks/useCart';
import { Product } from './models/Product';
import { AuthUser } from './models/User';
import { UserController } from './controllers/UserController';
import { toast } from 'sonner@2.0.3';

type View = 'home' | 'admin' | 'tracking' | 'customize' | 'checkout' | 'myorders' | 'contact' | 'login';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const cart = useCart();

  // Cargar usuario actual al montar
  useEffect(() => {
    const user = UserController.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Si el usuario es admin y acaba de cargar, mostrar el dashboard
      if (user.role === 'admin') {
        setCurrentView('admin');
      }
    }
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para realizar un pedido');
      setCurrentView('login');
      return;
    }
    setCurrentView('checkout');
  };

  const handleCheckoutComplete = () => {
    cart.clearCart();
    setCurrentView('tracking');
  };

  const handleViewOrder = (trackingToken: string) => {
    setTrackingQuery(trackingToken);
    setCurrentView('tracking');
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    // Redirigir según el rol
    if (user.role === 'admin') {
      setCurrentView('admin');
      toast.success('Acceso al panel de administrador');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    UserController.logout();
    toast.success('Sesión cerrada correctamente');
    setCurrentView('home');
  };

  const handleNavigate = (view: View) => {
    // Si intenta ir a "Mis Pedidos" sin estar logueado, redirigir a login
    if (view === 'myorders' && !currentUser) {
      toast.error('Debes iniciar sesión para ver tus pedidos');
      setCurrentView('login');
      return;
    }

    // Si intenta ir al admin sin ser admin
    if (view === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
      toast.error('No tienes permisos para acceder al panel de administrador');
      return;
    }

    setCurrentView(view);
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNavigate={handleNavigate} 
        currentView={currentView}
        cartItemCount={cart.getItemCount()}
        currentUser={currentUser}
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />
      
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Vista de Usuario - Landing Page */}
        {currentView === 'home' && !isAdmin && (
          <LandingPage
            onProductClick={handleProductClick}
            cartItems={cart.items}
            onRemoveItem={cart.removeItem}
            onUpdateQuantity={cart.updateQuantity}
            totalPrice={cart.getTotal()}
            onCheckout={handleCheckout}
          />
        )}

        {/* Vista de Administrador */}
        {currentView === 'admin' && isAdmin && (
          <AdminDashboard />
        )}

        {/* Redirigir a home si el admin está en vista de usuario */}
        {currentView === 'home' && isAdmin && (
          <div className="py-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-blue-900 mb-4">Panel de Administrador</h2>
              <p className="text-blue-700 mb-6">
                Estás logueado como administrador. Utiliza el panel para gestionar los pedidos.
              </p>
              <button
                onClick={() => setCurrentView('admin')}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Ir al Panel de Administrador
              </button>
            </div>
          </div>
        )}

        {currentView === 'tracking' && (
          <OrderTracking initialToken={trackingQuery} />
        )}

        {currentView === 'customize' && (
          <CustomizeCake onAddToCart={cart.addItem} />
        )}

        {currentView === 'myorders' && (
          <MyOrders onViewOrder={handleViewOrder} />
        )}

        {currentView === 'contact' && (
          <Contact />
        )}

        {currentView === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}

        {currentView === 'checkout' && (
          <Checkout 
            cart={{
              items: cart.items,
              total: cart.getTotal()
            }}
            onComplete={handleCheckoutComplete}
            onCancel={() => setCurrentView('home')}
          />
        )}
      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={handleCloseProductDetail}
          onAddToCart={cart.addItem}
        />
      )}

      <Footer onNavigate={handleNavigate} />

      <Toaster />
    </div>
  );
}