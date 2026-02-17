import Link from 'next/link';
import { FiGift, FiTrendingUp, FiAward, FiUsers } from 'react-icons/fi';

const rewards = [
  {
    icon: FiTrendingUp,
    title: 'Earn Coins',
    description: 'Get 100 coins for every successful referral',
    color: 'bg-green-500',
  },
  {
    icon: FiGift,
    title: 'Redeem Rewards',
    description: 'Convert coins to discounts or exclusive gifts',
    color: 'bg-purple-500',
  },
  {
    icon: FiUsers,
    title: 'Refer Friends',
    description: 'Share your code and earn together',
    color: 'bg-blue-500',
  },
  {
    icon: FiAward,
    title: 'Special Milestones',
    description: 'Unlock premium rewards at 10, 25, 50 referrals',
    color: 'bg-yellow-500',
  },
];

export default function CoinsRewards() {
  return (
    <section className="section bg-gradient-to-br from-secondary-900 to-secondary-800 text-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-2 bg-secondary-700 text-secondary-200 rounded-full text-sm font-semibold mb-6">
              Rewards Program
            </span>
            <h2 className="text-4xl font-bold mb-6">
              Earn Coins &<br />
              <span className="text-secondary-300">Unlock Rewards</span>
            </h2>
            <p className="text-secondary-200 text-lg mb-8">
              Join our loyalty program and start earning coins with every purchase and referral. 
              The more you shop and share, the more rewards you unlock!
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">🪙</span>
                </div>
                <div>
                  <p className="font-semibold">1 Coin = ₹1 Discount</p>
                  <p className="text-secondary-300 text-sm">Redeem anytime during checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">🎁</span>
                </div>
                <div>
                  <p className="font-semibold">Special Milestone Rewards</p>
                  <p className="text-secondary-300 text-sm">Get exclusive gifts at 10, 25, 50 referrals</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/referral"
                className="inline-flex items-center px-8 py-4 bg-white text-secondary-900 rounded-full font-bold hover:bg-secondary-100 transition-colors"
              >
                Start Earning Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.title}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors"
              >
                <div className={`w-14 h-14 ${reward.color} rounded-xl flex items-center justify-center mb-4`}>
                  <reward.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{reward.title}</h3>
                <p className="text-secondary-200 text-sm">{reward.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}