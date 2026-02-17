import { Request, Response } from 'express';
import { Product, Review } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 12,
    category,
    minPrice,
    maxPrice,
    sort = '-createdAt',
    search,
    isNew,
    isTrending,
    isFeatured,
    tags
  } = req.query;

  const query: any = { isActive: true };

  if (category) query.category = category;
  if (isNew === 'true') query.isNew = true;
  if (isTrending === 'true') query.isTrending = true;
  if (isFeatured === 'true') query.isFeatured = true;
  if (tags) query.tags = { $in: (tags as string).split(',') };

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (search) {
    query.$text = { $search: search as string };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const products = await Product.find(query)
    .sort(sort as string)
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

// @desc    Get single product
// @route   GET /api/products/:slug
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findOne({ 
    slug: req.params.slug,
    isActive: true 
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Get reviews for this product
  const reviews = await Review.find({ product: product._id, isActive: true })
    .populate('user', 'name avatar')
    .sort('-createdAt')
    .limit(5);

  res.json({
    success: true,
    product,
    reviews
  });
});

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
});

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.json({
    success: true,
    product
  });
});

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const products = await Product.find({
    category: req.params.category,
    isActive: true
  })
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await Product.countDocuments({
    category: req.params.category,
    isActive: true
  });

  res.json({
    success: true,
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true
  })
    .limit(4)
    .lean();

  res.json({
    success: true,
    products: relatedProducts
  });
});