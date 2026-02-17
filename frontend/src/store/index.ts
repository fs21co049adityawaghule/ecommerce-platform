import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Cart, Product } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setLoading: (loading) => set({ isLoading: loading }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface CartState {
  cart: Cart | null;
  itemCount: number;
  setCart: (cart: Cart | null) => void;
  updateItemCount: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  itemCount: 0,
  setCart: (cart) => {
    set({ cart });
    get().updateItemCount();
  },
  updateItemCount: () => {
    const { cart } = get();
    const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    set({ itemCount: count });
  },
  clearCart: () => set({ cart: null, itemCount: 0 }),
}));

interface UIState {
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  setAuthModalOpen: (open: boolean) => void;
  setAuthModalMode: (mode: 'login' | 'register') => void;
  toggleAuthModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isAuthModalOpen: false,
  authModalMode: 'login',
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  setAuthModalMode: (mode) => set({ authModalMode: mode }),
  toggleAuthModal: () =>
    set((state) => ({ isAuthModalOpen: !state.isAuthModalOpen })),
}));