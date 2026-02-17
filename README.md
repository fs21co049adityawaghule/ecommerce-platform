# ShopEase - Full-Stack E-commerce Platform

A modern, full-featured e-commerce platform built with Next.js, Express, MongoDB, and Stripe.

## Features

- **User Authentication**: JWT-based auth with secure password hashing
- **Product Catalog**: Browse, filter, and search products
- **Shopping Cart**: Add to cart, apply coupons, use coins
- **Payment Integration**: Stripe payment processing
- **Referral System**: Earn coins by referring friends
- **Rewards Program**: Milestone-based rewards (10, 25, 50 referrals)
- **Admin Dashboard**: Manage products, orders, users, and analytics
- **Responsive Design**: Mobile-first responsive UI

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- React Hot Toast
- Stripe React

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt
- Stripe SDK

## Project Structure

```
ecommerce-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── next.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account (for payments)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

5. Seed the database (optional):
```bash
npm run seed
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

### Backend Deployment (Render/Railway)

1. Push your code to GitHub
2. Create a new web service on Render or Railway
3. Connect your GitHub repository
4. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `CLIENT_URL` (your frontend URL)
5. Deploy!

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import project on Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` (your backend URL + /api)
   - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
4. Deploy!

### MongoDB Atlas Setup

1. Create a free cluster on MongoDB Atlas
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for all)
4. Copy the connection string

## Default Credentials

### Admin Account
- Email: admin@ecommerce.com
- Password: Admin123!

### Sample User Account
- Email: john@example.com
- Password: Password123!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove from cart
- `POST /api/cart/coupon` - Apply coupon

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/admin/all` - Get all orders (Admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/referrals` - Referral analytics
- `GET /api/admin/coins` - Coin analytics

## Referral System

1. New users get a unique referral code on signup (e.g., WELCOME-USERNAME123)
2. Referrer gets 100 coins per successful referral
3. Additional 5% of order value as coins when referral code is used
4. Milestone rewards:
   - 10 referrals: Premium Membership Free for 1 Month
   - 25 referrals: ₹500 Store Credit
   - 50 referrals: ₹1500 Store Credit + Free Gift

## Testing

### Test Card Details (Stripe)
- Card Number: 4242 4242 4242 4242
- Expiry: 12/25
- CVC: 123

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For support, email support@shopease.com or join our Discord community.

---

Built with ❤️ by the ShopEase Team