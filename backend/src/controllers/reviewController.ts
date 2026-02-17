import { Request, Response } from 'express';
import { Review, Product, Order } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const reviews = await Review.find({
    product: req.params.productId,
    isActive: true
  })
    .populate('user', 'name avatar')
    .sort(sort as string)
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments({
    product: req.params.productId,
    isActive: true
  });

  // Calculate rating distribution
  const ratingStats = await Review.aggregate([
    { $match: { product: new require('mongoose').Types.ObjectId(req.params.productId), isActive: true } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    }
  ]);

  const ratingDistribution = {
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  };
  ratingStats.forEach((stat: any) => {
    ratingDistribution[stat._id as keyof typeof ratingDistribution] = stat.count;
  });

  res.json({
    success: true,
    reviews,
    ratingDistribution,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req: any, res: Response) => {
  const { product, order, rating, title, comment, images } = req.body;

  // Check if user has purchased this product
  const orderExists = await Order.findOne({
    _id: order,
    user: req.user.id,
    'items.product': product,
    orderStatus: 'delivered'
  });

  if (!orderExists) {
    throw new AppError('You can only review products you have purchased and received', 400);
  }

  // Check if already reviewed
  const existingReview = await Review.findOne({
    user: req.user.id,
    product,
    order
  });

  if (existingReview) {
    throw new AppError('You have already reviewed this product for this order', 400);
  }

  const review = await Review.create({
    user: req.user.id,
    product,
    order,
    rating,
    title,
    comment,
    images,
    isVerifiedPurchase: true
  });

  // Update product rating
  const reviews = await Review.find({ product, isActive: true });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Product.findByIdAndUpdate(product, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length
  });

  res.status(201).json({
    success: true,
    review: await review.populate('user', 'name avatar')
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req: any, res: Response) => {
  const { rating, title, comment } = req.body;

  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { rating, title, comment },
    { new: true, runValidators: true }
  );

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  // Update product rating
  const reviews = await Review.find({ product: review.product, isActive: true });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Product.findByIdAndUpdate(review.product, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length
  });

  res.json({
    success: true,
    review: await review.populate('user', 'name avatar')
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req: any, res: Response) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isActive: false },
    { new: true }
  );

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  // Update product rating
  const reviews = await Review.find({ product: review.product, isActive: true });
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  await Product.findByIdAndUpdate(review.product, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length
  });

  res.json({
    success: true,
    message: 'Review deleted successfully'
  });
});

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markHelpful = asyncHandler(async (req: any, res: Response) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  const userIndex = review.helpfulUsers.indexOf(req.user.id);

  if (userIndex > -1) {
    // Remove helpful mark
    review.helpfulUsers.splice(userIndex, 1);
    review.helpful -= 1;
  } else {
    // Add helpful mark
    review.helpfulUsers.push(req.user.id);
    review.helpful += 1;
  }

  await review.save();

  res.json({
    success: true,
    helpful: review.helpful,
    isHelpful: userIndex === -1
  });
});

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const reviews = await Review.find()
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('user', 'name email')
    .populate('product', 'name images');

  const total = await Review.countDocuments();

  res.json({
    success: true,
    reviews,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

// @desc    Reply to review (Admin)
// @route   POST /api/reviews/:id/reply
// @access  Private/Admin
export const replyToReview = asyncHandler(async (req: Request, res: Response) => {
  const { comment } = req.body;

  const review = await Review.findByIdAndUpdate(
    req.params.id,
    {
      reply: {
        comment,
        createdAt: new Date()
      }
    },
    { new: true }
  );

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  res.json({
    success: true,
    review
  });
});

// @desc    Toggle review visibility (Admin)
// @route   PUT /api/reviews/:id/toggle
// @access  Private/Admin
export const toggleReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  review.isActive = !review.isActive;
  await review.save();

  // Update product rating
  const reviews = await Review.find({ product: review.product, isActive: true });
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  await Product.findByIdAndUpdate(review.product, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length
  });

  res.json({
    success: true,
    message: `Review ${review.isActive ? 'activated' : 'deactivated'}`
  });
});