// Models - Product
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  availableSizes: Size[];
  isChristmasOffer?: boolean;
  discount?: number;
  originalPrice?: number;
}

export interface Size {
  name: string;
  label: string;
  priceMultiplier: number;
}

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  deliveryDate?: string;
  customMessage?: string;
  isChristmasOffer?: boolean;
}
