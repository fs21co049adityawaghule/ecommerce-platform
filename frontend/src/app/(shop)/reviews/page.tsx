'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { Review } from '@/types';
import { FiStar, FiThumbsUp, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ReviewsPage() {
  const searchParams = useSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // For demo purposes, we'll fetch from a sample product
        // In production, this would be a dedicated reviews endpoint
        const response = await api.get('/products');
        if (response.data.products.length > 0) {
          const productId = response.data.products[0]._id;
          const reviewsResponse = await api.get(`/reviews/product/${productId}`);
          setReviews(reviewsResponse.data.reviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const markHelpful = async (reviewId: string) => {
    try {
      await api.post(`/reviews/${reviewId}/helpful`);
      toast.success('Marked as helpful!');
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Please sign in to mark helpful');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about their shopping experience
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-primary-600" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                <p className="text-gray-600 mb-4">{review.comment}</p>

                <div className="flex items-center justify-between pt-4 border-t">
                  {review.isVerifiedPurchase && (
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified Purchase
                    </span>
                  )}
                  <button
                    onClick={() => markHelpful(review._id)}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <FiThumbsUp className="w-4 h-4" />
                    <span className="text-sm">Helpful ({review.helpful})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h2>
            <p className="text-gray-600">Be the first to review our products!</p>
          </div>
        )}
      </div>
    </div>
  );
}