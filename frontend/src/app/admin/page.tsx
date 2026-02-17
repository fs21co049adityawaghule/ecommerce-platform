'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import Link from 'next/link';
import { FiHome, FiBox, FiUsers, FiShoppingCart, FiStar, FiTag, FiLogOut, FiDollarSign } from 'react-icons/fi';
import { formatPrice } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast.error('Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user, router]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'products', label: 'Products', icon: FiBox },
    { id: 'orders', label: 'Orders', icon: FiShoppingCart },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'reviews', label: 'Reviews', icon: FiStar },
    { id: 'coupons', label: 'Coupons', icon: FiTag },
  ];

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
          <div className="p-6">
            <Link href="/" className="text-2xl font-bold text-gradient">
              ShopEase
            </Link>
            <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
          </div>
          
          <nav className="mt-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                  activeTab === item.id ? 'bg-primary-600' : 'hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <button
              onClick={logout}
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 capitalize">{activeTab}</h1>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Welcome, {user.name}</span>
                </div>
              </div>

              {/* Stats Cards */}
              {activeTab === 'dashboard' && stats && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm">Total Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.stats.totalRevenue)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <FiDollarSign className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.stats.totalOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FiShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm">Total Users</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.stats.totalUsers}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FiUsers className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm">Products</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.stats.totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FiBox className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    </div>
                    <div className="divide-y">
                      {stats.recentOrders?.slice(0, 5).map((order: any) => (
                        <div key={order._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                          <div>
                            <p className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</p>
                            <p className="text-sm text-gray-600">{order.user?.name || 'Guest'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{formatPrice(order.priceBreakdown?.total || 0)}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab !== 'dashboard' && (
                <div className="bg-white rounded-xl p-12 text-center">
                  <p className="text-gray-600">This section is under development.</p>
                  <p className="text-gray-400 text-sm mt-2">Full functionality coming soon!</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}