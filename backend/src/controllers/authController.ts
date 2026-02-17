import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { User, Coupon } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// Generate JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallbacksecret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, contactNumber, username, email, password, referralCode } = req.body;

  // Validation
  if (!name || !contactNumber || !username || !email || !password) {
    throw new AppError('Please provide all required fields', 400);
  }

  if (!validator.isEmail(email)) {
    throw new AppError('Please provide a valid email', 400);
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  // Check if user exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new AppError('User with this email or username already exists', 400);
  }

  // Check referral code if provided
  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (referrer) {
      referredBy = referrer._id;
      
      // Add 100 coins to referrer
      referrer.coins += 100;
      await referrer.save();
    }
  }

  // Create user
  const user = await User.create({
    name,
    contactNumber,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    referredBy,
    referralRewards: [
      { milestone: 10, claimed: false, reward: 'Premium Membership Free for 1 Month' },
      { milestone: 25, claimed: false, reward: '₹500 Store Credit' },
      { milestone: 50, claimed: false, reward: '₹1500 Store Credit + Free Gift' }
    ]
  });

  // Update referrer's referrals array
  if (referredBy) {
    await User.findByIdAndUpdate(referredBy, {
      $push: { referrals: user._id }
    });
  }

  // Create referral coupon for new user
  await Coupon.create({
    code: user.referralCode,
    type: 'referral',
    discountType: 'percentage',
    discountValue: 10,
    owner: user._id,
    minOrderValue: 500,
    maxDiscount: 200,
    description: `Referral coupon for ${user.name}. Get 10% off on orders above ₹500.`
  });

  // Generate token
  const token = generateToken(user._id.toString());

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      coins: user.coins,
      referralCode: user.referralCode,
      favorites: user.favorites
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new AppError('Please provide username and password', 400);
  }

  // Find user and include password
  const user = await User.findOne({
    $or: [
      { username: username.toLowerCase() },
      { email: username.toLowerCase() }
    ]
  }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 401);
  }

  // Generate token
  const token = generateToken(user._id.toString());

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      coins: user.coins,
      referralCode: user.referralCode,
      favorites: user.favorites,
      referralRewards: user.referralRewards
    }
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user.id)
    .populate('favorites', 'name price images slug')
    .populate('referrals', 'name username createdAt');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check for unclaimed rewards
  const unclaimedRewards = user.referralRewards.filter(r => !r.claimed && user.referrals.length >= r.milestone);

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      contactNumber: user.contactNumber,
      role: user.role,
      avatar: user.avatar,
      addresses: user.addresses,
      coins: user.coins,
      referralCode: user.referralCode,
      referrals: user.referrals,
      referralCount: user.referrals.length,
      favorites: user.favorites,
      referralRewards: user.referralRewards,
      unclaimedRewards: unclaimedRewards.length,
      createdAt: user.createdAt
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: any, res: Response) => {
  const { name, contactNumber, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, contactNumber, avatar },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      contactNumber: user.contactNumber,
      avatar: user.avatar
    }
  });
});

// @desc    Add address
// @route   POST /api/auth/address
// @access  Private
export const addAddress = asyncHandler(async (req: any, res: Response) => {
  const { street, city, state, zipCode, country, isDefault } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const newAddress = {
    street,
    city,
    state,
    zipCode,
    country: country || 'India',
    isDefault: isDefault || false
  };

  // If this address is default, unset other defaults
  if (isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  user.addresses.push(newAddress);
  await user.save();

  res.json({
    success: true,
    addresses: user.addresses
  });
});

// @desc    Delete address
// @route   DELETE /api/auth/address/:index
// @access  Private
export const deleteAddress = asyncHandler(async (req: any, res: Response) => {
  const index = parseInt(req.params.index);

  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (index < 0 || index >= user.addresses.length) {
    throw new AppError('Address not found', 404);
  }

  user.addresses.splice(index, 1);
  await user.save();

  res.json({
    success: true,
    addresses: user.addresses
  });
});

// @desc    Claim referral reward
// @route   POST /api/auth/claim-reward/:milestone
// @access  Private
export const claimReward = asyncHandler(async (req: any, res: Response) => {
  const { milestone } = req.params;
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const reward = user.referralRewards.find(r => r.milestone === parseInt(milestone));

  if (!reward) {
    throw new AppError('Reward not found', 404);
  }

  if (reward.claimed) {
    throw new AppError('Reward already claimed', 400);
  }

  if (user.referrals.length < reward.milestone) {
    throw new AppError(`You need ${reward.milestone} referrals to claim this reward`, 400);
  }

  reward.claimed = true;
  await user.save();

  res.json({
    success: true,
    message: `Successfully claimed: ${reward.reward}`,
    reward
  });
});