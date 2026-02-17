import { Request, Response } from 'express';
import { User } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user.id)
    .populate('favorites', 'name price images slug rating')
    .populate('referrals', 'name username createdAt');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check for unclaimed rewards
  const unclaimedRewards = user.referralRewards.filter(
    r => !r.claimed && user.referrals.length >= r.milestone
  );

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      contactNumber: user.contactNumber,
      avatar: user.avatar,
      addresses: user.addresses,
      coins: user.coins,
      referralCode: user.referralCode,
      referralCount: user.referrals.length,
      referralRewards: user.referralRewards,
      unclaimedRewards,
      favorites: user.favorites,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// @desc    Get favorites
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user.id)
    .populate('favorites', 'name price images slug rating reviewCount');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    favorites: user.favorites
  });
});

// @desc    Add to favorites
// @route   POST /api/users/favorites/:productId
// @access  Private
export const addToFavorites = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const productId = req.params.productId;

  if (user.favorites.includes(productId)) {
    throw new AppError('Product already in favorites', 400);
  }

  user.favorites.push(productId);
  await user.save();

  res.json({
    success: true,
    message: 'Added to favorites',
    favorites: await User.findById(req.user.id).populate('favorites', 'name price images slug rating')
  });
});

// @desc    Remove from favorites
// @route   DELETE /api/users/favorites/:productId
// @access  Private
export const removeFromFavorites = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.favorites = user.favorites.filter(
    (id: any) => id.toString() !== req.params.productId
  );
  
  await user.save();

  res.json({
    success: true,
    message: 'Removed from favorites',
    favorites: await User.findById(req.user.id).populate('favorites', 'name price images slug rating')
  });
});

// @desc    Get all users (Admin)
// @route   GET /api/users/admin/all
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, search } = req.query;

  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const users = await User.find(query)
    .select('-password')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

// @desc    Get single user (Admin)
// @route   GET /api/users/admin/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('referrals', 'name username email createdAt')
    .populate('favorites', 'name price images');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    user
  });
});

// @desc    Update user (Admin)
// @route   PUT /api/users/admin/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { role, isActive, coins } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role, isActive, coins },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    user
  });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/users/admin/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    message: 'User deactivated successfully'
  });
});

// @desc    Redeem coins for discount
// @route   POST /api/users/redeem-coins
// @access  Private
export const redeemCoins = asyncHandler(async (req: any, res: Response) => {
  const { coins, type } = req.body;

  if (coins > req.user.coins) {
    throw new AppError('Insufficient coins', 400);
  }

  if (coins < 100) {
    throw new AppError('Minimum 100 coins required to redeem', 400);
  }

  let message = '';
  
  if (type === 'discount') {
    // 100 coins = ₹10 discount
    const discountValue = Math.floor(coins / 100) * 10;
    message = `Redeemed ${coins} coins for ₹${discountValue} discount`;
  } else if (type === 'gift') {
    message = `Redeemed ${coins} coins for a special gift`;
  }

  // Deduct coins
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { coins: -coins }
  });

  res.json({
    success: true,
    message,
    coinsRedeemed: coins,
    remainingCoins: req.user.coins - coins
  });
});