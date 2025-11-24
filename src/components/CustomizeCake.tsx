import { useState } from 'react';
import { ChefHat, Palette } from 'lucide-react';
import { Product, Size } from '../lib/types';
import { sizes } from '../lib/products';
import { formatCurrency, calculateItemPrice, getMinDeliveryDate } from '../lib/utils';
import { toast } from 'sonner@2.0.3';

interface CustomizeCakeProps {
  onAddToCart: (product: Product, size: Size, deliveryDate?: string, customMessage?: string) => void;
}

const flavors = [
  { id: 'chocolate', name: 'Chocolate', price: 0 },
  { id: 'vanilla', name: 'Vainilla', price: 0 },
  { id: 'red-velvet', name: 'Red Velvet', price: 10 },
  { id: 'carrot', name: 'Zanahoria', price: 5 },
  { id: 'lemon', name: 'Limón', price: 5 },
];

const fillings = [
  { id: 'buttercream', name: 'Buttercream', price: 0 },
  { id: 'cream-cheese', name: 'Cream Cheese', price: 8 },
  { id: 'chocolate-ganache', name: 'Ganache de Chocolate', price: 10 },
  { id: 'fruits', name: 'Frutas Frescas', price: 12 },
  { id: 'dulce-leche', name: 'Dulce de Leche', price: 8 },
];

const decorations = [
  { id: 'simple', name: 'Decoración Simple', price: 0 },
  { id: 'flowers', name: 'Flores Comestibles', price: 15 },
  { id: 'fruits-top', name: 'Frutas en la Parte Superior', price: 18 },
  { id: 'chocolate-drip', name: 'Goteo de Chocolate', price: 20 },
  { id: 'custom', name: 'Diseño Personalizado', price: 35 },
];

export function CustomizeCake({ onAddToCart }: CustomizeCakeProps) {
  const [selectedSize, setSelectedSize] = useState<Size>(sizes[1]);
  const [selectedFlavor, setSelectedFlavor] = useState(flavors[0]);
  const [selectedFilling, setSelectedFilling] = useState(fillings[0]);
  const [selectedDecoration, setSelectedDecoration] = useState(decorations[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const basePrice = 70;
  const totalPrice = calculateItemPrice(
    basePrice + selectedFlavor.price + selectedFilling.price + selectedDecoration.price,
    selectedSize.priceMultiplier
  );

  const handleAddToCart = () => {
    if (!deliveryDate) {
      toast.error('Por favor selecciona una fecha de entrega');
      return;
    }

    const customProduct: Product = {
      id: Math.floor(Math.random() * 10000),
      name: `Torta Personalizada (${selectedFlavor.name})`,
      price: totalPrice,
      description: `Sabor: ${selectedFlavor.name}, Relleno: ${selectedFilling.name}, Decoración: ${selectedDecoration.name}`,
      image: 'custom-cake',
      category: 'Personalizada',
      availableSizes: sizes,
    };

    const fullMessage = customMessage + (specialInstructions ? ` | ${specialInstructions}` : '');

    onAddToCart(customProduct, selectedSize, deliveryDate, fullMessage);
    toast.success('Torta personalizada agregada al carrito');

    // Reset form
    setCustomMessage('');
    setSpecialInstructions('');
  };

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ChefHat size={32} className="text-[#d9668c]" />
        <div>
          <h2>Personaliza tu Torta</h2>
          <p className="text-gray-600">Crea la torta perfecta según tus preferencias</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Size Selection */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="mb-4 flex items-center gap-2">
              <span>Tamaño</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sizes.map((size) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size)}
                  className={`p-4 border-2 rounded transition-colors text-left ${
                    selectedSize.name === size.name
                      ? 'border-[#d9668c] bg-[#fef9fb]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p>{size.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Flavor Selection */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="mb-4">Sabor del bizcocho</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {flavors.map((flavor) => (
                <button
                  key={flavor.id}
                  onClick={() => setSelectedFlavor(flavor)}
                  className={`p-4 border-2 rounded transition-colors text-left ${
                    selectedFlavor.id === flavor.id
                      ? 'border-[#d9668c] bg-[#fef9fb]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{flavor.name}</span>
                    {flavor.price > 0 && (
                      <span className="text-[#d9668c]">+{formatCurrency(flavor.price)}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filling Selection */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="mb-4">Relleno</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fillings.map((filling) => (
                <button
                  key={filling.id}
                  onClick={() => setSelectedFilling(filling)}
                  className={`p-4 border-2 rounded transition-colors text-left ${
                    selectedFilling.id === filling.id
                      ? 'border-[#d9668c] bg-[#fef9fb]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{filling.name}</span>
                    {filling.price > 0 && (
                      <span className="text-[#d9668c]">+{formatCurrency(filling.price)}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Decoration Selection */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="mb-4 flex items-center gap-2">
              <Palette size={20} />
              Decoración
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {decorations.map((decoration) => (
                <button
                  key={decoration.id}
                  onClick={() => setSelectedDecoration(decoration)}
                  className={`p-4 border-2 rounded transition-colors text-left ${
                    selectedDecoration.id === decoration.id
                      ? 'border-[#d9668c] bg-[#fef9fb]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{decoration.name}</span>
                    {decoration.price > 0 && (
                      <span className="text-[#d9668c]">+{formatCurrency(decoration.price)}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h3 className="mb-4">Opciones adicionales</h3>
            
            <div>
              <label className="block mb-2">Fecha de entrega: *</label>
              <input
                type="date"
                value={deliveryDate}
                min={getMinDeliveryDate()}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:border-[#d9668c] focus:outline-none"
              />
              <p className="text-gray-500 mt-1">
                Las tortas personalizadas requieren mínimo 3 días de anticipación
              </p>
            </div>

            <div>
              <label className="block mb-2">Mensaje en la torta:</label>
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Ej: Feliz cumpleaños María"
                maxLength={50}
                className="w-full p-3 border border-gray-300 rounded focus:border-[#d9668c] focus:outline-none"
              />
              <p className="text-gray-500 mt-1">
                {customMessage.length}/50 caracteres
              </p>
            </div>

            <div>
              <label className="block mb-2">Instrucciones especiales:</label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Ej: Sin nueces, decoración en colores pastel, etc."
                maxLength={200}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded focus:border-[#d9668c] focus:outline-none resize-none"
              />
              <p className="text-gray-500 mt-1">
                {specialInstructions.length}/200 caracteres
              </p>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
            <h3 className="mb-4">Resumen</h3>
            
            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Tamaño:</span>
                <span>{selectedSize.label}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Sabor:</span>
                <span>{selectedFlavor.name}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Relleno:</span>
                <span>{selectedFilling.name}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Decoración:</span>
                <span>{selectedDecoration.name}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between">
                <span>Precio base:</span>
                <span>{formatCurrency(basePrice)}</span>
              </div>
              {selectedFlavor.price > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Sabor:</span>
                  <span>+{formatCurrency(selectedFlavor.price)}</span>
                </div>
              )}
              {selectedFilling.price > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Relleno:</span>
                  <span>+{formatCurrency(selectedFilling.price)}</span>
                </div>
              )}
              {selectedDecoration.price > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Decoración:</span>
                  <span>+{formatCurrency(selectedDecoration.price)}</span>
                </div>
              )}
              {selectedSize.priceMultiplier !== 1 && (
                <div className="flex justify-between text-gray-600">
                  <span>Ajuste por tamaño:</span>
                  <span>×{selectedSize.priceMultiplier}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <span>Total:</span>
              <span className="text-[#d9668c]">{formatCurrency(totalPrice)}</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-[#d9668c] text-white rounded hover:bg-[#c55579] transition-colors"
            >
              Agregar al carrito
            </button>

            <p className="text-gray-500 mt-4 text-center">
              Nos pondremos en contacto contigo para confirmar los detalles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
