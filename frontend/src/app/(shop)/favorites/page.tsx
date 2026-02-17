'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import api from '@/utils/api';
import { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { FiHeart, FiShoppingCart, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/users/favorites');
        setFavorites(response.data.favorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const removeFavorite = async (productId: string) => {
    try {
      await api.delete(`/users/favorites/${productId}`);
      setFavorites(favorites.filter(f => f._id !== productId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const moveToCart = async (product: Product) => {
    try {
      await addToCart(product._id, 1);
      await removeFavorite(product._id);
    } catch (error) {
      // Error handled in cart context
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600">Sign in to view your favorites</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product._id} className="card group">
                <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-t-xl">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>

                <div className="p-4">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center text-yellow-400 text-sm">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({product.reviewCount})</span>
                  </div>

                  <p className="text-xl font-bold text-gray-900 mb-4">{formatPrice(product.price)}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => moveToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      Move to Cart
                    </button>
                    <button
                      onClick={() => removeFavorite(product._id)}
                      className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">Start adding products you love to your favorites list.</p>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
              <FiShoppingBag className="w-5 h-5" />
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}