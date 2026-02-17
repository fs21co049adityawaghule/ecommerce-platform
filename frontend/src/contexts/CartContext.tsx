'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart, CartItem } from '@/types';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, color?: string, size?: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  applyCoins: (coins: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await api.get('/cart');
      setCart(response.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId: string, quantity: number, color?: string, size?: string) => {
    try {
      setIsLoading(true);
      await api.post('/cart/items', { productId, quantity, color, size });
      await fetchCart();
      toast.success('Added to cart');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      setIsLoading(true);
      await api.put(`/cart/items/${itemId}`, { quantity });
      await fetchCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setIsLoading(true);
      await api.delete(`/cart/items/${itemId}`);
      await fetchCart();
      toast.success('Removed from cart');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      await api.post('/cart/coupon', { couponCode: code });
      await fetchCart();
      toast.success('Coupon applied successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
      throw error;
    }
  };

  const removeCoupon = async () => {
    try {
      await api.delete('/cart/coupon');
      await fetchCart();
      toast.success('Coupon removed');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove coupon');
    }
  };

  const applyCoins = async (coins: number) => {
    try {
      await api.post('/cart/coins', { coins });
      await fetchCart();
      toast.success(`${coins} coins applied`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to apply coins');
      throw error;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isLoading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        applyCoins,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};