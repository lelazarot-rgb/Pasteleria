import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from '../models/Product';
import { ProductController } from '../controllers/ProductController';
import { formatCurrency } from '../lib/utils';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Gift } from 'lucide-react';

interface ProductGridProps {
  onProductClick: (product: Product) => void;
  filterChristmasOnly?: boolean;
}

export function ProductGrid({ onProductClick, filterChristmasOnly = false }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const categories = ProductController.getCategories();

  let allProducts = ProductController.getAllProducts();
  
  // Filtrar solo productos navideños si está activado
  if (filterChristmasOnly) {
    allProducts = ProductController.getChristmasProducts();
  }

  const filteredProducts = selectedCategory === 'Todas'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2>Catálogo de Pasteles</h2>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded transition-colors ${
                selectedCategory === category
                  ? 'bg-[#d9668c] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductClick(product)}
            className="bg-white border border-[#e6e0e6] rounded cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 relative"
          >
            {product.isChristmasOffer && (
              <Badge className="absolute top-4 right-4 z-10 bg-red-600 text-white">
                <Gift className="size-3 mr-1" />
                -{product.discount}% OFF
              </Badge>
            )}
            <div className="p-2.5">
              <div className="bg-[#f5e6eb] h-[200px] mb-3 rounded overflow-hidden">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop`}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[#262626]">{product.name}</p>
                <p className="text-gray-500 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between pt-2">
                  {product.isChristmasOffer && product.originalPrice ? (
                    <div className="flex items-center gap-2">
                      <p className="text-gray-400 line-through text-sm">{formatCurrency(product.originalPrice * 0.8)}</p>
                      <p className="text-red-600">Desde {formatCurrency(product.price * 0.8)}</p>
                    </div>
                  ) : (
                    <p className="text-[#d9668c]">Desde {formatCurrency(product.price * 0.8)}</p>
                  )}
                  <span className={`text-gray-400 px-2 py-1 rounded text-sm ${
                    product.category === 'Navidad' ? 'bg-red-100 text-red-600' : 'bg-gray-100'
                  }`}>
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}