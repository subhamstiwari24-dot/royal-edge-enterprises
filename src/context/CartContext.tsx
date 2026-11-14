import React, { useState, useEffect } from 'react';
import type { PublicProduct } from '../types';
import { getProductPricing } from '../utils/pricing';
import { CartContext, type CartItem } from './CartContextInstance';

const CART_STORAGE_KEY = 'royal_edge_cart_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not persist cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product: PublicProduct, quantity = 1, selectedWidth?: string) => {
    const pricing = getProductPricing(product);
    const moq = pricing.moq;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedWidth === selectedWidth
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        const isWholesale = newQty >= moq;
        const unitPrice = isWholesale ? pricing.wholesalePrice : pricing.retailPrice;

        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
          unitPrice,
          isWholesale,
        };
        return next;
      }

      const isWholesale = quantity >= moq;
      const unitPrice = isWholesale ? pricing.wholesalePrice : pricing.retailPrice;

      return [
        ...prev,
        {
          product,
          quantity,
          unitPrice,
          retailPrice: pricing.retailPrice,
          wholesalePrice: pricing.wholesalePrice,
          isWholesale,
          selectedWidth,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const pricing = getProductPricing(item.product);
          const isWholesale = quantity >= pricing.moq;
          const unitPrice = isWholesale ? pricing.wholesalePrice : pricing.retailPrice;
          return {
            ...item,
            quantity,
            unitPrice,
            isWholesale,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const totalWholesaleSavings = items.reduce((sum, item) => {
    if (item.isWholesale) {
      const savingsPerUnit = item.retailPrice - item.wholesalePrice;
      return sum + savingsPerUnit * item.quantity;
    }
    return sum;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalAmount,
        totalWholesaleSavings,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        getProductPricing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
