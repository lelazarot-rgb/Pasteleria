import { useState, useEffect } from 'react';
import { CartItem, Product, Size } from '../models/Product';
import { storage } from '../lib/storage';
import { calculateItemPrice } from '../lib/utils';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = storage.getCart();
    setItems(savedCart);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      storage.saveCart(items);
    }
  }, [items, isLoaded]);

  const addItem = (
    product: Product,
    size: Size,
    deliveryDate?: string,
    customMessage?: string
  ) => {
    const itemId = `${product.id}-${size.name}-${deliveryDate || 'no-date'}`;
    const existingItem = items.find(item => item.id === itemId);
    
    const itemPrice = calculateItemPrice(product.price, size.priceMultiplier);

    if (existingItem) {
      setItems(items.map(item =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        name: `${product.name} - ${size.name}`,
        price: itemPrice,
        quantity: 1,
        size: size.name,
        deliveryDate,
        customMessage,
        isChristmasOffer: product.isChristmasOffer,
      };
      setItems([...items, newItem]);
    }
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    storage.clearCart();
  };

  const getTotal = (): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = (): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };
}