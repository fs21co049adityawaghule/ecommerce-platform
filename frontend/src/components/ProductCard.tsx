import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/utils/helpers';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useUIStore } from '@/store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

export default function ProductCard({ product, showBadge = true }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { setAuthModalOpen, setAuthModalMode } = useUIStore();

  const discount = calculateDiscount(product.price, product.compareAtPrice);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    try {
      await addToCart(product._id, 1);
    } catch (error) {
      // Error handled in cart context
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    try {
      await addToCart(product._id, 1);
      window.location.href = '/cart';
    } catch (error) {
      // Error handled in cart context
    }
  };

  return (
    <div className="card group">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-t-xl">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        {showBadge && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                NEW
              </span>
            )}
            {discount > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                -{discount}%
              </span>
            )}
            {product.isTrending && (
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                TRENDING
              </span>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <FiHeart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center text-yellow-400">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <FiShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}