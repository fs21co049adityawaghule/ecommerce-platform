# Deployment Guide

This guide will walk you through deploying the ShopEase e-commerce platform to production.

## Prerequisites

Before you begin, ensure you have:
- GitHub account
- MongoDB Atlas account (free tier available)
- Stripe account (for payment processing)
- Render account (for backend deployment)
- Vercel account (for frontend deployment)

## Step 1: Prepare Your Repository

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub and push your code:
```bash
git remote add origin https://github.com/yourusername/shopease.git
git branch -M main
git push -u origin main
```

## Step 2: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster
2. Click "Database Access" and create a new database user
3. Click "Network Access" and add IP address `0.0.0.0/0` (or your specific IP)
4. Click "Database" → "Connect" → "Drivers" → "Node.js"
5. Copy the connection string (replace `<password>` with your database user password)
6. Save this string - you'll need it for deployment

## Step 3: Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys from Developers → API Keys
3. Copy:
   - Publishable key (starts with `pk_test_` or `pk_live_`)
   - Secret key (starts with `sk_test_` or `sk_live_`)
4. For webhooks, you'll need to set this up after deploying the backend

## Step 4: Deploy Backend to Render

### Option A: Using Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `shopease-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key (at least 32 characters)
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

6. Click "Create Web Service"
7. Wait for deployment to complete

### Option B: Using Render Blueprint (render.yaml)

1. Push your code with `render.yaml` included
2. Go to [Render Blueprints](https://dashboard.render.com/blueprints)
3. Click "New Blueprint Instance"
4. Connect your repository
5. Render will automatically create services based on `render.yaml`
6. Fill in the secret values when prompted

## Step 5: Deploy Frontend to Vercel

### Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
   ```

6. Click "Deploy"
7. Wait for deployment to complete

### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel --prod
```

## Step 6: Update Backend Environment

After the frontend is deployed, update the `CLIENT_URL` in your backend environment variables:

1. Go to your backend service on Render
2. Click "Environment" tab
3. Update `CLIENT_URL` to your Vercel deployment URL
4. Save changes - this will redeploy the backend

## Step 7: Configure Stripe Webhooks (Optional)

If you want to handle payment events:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter URL: `https://your-backend-url.onrender.com/api/webhooks/stripe`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret
6. Add to backend environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

## Step 8: Seed the Database

To add sample data and admin account:

1. Go to Render Dashboard → Your Backend Service → Shell
2. Run:
```bash
npm run seed
```

Or use MongoDB Compass to manually import data.

## Step 9: Test Your Deployment

1. Visit your Vercel frontend URL
2. Test user registration and login
3. Add items to cart
4. Test checkout with Stripe test card:
   - Card: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVC: 123

## Default Login Credentials

### Admin Account
- Email: `admin@ecommerce.com`
- Password: `Admin123!`

### Sample User
- Email: `john@example.com`
- Password: `Password123!`

## Troubleshooting

### CORS Errors
Ensure `CLIENT_URL` in backend matches your actual frontend URL exactly (including https://)

### MongoDB Connection Errors
- Check that your IP is whitelisted in MongoDB Atlas
- Verify the connection string format
- Ensure database user credentials are correct

### Stripe Payment Errors
- Verify Stripe keys are correct (test vs live)
- Check that `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` is set in frontend
- Ensure `STRIPE_SECRET_KEY` is set in backend

### Build Failures
- Check that all environment variables are set
- Verify Node.js version (18+ recommended)
- Check build logs for specific errors

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend health check passes (`/health` endpoint)
- [ ] User registration works
- [ ] User login works
- [ ] Products load from database
- [ ] Cart functionality works
- [ ] Checkout with Stripe works
- [ ] Admin dashboard accessible
- [ ] Responsive design works on mobile
- [ ] All images load correctly

## Updating Your Deployment

### Backend Updates
1. Push changes to GitHub
2. Render will automatically redeploy

### Frontend Updates
1. Push changes to GitHub
2. Vercel will automatically redeploy

## Custom Domain Setup (Optional)

### Vercel Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Render Custom Domain
1. Go to Service Settings → Custom Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Monitoring & Logs

### Render
- View logs in Render Dashboard → Service → Logs
- Set up log streams for production monitoring

### Vercel
- View logs in Vercel Dashboard → Project → Logs
- Enable Analytics for performance monitoring

## Production Checklist

Before going live:
- [ ] Switch to Stripe live keys
- [ ] Update all test data
- [ ] Enable email verification
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure automated backups
- [ ] Set up SSL certificates (usually automatic)
- [ ] Test payment flow end-to-end
- [ ] Review security headers
- [ ] Enable rate limiting verification

## Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test locally with production build
4. Check CORS configuration
5. Verify database connectivity

---

Your e-commerce platform should now be live! 🎉