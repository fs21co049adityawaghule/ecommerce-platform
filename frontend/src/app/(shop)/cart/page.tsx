'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/utils/helpers';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart, applyCoupon, removeCoupon, applyCoins, isLoading } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [coinsToUse, setCoinsToUse] = useState(0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    try {
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (error) {
      // Error handled in context
    }
  };

  const handleApplyCoins = async () => {
    if (coinsToUse <= 0) {
      toast.error('Please enter coins amount');
      return;
    }
    try {
      await applyCoins(coinsToUse);
    } catch (error) {
      // Error handled in context
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {item.product.name}
                    </Link>
                    
                    <div className="text-sm text-gray-500 mt-1">
                      {item.color && <span>Color: {item.color}</span>}
                      {item.color && item.size && <span> | </span>}
                      {item.size && <span>Size: {item.size}</span>}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => item._id && updateCartItem(item._id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                          disabled={isLoading}
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => item._id && updateCartItem(item._id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                          disabled={isLoading}
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => item._id && removeFromCart(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          disabled={isLoading}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.summary.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{cart.summary.shipping === 0 ? 'FREE' : formatPrice(cart.summary.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(cart.summary.tax)}</span>
                </div>
                
                {cart.summary.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(cart.summary.couponDiscount)}</span>
                  </div>
                )}
                
                {cart.summary.coinsDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coins Discount</span>
                    <span>-{formatPrice(cart.summary.coinsDiscount)}</span>
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(cart.summary.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Apply Coupon</h3>
              {cart.couponCode ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-mono font-bold text-green-700">{cart.couponCode}</span>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 input"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Coins */}
            {user && user.coins > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Use Coins</h3>
                <p className="text-sm text-gray-600 mb-4">You have {user.coins} coins (₹{user.coins})</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={coinsToUse}
                    onChange={(e) => setCoinsToUse(Math.min(Number(e.target.value), user.coins))}
                    max={user.coins}
                    placeholder="Coins to use"
                    className="flex-1 input"
                  />
                  <button
                    onClick={handleApplyCoins}
                    className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <FiArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/shop"
              className="w-full btn-outline text-center block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}