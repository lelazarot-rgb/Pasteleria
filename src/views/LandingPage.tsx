// Views - Landing Page para usuarios
import { useState } from 'react';
import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import { Cart } from '../components/Cart';
import { Product } from '../models/Product';
import { ProductController } from '../controllers/ProductController';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Gift, Snowflake, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface LandingPageProps {
  onProductClick: (product: Product) => void;
  cartItems: any[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  totalPrice: number;
  onCheckout: () => void;
}

export function LandingPage({
  onProductClick,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  totalPrice,
  onCheckout,
}: LandingPageProps) {
  const [showChristmasOnly, setShowChristmasOnly] = useState(false);
  const christmasProducts = ProductController.getChristmasProducts();

  return (
    <>
      <Hero />

      {/* Sección de Ofertas Navideñas */}
      <section className="my-12 bg-gradient-to-r from-red-50 via-green-50 to-red-50 rounded-2xl p-8 border-2 border-red-200">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Snowflake className="text-blue-500 size-8" />
            <h2 className="text-red-600">🎄 Ofertas Especiales de Navidad 🎅</h2>
            <Sparkles className="text-yellow-500 size-8" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ¡Celebra esta Navidad con nuestras tortas especiales! Descuentos exclusivos hasta el 25 de diciembre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {christmasProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-red-300 relative">
              <Badge className="absolute top-4 right-4 z-10 bg-red-600 text-white">
                -{product.discount}% OFF
              </Badge>
              <div 
                className="h-48 bg-gray-100 cursor-pointer relative overflow-hidden group"
                onClick={() => onProductClick(product)}
              >
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-1608780720006-9e691b227f46?w=400&h=300&fit=crop`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <p className="text-sm">Ver detalles</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  <Gift className="text-red-500 size-5 shrink-0 mt-1" />
                  <h3 className="text-gray-900 line-clamp-2">{product.name}</h3>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through">S/. {product.originalPrice?.toFixed(2)}</span>
                  <span className="text-red-600">S/. {product.price.toFixed(2)}</span>
                </div>
                <Button 
                  onClick={() => onProductClick(product)}
                  className="w-full mt-3 bg-red-600 hover:bg-red-700"
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 italic">
            * Oferta válida hasta el 25 de diciembre de 2025. Precios especiales para tamaño mediano 8".
          </p>
        </div>
      </section>

      {/* Toggle para mostrar solo productos navideños */}
      <div className="flex justify-center mb-6">
        <Button
          variant={showChristmasOnly ? "default" : "outline"}
          onClick={() => setShowChristmasOnly(!showChristmasOnly)}
          className="gap-2"
        >
          <Gift className="size-4" />
          {showChristmasOnly ? 'Ver Todos los Productos' : 'Solo Productos Navideños'}
        </Button>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6 mb-12">
        <ProductGrid 
          onProductClick={onProductClick} 
          filterChristmasOnly={showChristmasOnly}
        />
        <Cart 
          items={cartItems}
          onRemoveItem={onRemoveItem}
          onUpdateQuantity={onUpdateQuantity}
          totalPrice={totalPrice}
          onCheckout={onCheckout}
        />
      </div>
    </>
  );
}