import { useState } from 'react';
import { CreditCard, MapPin, Calendar, User, Mail, Phone, Building, ArrowLeft, CheckCircle } from 'lucide-react';
import { CustomerInfo, Order } from '../models/Order';
import { storage } from '../lib/storage';
import { OrderController } from '../controllers/OrderController';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner@2.0.3';

interface CheckoutProps {
  cart: {
    items: CartItem[];
    total: number;
  };
  onComplete: () => void;
  onCancel: () => void;
}

export function Checkout({ cart, onCancel, onComplete }: CheckoutProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(customerInfo.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!validatePhone(customerInfo.phone)) {
      newErrors.phone = 'Teléfono inválido (9 dígitos)';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!customerInfo.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const copyToClipboard = async (text: string) => {
    try {
      // Use fallback method that always works
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      textArea.remove();
      
      if (successful) {
        toast.success('Código copiado al portapapeles');
      } else {
        toast.error('No se pudo copiar. Por favor, copia manualmente el código.');
      }
    } catch (err) {
      console.error('Failed to copy text', err);
      toast.error('No se pudo copiar. Por favor, copia manualmente el código.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(),
      items: cart.items,
      total: cart.total,
      status: 'pending',
      customerInfo,
      deliveryDate: cart.items[0]?.deliveryDate || '',
      createdAt: new Date().toISOString(),
      trackingToken: generateTrackingToken(),
    };

    const success = await OrderController.createOrder(order);
    
    if (!success) {
      toast.error('Error al crear el pedido. Por favor intenta nuevamente.');
      setIsProcessing(false);
      return;
    }

    toast.success('¡Pedido realizado con éxito!');
    
    setIsProcessing(false);
    setCompletedOrder(order);
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo({ ...customerInfo, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Si el pedido está completado, mostrar el código de seguimiento
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-lg border-2 border-[#d9668c] p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="mb-2">¡Pedido confirmado!</h2>
          <p className="text-gray-600 mb-6">
            Gracias por tu compra. Hemos recibido tu pedido correctamente.
          </p>

          <div className="bg-[#fef9fb] border-2 border-[#d9668c] rounded-lg p-6 mb-6">
            <p className="text-gray-600 mb-2">Tu código de seguimiento es:</p>
            <div className="text-3xl font-mono text-[#d9668c] tracking-wider mb-3">
              {completedOrder.trackingToken}
            </div>
            <p className="text-gray-500">
              Guarda este código para rastrear tu pedido
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="mb-3">Detalles del pedido</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Número de orden:</strong> {completedOrder.orderNumber}</p>
              <p><strong>Total:</strong> {formatCurrency(completedOrder.total)}</p>
              <p><strong>Estado:</strong> Pendiente de confirmación</p>
              <p><strong>Fecha estimada de entrega:</strong> {completedOrder.deliveryDate}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600">
              Te hemos enviado un correo de confirmación a: <strong>{completedOrder.customerInfo.email}</strong>
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onComplete}
                className="flex-1 py-3 bg-[#d9668c] text-white rounded hover:bg-[#c55579] transition-colors"
              >
                Ver seguimiento
              </button>
              <button
                onClick={() => {
                  setCompletedOrder(null);
                  onCancel();
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Seguir comprando
              </button>
            </div>

            <button
              onClick={() => copyToClipboard(completedOrder.trackingToken)}
              className="w-full py-2 text-[#d9668c] hover:text-[#c55579] transition-colors"
            >
              Copiar código de seguimiento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-600 hover:text-[#d9668c] transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        Volver al carrito
      </button>

      <h2 className="mb-8">Finalizar compra</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="mb-4">Información personal</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Nombre completo *</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full p-3 border rounded focus:outline-none ${
                      errors.name ? 'border-red-500' : 'border-gray-300 focus:border-[#d9668c]'
                    }`}
                    placeholder="Juan Pérez"
                  />
                  {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block mb-2">Email *</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full p-3 border rounded focus:outline-none ${
                      errors.email ? 'border-red-500' : 'border-gray-300 focus:border-[#d9668c]'
                    }`}
                    placeholder="juan@ejemplo.com"
                  />
                  {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full p-3 border rounded focus:outline-none ${
                      errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-[#d9668c]'
                    }`}
                    placeholder="987654321"
                  />
                  {errors.phone && <p className="text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block mb-2">Dirección de entrega *</label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full p-3 border rounded focus:outline-none ${
                      errors.address ? 'border-red-500' : 'border-gray-300 focus:border-[#d9668c]'
                    }`}
                    placeholder="Av. Principal 123, Dpto 456"
                  />
                  {errors.address && <p className="text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block mb-2">Ciudad *</label>
                  <input
                    type="text"
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full p-3 border rounded focus:outline-none ${
                      errors.city ? 'border-red-500' : 'border-gray-300 focus:border-[#d9668c]'
                    }`}
                    placeholder="Lima"
                  />
                  {errors.city && <p className="text-red-500 mt-1">{errors.city}</p>}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="mb-4">Método de pago</h3>
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-4 border-2 rounded flex items-center gap-3 transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-[#d9668c] bg-[#fef9fb]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard size={24} />
                  <div className="text-left">
                    <p>Tarjeta de crédito/débito</p>
                    <p className="text-gray-500">Pago seguro online</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`w-full p-4 border-2 rounded flex items-center gap-3 transition-colors ${
                    paymentMethod === 'transfer'
                      ? 'border-[#d9668c] bg-[#fef9fb]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center bg-[#d9668c] text-white rounded">
                    S/
                  </div>
                  <div className="text-left">
                    <p>Transferencia bancaria</p>
                    <p className="text-gray-500">Pago por adelantado</p>
                  </div>
                </button>
              </div>

              {paymentMethod === 'transfer' && (
                <div className="mt-4 p-4 bg-blue-50 rounded">
                  <p className="mb-2">Datos bancarios:</p>
                  <p>Banco: BCP</p>
                  <p>Cuenta: 123-456789-0-12</p>
                  <p>CCI: 00212312345678901234</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#d9668c] text-white rounded hover:bg-[#c55579] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Procesando...' : `Confirmar pedido - ${formatCurrency(cart.total)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
            <h3 className="mb-4">Resumen del pedido</h3>
            
            <div className="space-y-3 mb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span className="text-[#d9668c]">{formatCurrency(cart.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}