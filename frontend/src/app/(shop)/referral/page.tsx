'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { FiCopy, FiUsers, FiGift, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ReferralPage() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await api.get('/coupons/my-referral');
        setReferralCode(response.data.coupon.code);
        setReferralCount(response.data.stats.totalReferrals);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      }
    };

    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600">Sign in to access your referral program</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refer & Earn</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your unique referral code with friends and earn 100 coins for each successful referral!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-7 h-7 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{referralCount}</p>
            <p className="text-gray-600">Total Referrals</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🪙</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{referralCount * 100}</p>
            <p className="text-gray-600">Coins Earned</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiGift className="w-7 h-7 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{user.coins}</p>
            <p className="text-gray-600">Current Balance</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrendingUp className="w-7 h-7 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">10</p>
            <p className="text-gray-600">Next Milestone</p>
          </div>
        </div>

        {/* Referral Code */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Referral Code</h2>
          <p className="text-gray-600 mb-6">
            Share this code with friends. They get 10% off, you get 100 coins!
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-gray-100 rounded-lg px-6 py-4">
              <code className="text-2xl font-mono font-bold text-gray-900">{referralCode}</code>
            </div>
            <button
              onClick={copyCode}
              className="p-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {copied ? 'Copied!' : <FiCopy className="w-6 h-6" />}
            </button>
          </div>

          <div className="bg-primary-50 rounded-xl p-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">How it works:</h3>
            <ol className="space-y-2 text-gray-600">
              <li>1. Share your referral code with friends</li>
              <li>2. They get 10% off on their first order (min. ₹500)</li>
              <li>3. You earn 100 coins when they complete their first purchase</li>
              <li>4. Earn 5% of their order value as bonus coins</li>
              <li>5. Reach milestones (10, 25, 50) for special rewards!</li>
            </ol>
          </div>
        </div>

        {/* Milestones */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Milestone Rewards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl border-2 ${referralCount >= 10 ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">10 Referrals</h3>
              <p className="text-gray-600">Premium Membership Free for 1 Month</p>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${Math.min((referralCount / 10) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{referralCount}/10 completed</p>
            </div>
            <div className={`p-6 rounded-xl border-2 ${referralCount >= 25 ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">25 Referrals</h3>
              <p className="text-gray-600">₹500 Store Credit</p>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${Math.min((referralCount / 25) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{referralCount}/25 completed</p>
            </div>
            <div className={`p-6 rounded-xl border-2 ${referralCount >= 50 ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">50 Referrals</h3>
              <p className="text-gray-600">₹1500 Store Credit + Free Gift</p>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${Math.min((referralCount / 50) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{referralCount}/50 completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}