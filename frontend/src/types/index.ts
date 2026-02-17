export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  contactNumber: string;
  role: 'user' | 'admin';
  avatar?: string;
  addresses: Address[];
  coins: number;
  referralCode: string;
  referralCount: number;
  favorites: string[];
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  colors: Color[];
  sizes: string[];
  inventory: InventoryItem[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  isNew: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  slug: string;
  createdAt: string;
}

export interface Color {
  name: string;
  hex: string;
  images?: string[];
}

export interface InventoryItem {
  color?: string;
  size?: string;
  quantity: number;
  sku: string;
}

export interface CartItem {
  _id?: string;
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  coinsToUse: number;
  summary: CartSummary;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  couponDiscount: number;
  coinsDiscount: number;
  total: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: Address;
  contactNumber: string;
  paymentInfo: {
    id: string;
    status: string;
    method: string;
    amount: number;
    paidAt?: string;
  };
  priceBreakdown: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    couponDiscount: number;
    coinsDiscount: number;
    total: number;
  };
  couponCode?: string;
  coinsUsed: number;
  orderStatus: string;
  shippingStatus: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface OrderItem {
  product: Product | string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Review {
  _id: string;
  user: {
    name: string;
    avatar?: string;
  };
  product: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpful: number;
  reply?: {
    comment: string;
    createdAt: string;
  };
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  type: 'referral' | 'promotional' | 'discount';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}