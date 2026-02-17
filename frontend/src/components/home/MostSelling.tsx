'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/utils/api';
import { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';

const subcategories = [
  { id: 'all', label: 'All Products' },
  { id: 'electronics', label: 'Best in Electronics' },
  { id: 'fashion', label: 'Fashion Favorites' },
  { id: 'home', label: 'Home Essentials' },
  { id: 'sports', label: 'Sports & Fitness' },
  { id: 'books', label: 'Bestselling Books' },
];

export default function MostSelling() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        params.append('limit', '5');
        params.append('sort', '-soldCount');
        if (activeCategory !== 'all') {
          params.append('category', activeCategory);
        }

        const response = await api.get(`/products?${params.toString()}`);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching most selling:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  return (
    <section className="section bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Most Selling Products</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our customers&apos; favorites - the products everyone loves and buys again and again
          </p>
        </div>

        {/* Subcategory Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveCategory(sub.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === sub.id
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-700 rounded-xl animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product, index) => (
              <Link
                key={product._id}
                href={`/product/${product.slug}`}
                className="group relative bg-white rounded-xl overflow-hidden transition-transform hover:-translate-y-1"
              >
                {/* Rank Badge */}
                <div className="absolute top-3 left-3 z-10 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  #{index + 1}
                </div>

                <div className="aspect-[3/4] relative">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {/* Sold Count Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-semibold">
                      {product.soldCount.toLocaleString()} sold
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(product.price)}
                    </span>
                    <div className="flex items-center text-yellow-500 text-sm">
                      ★ {product.rating}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/shop?sort=-soldCount"
            className="inline-flex items-center px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Explore Bestsellers
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}