import mongoose from 'mongoose';
import { User, Product, Review, Coupon } from '../models';
import connectDB from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});

    console.log('Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      contactNumber: '+91-9876543210',
      username: 'admin',
      email: 'admin@ecommerce.com',
      password: 'Admin123!',
      role: 'admin',
      coins: 1000,
      referralRewards: [
        { milestone: 10, claimed: false, reward: 'Premium Membership Free for 1 Month' },
        { milestone: 25, claimed: false, reward: '₹500 Store Credit' },
        { milestone: 50, claimed: false, reward: '₹1500 Store Credit + Free Gift' }
      ]
    });

    console.log('Creating sample user...');
    const sampleUser = await User.create({
      name: 'John Doe',
      contactNumber: '+91-9876543211',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'Password123!',
      role: 'user',
      coins: 500,
      addresses: [{
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
        isDefault: true
      }],
      referralRewards: [
        { milestone: 10, claimed: false, reward: 'Premium Membership Free for 1 Month' },
        { milestone: 25, claimed: false, reward: '₹500 Store Credit' },
        { milestone: 50, claimed: false, reward: '₹1500 Store Credit + Free Gift' }
      ]
    });

    console.log('Creating products...');
    const products = await Product.create([
      {
        name: 'Premium Wireless Headphones',
        description: 'Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
        price: 4999,
        compareAtPrice: 5999,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
        category: 'electronics',
        tags: ['headphones', 'wireless', 'audio', 'premium'],
        colors: [
          { name: 'Black', hex: '#000000' },
          { name: 'White', hex: '#FFFFFF' },
          { name: 'Blue', hex: '#0066CC' }
        ],
        inventory: [
          { color: 'Black', quantity: 50, sku: 'WH-BLK-001' },
          { color: 'White', quantity: 30, sku: 'WH-WHT-001' },
          { color: 'Blue', quantity: 20, sku: 'WH-BLU-001' }
        ],
        rating: 4.5,
        reviewCount: 128,
        soldCount: 450,
        isTrending: true,
        isFeatured: true,
        weight: 250
      },
      {
        name: 'Smart Watch Pro',
        description: 'Stay connected and track your fitness goals with our advanced smartwatch. Features heart rate monitoring, GPS tracking, and 7-day battery life.',
        price: 12999,
        compareAtPrice: 14999,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        category: 'electronics',
        tags: ['smartwatch', 'fitness', 'wearable', 'tech'],
        colors: [
          { name: 'Black', hex: '#000000' },
          { name: 'Silver', hex: '#C0C0C0' }
        ],
        sizes: ['40mm', '44mm'],
        inventory: [
          { color: 'Black', size: '40mm', quantity: 25, sku: 'SW-BLK-40' },
          { color: 'Black', size: '44mm', quantity: 20, sku: 'SW-BLK-44' },
          { color: 'Silver', size: '40mm', quantity: 15, sku: 'SW-SLV-40' },
          { color: 'Silver', size: '44mm', quantity: 10, sku: 'SW-SLV-44' }
        ],
        rating: 4.8,
        reviewCount: 256,
        soldCount: 890,
        isNew: true,
        isTrending: true,
        weight: 50
      },
      {
        name: 'Cotton Casual T-Shirt',
        description: 'Premium quality 100% cotton t-shirt with a comfortable fit. Perfect for everyday wear with breathable fabric and durable stitching.',
        price: 799,
        compareAtPrice: 999,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
        category: 'fashion',
        subcategory: 'clothing',
        tags: ['tshirt', 'casual', 'cotton', 'basics'],
        colors: [
          { name: 'Black', hex: '#000000' },
          { name: 'White', hex: '#FFFFFF' },
          { name: 'Navy', hex: '#000080' },
          { name: 'Grey', hex: '#808080' }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        inventory: [
          { color: 'Black', size: 'M', quantity: 100, sku: 'TSH-BLK-M' },
          { color: 'Black', size: 'L', quantity: 80, sku: 'TSH-BLK-L' },
          { color: 'White', size: 'M', quantity: 90, sku: 'TSH-WHT-M' },
          { color: 'White', size: 'L', quantity: 70, sku: 'TSH-WHT-L' },
          { color: 'Navy', size: 'M', quantity: 60, sku: 'TSH-NVY-M' },
          { color: 'Grey', size: 'M', quantity: 50, sku: 'TSH-GRY-M' }
        ],
        rating: 4.3,
        reviewCount: 89,
        soldCount: 1200,
        isTrending: true,
        weight: 200
      },
      {
        name: 'Modern Minimalist Sofa',
        description: 'Elevate your living space with this elegant 3-seater sofa. Features premium fabric upholstery, sturdy wooden frame, and comfortable cushioning.',
        price: 24999,
        compareAtPrice: 29999,
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
        category: 'home',
        subcategory: 'furniture',
        tags: ['sofa', 'furniture', 'living room', 'home decor'],
        colors: [
          { name: 'Grey', hex: '#808080' },
          { name: 'Beige', hex: '#F5F5DC' },
          { name: 'Blue', hex: '#4169E1' }
        ],
        inventory: [
          { color: 'Grey', quantity: 15, sku: 'SOFA-GRY-001' },
          { color: 'Beige', quantity: 10, sku: 'SOFA-BGE-001' },
          { color: 'Blue', quantity: 8, sku: 'SOFA-BLU-001' }
        ],
        rating: 4.6,
        reviewCount: 45,
        soldCount: 120,
        isFeatured: true,
        weight: 35000,
        dimensions: { length: 210, width: 90, height: 85 }
      },
      {
        name: 'Professional Running Shoes',
        description: 'High-performance running shoes with advanced cushioning technology. Designed for comfort and durability during long-distance runs.',
        price: 5499,
        compareAtPrice: 6999,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        category: 'fashion',
        subcategory: 'footwear',
        tags: ['shoes', 'running', 'sports', 'athletic'],
        colors: [
          { name: 'Red', hex: '#FF0000' },
          { name: 'Black', hex: '#000000' },
          { name: 'White', hex: '#FFFFFF' }
        ],
        sizes: ['7', '8', '9', '10', '11'],
        inventory: [
          { color: 'Red', size: '9', quantity: 30, sku: 'SHOE-RED-09' },
          { color: 'Black', size: '9', quantity: 40, sku: 'SHOE-BLK-09' },
          { color: 'White', size: '9', quantity: 35, sku: 'SHOE-WHT-09' },
          { color: 'Red', size: '10', quantity: 25, sku: 'SHOE-RED-10' },
          { color: 'Black', size: '10', quantity: 30, sku: 'SHOE-BLK-10' }
        ],
        rating: 4.7,
        reviewCount: 167,
        soldCount: 650,
        isNew: true,
        isTrending: true,
        weight: 700
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Extra thick, non-slip yoga mat with alignment lines. Eco-friendly TPE material provides excellent cushioning and grip for all yoga practices.',
        price: 1499,
        compareAtPrice: 1999,
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'],
        category: 'sports',
        tags: ['yoga', 'fitness', 'mat', 'exercise'],
        colors: [
          { name: 'Purple', hex: '#800080' },
          { name: 'Teal', hex: '#008080' },
          { name: 'Pink', hex: '#FFC0CB' }
        ],
        inventory: [
          { color: 'Purple', quantity: 50, sku: 'YOGA-PUR-001' },
          { color: 'Teal', quantity: 40, sku: 'YOGA-TEA-001' },
          { color: 'Pink', quantity: 35, sku: 'YOGA-PNK-001' }
        ],
        rating: 4.4,
        reviewCount: 78,
        soldCount: 320,
        isFeatured: true,
        weight: 800
      },
      {
        name: 'Leather Wallet',
        description: 'Genuine leather wallet with multiple card slots and bill compartments. Sleek design with RFID blocking technology for security.',
        price: 1299,
        compareAtPrice: 1599,
        images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800'],
        category: 'fashion',
        subcategory: 'accessories',
        tags: ['wallet', 'leather', 'accessories', 'gifts'],
        colors: [
          { name: 'Brown', hex: '#8B4513' },
          { name: 'Black', hex: '#000000' }
        ],
        inventory: [
          { color: 'Brown', quantity: 60, sku: 'WALL-BRN-001' },
          { color: 'Black', quantity: 55, sku: 'WALL-BLK-001' }
        ],
        rating: 4.5,
        reviewCount: 112,
        soldCount: 480,
        weight: 100
      },
      {
        name: 'Organic Face Cream',
        description: 'Nourishing organic face cream with natural ingredients. Hydrates and revitalizes skin for a healthy, glowing complexion.',
        price: 899,
        compareAtPrice: 1099,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'],
        category: 'beauty',
        tags: ['skincare', 'organic', 'face cream', 'beauty'],
        inventory: [
          { quantity: 100, sku: 'FACE-CRM-001' }
        ],
        rating: 4.6,
        reviewCount: 95,
        soldCount: 380,
        isNew: true,
        weight: 50
      },
      {
        name: 'Bestseller Novel',
        description: 'Captivating bestseller novel that has taken the world by storm. A must-read for book lovers.',
        price: 499,
        compareAtPrice: 599,
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'],
        category: 'books',
        tags: ['books', 'fiction', 'bestseller', 'reading'],
        inventory: [
          { quantity: 200, sku: 'BOOK-NVL-001' }
        ],
        rating: 4.8,
        reviewCount: 234,
        soldCount: 1500,
        isTrending: true,
        weight: 400
      },
      {
        name: 'Educational Building Blocks',
        description: 'Colorful building blocks set for children. Promotes creativity, motor skills, and cognitive development through play.',
        price: 1599,
        compareAtPrice: 1999,
        images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800'],
        category: 'toys',
        tags: ['toys', 'educational', 'blocks', 'kids'],
        inventory: [
          { quantity: 80, sku: 'TOY-BLK-001' }
        ],
        rating: 4.7,
        reviewCount: 156,
        soldCount: 520,
        isFeatured: true,
        weight: 1200
      }
    ]);

    console.log('Creating sample reviews...');
    await Review.create([
      {
        user: sampleUser._id,
        product: products[0]._id,
        order: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Amazing sound quality!',
        comment: 'These headphones exceeded my expectations. The noise cancellation is incredible and the battery life is impressive.',
        isVerifiedPurchase: true,
        helpful: 12
      },
      {
        user: sampleUser._id,
        product: products[1]._id,
        order: new mongoose.Types.ObjectId(),
        rating: 4,
        title: 'Great smartwatch',
        comment: 'Love the features and design. Battery lasts as advertised. Only wish it had more watch faces.',
        isVerifiedPurchase: true,
        helpful: 8
      },
      {
        user: sampleUser._id,
        product: products[2]._id,
        order: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Perfect fit and quality',
        comment: 'The cotton feels premium and the fit is perfect. Will definitely buy more colors.',
        isVerifiedPurchase: true,
        helpful: 15
      }
    ]);

    console.log('Creating promotional coupons...');
    await Coupon.create([
      {
        code: 'WELCOME10',
        type: 'promotional',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 1000,
        maxDiscount: 200,
        usageLimit: 1000,
        description: 'Get 10% off on your first order above ₹1000'
      },
      {
        code: 'SAVE200',
        type: 'promotional',
        discountType: 'fixed',
        discountValue: 200,
        minOrderValue: 2000,
        usageLimit: 500,
        description: 'Flat ₹200 off on orders above ₹2000'
      },
      {
        code: 'FESTIVE25',
        type: 'promotional',
        discountType: 'percentage',
        discountValue: 25,
        minOrderValue: 3000,
        maxDiscount: 750,
        validUntil: new Date('2024-12-31'),
        usageLimit: 200,
        description: 'Festive special: 25% off on orders above ₹3000'
      }
    ]);

    console.log('Seed data created successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@ecommerce.com');
    console.log('Password: Admin123!');
    console.log('');
    console.log('Sample user credentials:');
    console.log('Email: john@example.com');
    console.log('Password: Password123!');
    console.log('');
    console.log(`Created ${products.length} products`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();