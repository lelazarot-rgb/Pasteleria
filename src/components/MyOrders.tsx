import { useEffect, useState } from 'react';
import { Package, Calendar, MapPin, Eye } from 'lucide-react';
import { Order } from '../lib/types';
import { storage } from '../lib/storage';
import { formatCurrency, formatDate } from '../lib/utils';

interface MyOrdersProps {
  onViewOrder: (trackingToken: string) => void;
}

export function MyOrders({ onViewOrder }: MyOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const allOrders = storage.getOrders();
    // Ordenar por fecha más reciente
    const sortedOrders = allOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(sortedOrders);
  }, []);

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
      
      document.execCommand('copy');
      textArea.remove();
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    delivering: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    preparing: 'En preparación',
    delivering: 'En camino',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };

  if (orders.length === 0) {
    return (
      <div className="py-8">
        <h2 className="mb-6">Mis Pedidos</h2>
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <Package size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-2">No tienes pedidos aún</p>
          <p className="text-gray-400">Tus pedidos aparecerán aquí una vez que realices una compra</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2>Mis Pedidos</h2>
        <p className="text-gray-600">{orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3>Pedido #{order.orderNumber}</h3>
                  <span className={`px-3 py-1 rounded ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{order.customerInfo.city}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-gray-600 mb-1">Total</p>
                <p className="text-[#d9668c]">{formatCurrency(order.total)}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="text-gray-600 mb-2">Productos:</p>
              <div className="space-y-1">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-700">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#fef9fb] border border-[#fad9e6] rounded p-3 mb-4">
              <p className="text-gray-600 mb-1">Código de seguimiento:</p>
              <div className="flex items-center justify-between">
                <code className="text-[#d9668c] font-mono">{order.trackingToken}</code>
                <button
                  onClick={() => {
                    copyToClipboard(order.trackingToken);
                  }}
                  className="text-gray-500 hover:text-[#d9668c] transition-colors"
                  title="Copiar código"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {order.deliveryDate && (
              <p className="text-gray-600 mb-4">
                Fecha de entrega: <strong>{formatDate(order.deliveryDate)}</strong>
              </p>
            )}

            <button
              onClick={() => onViewOrder(order.trackingToken)}
              className="w-full py-2 bg-[#d9668c] text-white rounded hover:bg-[#c55579] transition-colors flex items-center justify-center gap-2"
            >
              <Eye size={18} />
              Ver detalles del pedido
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}