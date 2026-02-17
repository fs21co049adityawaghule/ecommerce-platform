import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Order, Cart, Product, User, Coupon } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia'
});

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: any, res: Response) => {
  const { 
    shippingAddress, 
    contactNumber,
    paymentMethod 
  } = req.body;

  // Get cart
  const cart = await Cart.findOne({ user: req.user.id })
    .populate({
      path: 'items.product',
      select: 'name price images inventory'
    });

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  // Validate stock
  for (const item of cart.items as any) {
    const inventoryItem = item.product.inventory.find(
      (inv: any) => (!item.color || inv.color === item.color) && (!item.size || inv.size === item.size)
    );

    if (!inventoryItem || inventoryItem.quantity < item.quantity) {
      throw new AppError(`${item.product.name} is out of stock`, 400);
    }
  }

  // Calculate totals
  let subtotal = 0;
  cart.items.forEach((item: any) => {
    subtotal += item.product.price * item.quantity;
  });

  // Apply coupon
  let couponDiscount = 0;
  if (cart.couponCode) {
    const coupon = await Coupon.findOne({ code: cart.couponCode, isActive: true });
    if (coupon) {
      if (coupon.discountType === 'percentage') {
        couponDiscount = subtotal * (coupon.discountValue / 100);
        if (coupon.maxDiscount) {
          couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
        }
      } else {
        couponDiscount = coupon.discountValue;
      }
    }
  }

  // Apply coins
  const coinsDiscount = Math.min(cart.coinsToUse, subtotal - couponDiscount, req.user.coins);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = subtotal * 0.18;
  const total = Math.max(0, subtotal + shipping + tax - couponDiscount - coinsDiscount);

  // Create Stripe payment intent
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        userId: req.user.id.toString(),
        cartId: cart._id.toString()
      }
    });
  } catch (error: any) {
    throw new AppError('Payment processing failed: ' + error.message, 400);
  }

  // Create order
  const order = await Order.create({
    user: req.user.id,
    items: cart.items.map((item: any) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0],
      price: item.product.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size
    })),
    shippingAddress,
    contactNumber,
    paymentInfo: {
      id: paymentIntent.id,
      status: 'pending',
      method: paymentMethod,
      amount: total
    },
    priceBreakdown: {
      subtotal,
      shipping,
      tax,
      discount: 0,
      couponDiscount,
      coinsDiscount,
      total
    },
    couponCode: cart.couponCode,
    coinsUsed: coinsDiscount,
    orderStatus: 'pending'
  });

  res.status(201).json({
    success: true,
    order,
    clientSecret: paymentIntent.client_secret
  });
});

// @desc    Confirm payment and update order
// @route   POST /api/orders/:id/confirm
// @access  Private
export const confirmPayment = asyncHandler(async (req: any, res: Response) => {
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Verify payment with Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    throw new AppError('Payment not completed', 400);
  }

  // Update order status
  order.paymentInfo.status = 'completed';
  order.paymentInfo.paidAt = new Date();
  order.orderStatus = 'processing';

  // Deduct coins from user
  if (order.coinsUsed > 0) {
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { coins: -order.coinsUsed }
    });
  }

  // Update coupon usage
  if (order.couponCode) {
    await Coupon.findOneAndUpdate(
      { code: order.couponCode },
      { 
        $inc: { usageCount: 1 },
        $push: { usedBy: req.user.id }
      }
    );

    // Add coins to coupon owner if it's a referral
    const coupon = await Coupon.findOne({ code: order.couponCode, type: 'referral' });
    if (coupon && coupon.owner) {
      const coinsToAdd = Math.floor(order.priceBreakdown.subtotal * 0.05); // 5% of order value
      await User.findByIdAndUpdate(coupon.owner, {
        $inc: { coins: coinsToAdd }
      });
    }
  }

  // Update inventory and sold count
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { soldCount: item.quantity }
    });

    // Update specific inventory
    await Product.findOneAndUpdate(
      { _id: item.product, 'inventory.color': item.color, 'inventory.size': item.size },
      { $inc: { 'inventory.$.quantity': -item.quantity } }
    );
  }

  // Clear cart
  await Cart.findOneAndDelete({ user: req.user.id });

  await order.save();

  res.json({
    success: true,
    message: 'Payment confirmed',
    order
  });
});

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
export const getOrders = asyncHandler(async (req: any, res: Response) => {
  const { page = 1, limit = 10, status } = req.query;

  const query: any = { user: req.user.id };
  if (status) query.orderStatus = status;

  const skip = (Number(page) - 1) * Number(limit);

  const orders = await Order.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('items.product', 'name images slug');

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req: any, res: Response) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate('items.product', 'name images slug');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({
    success: true,
    order
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, status } = req.query;

  const query: any = {};
  if (status) query.orderStatus = status;

  const skip = (Number(page) - 1) * Number(limit);

  const orders = await Order.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('user', 'name email username')
    .populate('items.product', 'name images');

  const total = await Order.countDocuments(query);

  // Calculate stats
  const stats = await Order.aggregate([
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

  res.json({
    success: true,
    orders,
    stats: stats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderStatus, shippingStatus, trackingNumber, trackingUrl } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { 
      orderStatus,
      shippingStatus,
      trackingNumber,
      trackingUrl,
      ...(orderStatus === 'delivered' && { deliveredAt: new Date() })
    },
    { new: true }
  );

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({
    success: true,
    order
  });
});