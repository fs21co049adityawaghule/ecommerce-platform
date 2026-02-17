import { Request, Response } from 'express';
import { User, Product, Order, Review, Coupon } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  // Get date ranges
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Basic counts
  const totalUsers = await User.countDocuments();
  const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: thisMonth } });
  const totalProducts = await Product.countDocuments({ isActive: true });
  const totalOrders = await Order.countDocuments();
  const totalReviews = await Review.countDocuments();

  // Revenue stats
  const revenueStats = await Order.aggregate([
    { $match: { 'paymentInfo.status': 'completed' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$priceBreakdown.total' },
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: '$priceBreakdown.total' }
      }
    }
  ]);

  // Today's revenue
  const todayRevenue = await Order.aggregate([
    { 
      $match: { 
        'paymentInfo.status': 'completed',
        createdAt: { $gte: today }
      } 
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: '$priceBreakdown.total' },
        orders: { $sum: 1 }
      }
    }
  ]);

  // Monthly revenue (last 6 months)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        'paymentInfo.status': 'completed',
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$priceBreakdown.total' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Recent orders
  const recentOrders = await Order.find()
    .sort('-createdAt')
    .limit(10)
    .populate('user', 'name email')
    .populate('items.product', 'name');

  // Top products
  const topProducts = await Order.aggregate([
    { $match: { 'paymentInfo.status': 'completed' } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' }
  ]);

  // Order status distribution
  const orderStatusStats = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      newUsersThisMonth,
      totalProducts,
      totalOrders,
      totalReviews,
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
      totalCompletedOrders: revenueStats[0]?.totalOrders || 0,
      avgOrderValue: revenueStats[0]?.avgOrderValue || 0,
      todayRevenue: todayRevenue[0]?.revenue || 0,
      todayOrders: todayRevenue[0]?.orders || 0
    },
    monthlyRevenue,
    recentOrders,
    topProducts,
    orderStatusStats
  });
});

// @desc    Get referral analytics
// @route   GET /api/admin/referrals
// @access  Private/Admin
export const getReferralAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const totalReferralCoupons = await Coupon.countDocuments({ type: 'referral' });
  
  const topReferrers = await User.find({ referrals: { $exists: true, $ne: [] } })
    .sort({ referrals: -1 })
    .limit(10)
    .select('name username referralCode referrals coins')
    .lean();

  const referralStats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalReferrals: { $sum: { $size: '$referrals' } },
        totalCoinsGiven: { $sum: '$coins' },
        avgReferralsPerUser: { $avg: { $size: '$referrals' } }
      }
    }
  ]);

  res.json({
    success: true,
    totalReferralCoupons,
    topReferrers,
    stats: referralStats[0] || { totalReferrals: 0, totalCoinsGiven: 0, avgReferralsPerUser: 0 }
  });
});

// @desc    Get coin redemption analytics
// @route   GET /api/admin/coins
// @access  Private/Admin
export const getCoinAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const totalCoinsInSystem = await User.aggregate([
    { $group: { _id: null, total: { $sum: '$coins' } } }
  ]);

  const usersWithCoins = await User.countDocuments({ coins: { $gt: 0 } });

  const coinDistribution = await User.aggregate([
    { $match: { coins: { $gt: 0 } } },
    {
      $bucket: {
        groupBy: '$coins',
        boundaries: [0, 100, 500, 1000, 5000, 10000],
        default: '10000+',
        output: { count: { $sum: 1 } }
      }
    }
  ]);

  res.json({
    success: true,
    totalCoins: totalCoinsInSystem[0]?.total || 0,
    usersWithCoins,
    coinDistribution
  });
});