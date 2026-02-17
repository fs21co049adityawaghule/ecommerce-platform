'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/utils/helpers';
import { FiPackage, FiShoppingBag, FiHeart, FiUser, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to view your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">Coins Balance</p>
                <p className="text-2xl font-bold text-primary-600">{user.coins} 🪙</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link href="/orders" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
                <FiPackage className="w-5 h-5 text-primary-600" />
                <span className="font-medium">My Orders</span>
              </Link>
              <Link href="/favorites" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
                <FiHeart className="w-5 h-5 text-primary-600" />
                <span className="font-medium">Favorites</span>
              </Link>
              <Link href="/referral" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
                <FiShoppingBag className="w-5 h-5 text-primary-600" />
                <span className="font-medium">Refer & Earn</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:bg-red-50 text-red-600"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              </div>
              
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="divide-y">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatPrice(order.priceBreakdown.total)}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                  <Link href="/shop" className="text-primary-600 font-semibold mt-2 inline-block">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}