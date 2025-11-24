import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../lib/types';
import { formatCurrency } from '../lib/utils';

interface CartProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  totalPrice: number;
  onCheckout: () => void;
}

export function Cart({ items, onRemoveItem, onUpdateQuantity, totalPrice, onCheckout }: CartProps) {
  return (
    <div className="bg-[#fcfaf6] p-4 rounded h-fit sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag size={20} className="text-[#d9668c]" />
        <h3>Tu carrito</h3>
      </div>
      
      <div className="space-y-3 my-4 max-h-[400px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingBag size={48} className="mx-auto mb-2 opacity-20" />
            <p>El carrito está vacío</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white p-3 rounded relative border border-gray-100">
              <button
                onClick={() => onRemoveItem(item.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Eliminar del carrito"
              >
                <X size={16} />
              </button>
              
              <p className="pr-6">{item.name}</p>
              <p className="text-gray-600 mt-1">
                {formatCurrency(item.price)} c/u
              </p>
              
              {item.deliveryDate && (
                <p className="text-gray-500 mt-1">
                  Entrega: {new Date(item.deliveryDate).toLocaleDateString('es-PE')}
                </p>
              )}
              
              {item.customMessage && (
                <p className="text-gray-500 mt-1 italic">
                  "{item.customMessage}"
                </p>
              )}
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    title="Disminuir cantidad"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    title="Aumentar cantidad"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p>
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <p>Total:</p>
          <p className="text-[#d9668c]">{formatCurrency(totalPrice)}</p>
        </div>

        <button
          onClick={onCheckout}
          className="w-full py-3 bg-[#d9668c] text-white rounded hover:bg-[#c55579] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={items.length === 0}
        >
          Ir a pagar
        </button>
      </div>
    </div>
  );
}
