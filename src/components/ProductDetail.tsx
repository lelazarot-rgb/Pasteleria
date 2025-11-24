import { X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import { Product, Size } from '../models/Product';
import { formatCurrency, calculateItemPrice, getMinDeliveryDate } from '../lib/utils';
import { toast } from 'sonner@2.0.3';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: Size, deliveryDate?: string, customMessage?: string) => void;
}

export function ProductDetail({ product, onClose, onAddToCart }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<Size>(product.availableSizes[1]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const handleAddToCart = () => {
    if (!deliveryDate) {
      toast.error('Por favor selecciona una fecha de entrega');
      return;
    }

    onAddToCart(product, selectedSize, deliveryDate, customMessage);
    toast.success('Producto agregado al carrito');
    onClose();
  };

  const currentPrice = calculateItemPrice(product.price, selectedSize.priceMultiplier);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-[860px] w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-1"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="bg-[#faf0f3] rounded aspect-square overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop"
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform"
            />
          </div>

          <div className="flex flex-col">
            <h2 className="mb-2">{product.name}</h2>
            <span className="inline-block bg-[#fad9e6] text-[#73263f] px-3 py-1 rounded w-fit mb-4">
              {product.category}
            </span>
            
            <p className="mb-6 text-gray-600">{product.description}</p>

            <div className="mb-6">
              <label className="block mb-2">Tamaño: *</label>
              <div className="space-y-2">
                {product.availableSizes.map((size) => {
                  const price = calculateItemPrice(product.price, size.priceMultiplier);
                  return (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size)}
                      className={`w-full p-3 border-2 rounded transition-colors text-left ${
                        selectedSize.name === size.name
                          ? 'border-[#d9668c] bg-[#fef9fb]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{size.label}</span>
                        <span className="text-[#d9668c]">{formatCurrency(price)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Fecha de entrega: *</label>
              <input
                type="date"
                value={deliveryDate}
                min={getMinDeliveryDate()}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:border-[#d9668c] focus:outline-none"
              />
              <p className="text-gray-500 mt-1">
                Mínimo 2 días de anticipación
              </p>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Mensaje personalizado (opcional):</label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Ej: Feliz cumpleaños María"
                maxLength={50}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded focus:border-[#d9668c] focus:outline-none resize-none"
              />
              <p className="text-gray-500 mt-1">
                {customMessage.length}/50 caracteres
              </p>
            </div>

            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded">
              <span>Precio:</span>
              <span className="text-[#d9668c]">{formatCurrency(currentPrice)}</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-[#d9668c] text-white rounded hover:bg-[#c55579] transition-colors"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}