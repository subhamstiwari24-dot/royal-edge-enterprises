import { createContext } from 'react';
import type { PublicProduct } from '../types';

export interface CartItem {
  product: PublicProduct;
  quantity: number;
  unitPrice: number;
  retailPrice: number;
  wholesalePrice: number;
  isWholesale: boolean;
  selectedWidth?: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: PublicProduct, quantity?: number, selectedWidth?: string) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  totalWholesaleSavings: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  getProductPricing: (product: PublicProduct) => { retailPrice: number; wholesalePrice: number; moq: number };
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
