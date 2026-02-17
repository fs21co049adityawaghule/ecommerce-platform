const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      coupon,
      coinsRedeemed
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      coupon,
      coinsRedeemed
    });

    if (coinsRedeemed > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { coins: -coinsRedeemed }
      });
    }

    const orderPopulated = await Order.findById(order._id).populate('orderItems.product');
    res.status(201).json(orderPopulated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStripeSession = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode, coinsRedeemed } = req.body;
    
    let discountAmount = 0;
    let couponData = null;
    
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (coupon) {
        couponData = coupon;
      }
    }
    
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image]
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        userId: req.user._id.toString(),
        shippingAddress: JSON.stringify(shippingAddress),
        couponCode: couponCode || '',
        coinsRedeemed: coinsRedeemed || 0
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      const userId = session.metadata.userId;
      const shippingAddress = JSON.parse(session.metadata.shippingAddress);
      const couponCode = session.metadata.couponCode;
      const coinsRedeemed = parseInt(session.metadata.coinsRedeemed) || 0;

      const cart = await Cart.findOne({ user: userId }).populate('items.product');
      
      if (!cart || cart.items.length === 0) return;

      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0],
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      }));

      const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const taxPrice = itemsPrice * 0.08;
      
      let discount = 0;
      let couponData = null;
      
      if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode });
        if (coupon) {
          if (coupon.discountType === 'percentage') {
            discount = (itemsPrice * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = coupon.discountValue;
          }
          couponData = { code: coupon.code, discount };
          coupon.usageCount += 1;
          await coupon.save();
        }
      }

      const coinsValue = coinsRedeemed * 0.01;
      const totalPrice = itemsPrice + shippingPrice + taxPrice - discount - coinsValue;

      await Order.create({
        user: userId,
        orderItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discount,
        coinsRedeemed,
        totalPrice,
        coupon: couponData,
        paymentInfo: {
          id: session.payment_intent,
          status: 'completed',
          method: 'card'
        }
      });

      if (coinsRedeemed > 0) {
        await User.findByIdAndUpdate(userId, { $inc: { coins: -coinsRedeemed } });
      }

      await User.findByIdAndUpdate(userId, { $inc: { coins: Math.floor(totalPrice) } });

      for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity, sold: item.quantity }
        });
      }

      cart.items = [];
      cart.coupon = null;
      await cart.save();

    } catch (error) {
      console.error('Order creation error:', error);
    }
  }

  res.json({ received: true });
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'delivered') {
      order.deliveredAt = Date.now();
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('orderItems.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    const recentOrders = await Order.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};