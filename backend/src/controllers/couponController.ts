import { Request, Response } from 'express';
import { Coupon, User } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// @desc    Get user's referral coupon
// @route   GET /api/coupons/my-referral
// @access  Private
export const getMyReferralCoupon = asyncHandler(async (req: any, res: Response) => {
  const coupon = await Coupon.findOne({
    owner: req.user.id,
    type: 'referral'
  });

  if (!coupon) {
    throw new AppError('Referral coupon not found', 404);
  }

  // Get stats
  const user = await User.findById(req.user.id).populate('referrals', 'name createdAt');

  res.json({
    success: true,
    coupon,
    stats: {
      totalReferrals: user?.referrals.length || 0,
      referrals: user?.referrals || []
    }
  });
});

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, orderValue } = req.body;

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true
  });

  if (!coupon) {
    throw new AppError('Invalid coupon code', 400);
  }

  if (coupon.validFrom > new Date()) {
    throw new AppError('Coupon not yet valid', 400);
  }

  if (coupon.validUntil && coupon.validUntil < new Date()) {
    throw new AppError('Coupon has expired', 400);
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new AppError('Coupon usage limit reached', 400);
  }

  if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
    throw new AppError(`Minimum order value of ₹${coupon.minOrderValue} required`, 400);
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = orderValue * (coupon.discountValue / 100);
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    success: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
      calculatedDiscount: Math.round(discount * 100) / 100
    }
  });
});

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons/admin/all
// @access  Private/Admin
export const getAllCoupons = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, type } = req.query;

  const query: any = {};
  if (type) query.type = type;

  const skip = (Number(page) - 1) * Number(limit);

  const coupons = await Coupon.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('owner', 'name username');

  const total = await Coupon.countDocuments(query);

  res.json({
    success: true,
    coupons,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

// @desc    Create coupon (Admin)
// @route   POST /api/coupons/admin
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.create(req.body);

  res.status(201).json({
    success: true,
    coupon
  });
});

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/admin/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!coupon) {
    throw new AppError('Coupon not found', 404);
  }

  res.json({
    success: true,
    coupon
  });
});

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/admin/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!coupon) {
    throw new AppError('Coupon not found', 404);
  }

  res.json({
    success: true,
    message: 'Coupon deleted successfully'
  });
});