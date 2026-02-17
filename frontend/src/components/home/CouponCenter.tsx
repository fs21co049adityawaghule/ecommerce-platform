'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const sampleCoupons = [
  { code: 'WELCOME10', discount: '10% OFF', description: 'On your first order', minOrder: 'Min. ₹1000' },
  { code: 'SAVE200', discount: '₹200 OFF', description: 'Flat discount', minOrder: 'Min. ₹2000' },
  { code: 'FESTIVE25', discount: '25% OFF', description: 'Festive special', minOrder: 'Min. ₹3000' },
  { code: 'FREESHIP', discount: 'FREE', description: 'Free shipping', minOrder: 'On all orders' },
];

export default function CouponCenter() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="section bg-primary-600">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Coupon Code Center</h2>
          <p className="text-primary-100 max-w-2xl mx-auto">
            Unlock amazing discounts with our exclusive coupon codes. Save more on every purchase!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleCoupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-primary-600">{coupon.discount}</span>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎟️</span>
                </div>
              </div>
              <p className="text-gray-600 mb-1">{coupon.description}</p>
              <p className="text-sm text-gray-400 mb-4">{coupon.minOrder}</p>
              
              <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                <code className="font-mono font-bold text-gray-800">{coupon.code}</code>
                <button
                  onClick={() => copyToClipboard(coupon.code)}
                  className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  {copiedCode === coupon.code ? (
                    <FiCheck className="w-5 h-5" />
                  ) : (
                    <FiCopy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-primary-100 text-lg">
            Have a referral code? Use it at checkout for additional savings!
          </p>
        </div>
      </div>
    </section>
  );
}