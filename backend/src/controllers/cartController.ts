import { Request, Response } from 'express';
import { Cart, Product, Coupon } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req: any, res: Response) => {
  const cart = await Cart.findOne({ user: req.user.id })
    .populate({
      path: 'items.product',
      select: 'name price images slug inventory isActive'
    });

  if (!cart) {
    return res.json({
      success: true,
      cart: {
        items: [],
        couponCode: null,
        coinsToUse: 0
      }
    });
  }

  // Calculate totals
  let subtotal = 0;
  const validItems = cart.items.filter((item: any) => item.product && item.product.isActive);
  
  validItems.forEach((item: any) => {
    subtotal += item.product.price * item.quantity;
  });

  // Check coupon
  let couponDiscount = 0;
  if (cart.couponCode) {
    const coupon = await Coupon.findOne({ 
      code: cart.couponCode,
      isActive: true
    });

    if (coupon && coupon.validFrom <= new Date() && (!coupon.validUntil || coupon.validUntil >= new Date())) {
      if (coupon.minOrderValue && subtotal >= coupon.minOrderValue) {
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
  }

  // Calculate coins discount (1 coin = ₹1)
  const coinsDiscount = Math.min(cart.coinsToUse, subtotal - couponDiscount, req.user.coins);

  const shipping = subtotal > 999 ? 0 : 99;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax - couponDiscount - coinsDiscount;

  res.json({
    success: true,
    cart: {
      items: validItems,
      couponCode: cart.couponCode,
      coinsToUse: cart.coinsToUse,
      summary: {
        subtotal,
        shipping,
        tax,
        couponDiscount,
        coinsDiscount,
        total: Math.max(0, total)
      }
    }
  });
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = asyncHandler(async (req: any, res: Response) => {
  const { productId, quantity = 1, color, size } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new AppError('Product not found', 404);
  }

  // Check inventory
  const inventoryItem = product.inventory.find(
    inv => (!color || inv.color === color) && (!size || inv.size === size)
  );

  if (!inventoryItem || inventoryItem.quantity < quantity) {
    throw new AppError('Product out of stock', 400);
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  // Check if item already in cart
  const itemIndex = cart.items.findIndex(
    item => 
      item.product.toString() === productId &&
      item.color === color &&
      item.size === size
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      color,
      size,
      addedAt: new Date()
    });
  }

  await cart.save();

  res.status(201).json({
    success: true,
    message: 'Item added to cart',
    cart: await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price images slug')
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
export const updateCartItem = asyncHandler(async (req: any, res: Response) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const item = cart.items.find(item => item._id?.toString() === itemId);

  if (!item) {
    throw new AppError('Item not found in cart', 404);
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter(item => item._id?.toString() !== itemId);
  } else {
    // Check inventory
    const product = await Product.findById(item.product);
    const inventoryItem = product?.inventory.find(
      inv => (!item.color || inv.color === item.color) && (!item.size || inv.size === item.size)
    );

    if (!inventoryItem || inventoryItem.quantity < quantity) {
      throw new AppError('Insufficient stock', 400);
    }

    item.quantity = quantity;
  }

  await cart.save();

  res.json({
    success: true,
    message: 'Cart updated',
    cart: await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price images slug')
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
export const removeFromCart = asyncHandler(async (req: any, res: Response) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = cart.items.filter(item => item._id?.toString() !== req.params.itemId);
  await cart.save();

  res.json({
    success: true,
    message: 'Item removed from cart',
    cart: await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price images slug')
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req: any, res: Response) => {
  await Cart.findOneAndDelete({ user: req.user.id });

  res.json({
    success: true,
    message: 'Cart cleared'
  });
});

// @desc    Apply coupon
// @route   POST /api/cart/coupon
// @access  Private
export const applyCoupon = asyncHandler(async (req: any, res: Response) => {
  const { couponCode } = req.body;

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
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

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    throw new AppError('Cart is empty', 400);
  }

  cart.couponCode = couponCode.toUpperCase();
  await cart.save();

  res.json({
    success: true,
    message: 'Coupon applied successfully',
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    }
  });
});

// @desc    Remove coupon
// @route   DELETE /api/cart/coupon
// @access  Private
export const removeCoupon = asyncHandler(async (req: any, res: Response) => {
  const cart = await Cart.findOne({ user: req.user.id });
  
  if (cart) {
    cart.couponCode = undefined;
    await cart.save();
  }

  res.json({
    success: true,
    message: 'Coupon removed'
  });
});

// @desc    Apply coins
// @route   POST /api/cart/coins
// @access  Private
export const applyCoins = asyncHandler(async (req: any, res: Response) => {
  const { coins } = req.body;

  if (coins > req.user.coins) {
    throw new AppError('Insufficient coins', 400);
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    throw new AppError('Cart is empty', 400);
  }

  cart.coinsToUse = coins;
  await cart.save();

  res.json({
    success: true,
    message: `${coins} coins will be applied to your order`,
    coinsToUse: coins
  });
});