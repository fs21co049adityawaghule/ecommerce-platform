require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const Order = require('./models/Order');

const sampleProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 299.99,
    comparePrice: 349.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    category: 'electronics',
    subcategory: 'audio',
    sizes: [],
    colors: ['Black', 'Silver', 'Blue'],
    stock: 50,
    sku: 'WL-HP-001',
    brand: 'AudioTech',
    weight: 0.5,
    dimensions: { length: 20, width: 18, height: 8 },
    tags: ['wireless', 'headphones', 'audio'],
    isActive: true,
    isFeatured: true,
    averageRating: 4.5,
    numReviews: 12
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt available in multiple colors.',
    price: 29.99,
    comparePrice: 0,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    category: 'clothing',
    subcategory: 'shirts',
    sizes: [{ size: 'S', quantity: 20 }, { size: 'M', quantity: 30 }, { size: 'L', quantity: 25 }, { size: 'XL', quantity: 15 }],
    colors: ['White', 'Black', 'Navy', 'Gray'],
    stock: 90,
    sku: 'CT-TS-001',
    brand: 'EcoWear',
    weight: 0.3,
    dimensions: { length: 30, width: 25, height: 2 },
    tags: ['organic', 'cotton', 't-shirt'],
    isActive: true,
    isFeatured: false,
    averageRating: 4.2,
    numReviews: 8
  },
  {
    name: 'Running Shoes Pro',
    description: 'Professional running shoes with advanced cushioning technology for maximum comfort.',
    price: 129.99,
    comparePrice: 159.99,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    category: 'shoes',
    subcategory: 'running',
    sizes: [{ size: '7', quantity: 15 }, { size: '8', quantity: 20 }, { size: '9', quantity: 18 }, { size: '10', quantity: 12 }],
    colors: ['Red', 'Black', 'White'],
    stock: 65,
    sku: 'RS-PRO-001',
    brand: 'RunFast',
    weight: 0.8,
    dimensions: { length: 35, width: 20, height: 12 },
    tags: ['running', 'shoes', 'sports'],
    isActive: true,
    isFeatured: true,
    averageRating: 4.7,
    numReviews: 25
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Elegant genuine leather crossbody bag with multiple compartments.',
    price: 89.99,
    comparePrice: 0,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'],
    category: 'accessories',
    subcategory: 'bags',
    sizes: [],
    colors: ['Brown', 'Black', 'Tan'],
    stock: 30,
    sku: 'LB-CB-001',
    brand: 'LeatherCraft',
    weight: 0.6,
    dimensions: { length: 25, width: 8, height: 18 },
    tags: ['leather', 'bag', 'accessories'],
    isActive: true,
    isFeatured: false,
    averageRating: 4.3,
    numReviews: 15
  },
  {
    name: 'Smart Watch Series 5',
    description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
    price: 399.99,
    comparePrice: 449.99,
    images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500'],
    category: 'electronics',
    subcategory: 'wearables',
    sizes: [],
    colors: ['Black', 'Silver', 'Gold'],
    stock: 40,
    sku: 'SW-S5-001',
    brand: 'TechGear',
    weight: 0.05,
    dimensions: { length: 4, width: 4, height: 1 },
    tags: ['smartwatch', 'wearable', 'tech'],
    isActive: true,
    isFeatured: true,
    averageRating: 4.6,
    numReviews: 42
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip eco-friendly yoga mat with carrying strap.',
    price: 49.99,
    comparePrice: 0,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
    category: 'sports',
    subcategory: 'yoga',
    sizes: [],
    colors: ['Purple', 'Blue', 'Green', 'Pink'],
    stock: 80,
    sku: 'YM-PR-001',
    brand: 'ZenFit',
    weight: 1.2,
    dimensions: { length: 183, width: 61, height: 0.6 },
    tags: ['yoga', 'fitness', 'mat'],
    isActive: true,
    isFeatured: false,
    averageRating: 4.4,
    numReviews: 18
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic coffee mugs with unique designs.',
    price: 34.99,
    comparePrice: 0,
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500'],
    category: 'home',
    subcategory: 'kitchen',
    sizes: [],
    colors: ['White', 'Blue', 'Green'],
    stock: 45,
    sku: 'CM-SET-001',
    brand: 'HomeCraft',
    weight: 1.5,
    dimensions: { length: 30, width: 20, height: 15 },
    tags: ['mug', 'coffee', 'kitchen'],
    isActive: true,
    isFeatured: false,
    averageRating: 4.1,
    numReviews: 22
  },
  {
    name: 'Bestseller Novel Collection',
    description: 'Collection of 5 bestselling fiction novels in hardcover edition.',
    price: 59.99,
    comparePrice: 0,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
    category: 'books',
    subcategory: 'fiction',
    sizes: [],
    colors: [],
    stock: 60,
    sku: 'BK-COL-001',
    brand: 'BookWorld',
    weight: 2.0,
    dimensions: { length: 25, width: 18, height: 12 },
    tags: ['books', 'fiction', 'bestseller'],
    isActive: true,
    isFeatured: false,
    averageRating: 4.8,
    numReviews: 35
  },
  {
    name: 'Skincare Essentials Kit',
    description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer.',
    price: 79.99,
    comparePrice: 99.99,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
    category: 'beauty',
    subcategory: 'skincare',
    sizes: [],
    colors: [],
    stock: 55,
    sku: 'SK-KIT-001',
    brand: 'GlowBeauty',
    weight: 0.8,
    dimensions: { length: 20, width: 15, height: 10 },
    tags: ['skincare', 'beauty', 'cosmetics'],
    isActive: true,
    isFeatured: true,
    averageRating: 4.5,
    numReviews: 28
  },
  {
    name: 'Gaming Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches.',
    price: 149.99,
    comparePrice: 179.99,
    images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500'],
    category: 'electronics',
    subcategory: 'gaming',
    sizes: [],
    colors: ['Black', 'White'],
    stock: 35,
    sku: 'KB-GAM-001',
    brand: 'GamePro',
    weight: 1.1,
    dimensions: { length: 44, width: 13, height: 4 },
    tags: ['keyboard', 'gaming', 'rgb'],
    isActive: true,
    isFeatured: true,
    averageRating: 4.6,
    numReviews: 31
  },
  {
    name: 'Denim Jacket Vintage',
    description: 'Classic vintage style denim jacket with distressed details.',
    price: 69.99,
    comparePrice: 0,
    images: ['https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500'],
    category: 'clothing',
    subcategory: 'jackets',
    sizes: [{ size: 'S', quantity: 10 }, { size: 'M', quantity: 15 }, { size: 'L', quantity: 12 }, { size: 'XL', quantity: 8 }],
    colors: ['Blue', 'Black'],
    stock: 45,
    sku: 'DJ-VIN-001',
    brand: 'DenimCo',
    weight: 0.9,
    dimensions: { length: 40, width: 30, height: 5 },
    tags: ['denim', 'jacket', 'vintage'],
    isActive: true,
    isFeatured: false,
    averageRating: 4.0,
    numReviews: 14
  },
  {
    name: 'Bluetooth Speaker Mini',
    description: 'Portable waterproof Bluetooth speaker with 360-degree sound.',
    price: 59.99,
    comparePrice: 0,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
    category: 'electronics',
    subcategory: 'audio',
    sizes: [],
    colors: ['Black', 'Blue', 'Red'],
    stock: 70,
    sku: 'SP-BT-001',
    brand: 'SoundWave',
    weight: 0.4,
    dimensions: { length: 10, width: 10, height: 15 },
    tags: ['speaker', 'bluetooth', 'portable'],
    isActive: true,
    isFeatured: true,
    averageRating: 4.3,
    numReviews: 19
  }
];

const sampleReviews = [
  { rating: 5, comment: 'Excellent product! Highly recommended.' },
  { rating: 4, comment: 'Good quality, fast shipping.' },
  { rating: 5, comment: 'Love it! Exactly as described.' },
  { rating: 3, comment: 'Okay product, could be better.' },
  { rating: 4, comment: 'Great value for money.' },
  { rating: 5, comment: 'Amazing! Will buy again.' }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to database...');

    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing data...');

    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const userPassword = await bcrypt.hash('Password123!', 12);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: adminPassword,
      role: 'admin',
      referralCode: 'ADMIN001',
      coins: 500
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
      referredBy: admin._id,
      referralCode: 'JOHN001',
      coins: 150,
      addresses: [{
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true
      }]
    });

    admin.referrals.push({ user: user._id });
    await admin.save();

    console.log('Created default users...');

    const products = await Product.insertMany(sampleProducts);
    console.log(`Created ${products.length} products...`);

    for (const product of products) {
      const numReviews = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < numReviews; i++) {
        const reviewData = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
        product.reviews.push({
          user: i % 2 === 0 ? admin._id : user._id,
          ...reviewData
        });
      }
      product.numReviews = product.reviews.length;
      product.averageRating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
      await product.save();
    }
    console.log('Added reviews to products...');

    const coupons = await Coupon.insertMany([
      {
        code: 'WELCOME20',
        description: '20% off your first order',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 50,
        maxDiscount: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        usageLimit: 100
      },
      {
        code: 'SAVE10',
        description: '$10 off orders over $100',
        discountType: 'fixed',
        discountValue: 10,
        minOrderAmount: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        usageLimit: 200
      }
    ]);
    console.log('Created sample coupons...');

    const sampleOrder = await Order.create({
      user: user._id,
      orderItems: [{
        product: products[0]._id,
        name: products[0].name,
        image: products[0].images[0],
        price: products[0].price,
        quantity: 1
      }],
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      itemsPrice: products[0].price,
      shippingPrice: 10,
      taxPrice: products[0].price * 0.08,
      totalPrice: products[0].price + 10 + (products[0].price * 0.08),
      orderStatus: 'delivered',
      deliveredAt: new Date()
    });
    console.log('Created sample order...');

    console.log('\n=== SEED COMPLETED SUCCESSFULLY ===');
    console.log('\nDefault Credentials:');
    console.log('Admin: admin@ecommerce.com / Admin123!');
    console.log('User: john@example.com / Password123!');
    console.log('\nCoupons:');
    coupons.forEach(c => console.log(`- ${c.code}: ${c.description}`));
    console.log('\nProducts created:', products.length);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();