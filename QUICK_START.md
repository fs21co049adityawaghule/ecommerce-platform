# Quick Deployment Checklist

Use this checklist to deploy your e-commerce platform step by step.

## Pre-Deployment Setup

### 1. Accounts Needed
- [ ] **GitHub**: Create account at https://github.com/signup
- [ ] **MongoDB Atlas**: Create account at https://www.mongodb.com/cloud/atlas
- [ ] **Stripe**: Create account at https://stripe.com
- [ ] **Render**: Create account at https://render.com (use "Sign up with GitHub")
- [ ] **Vercel**: Create account at https://vercel.com/signup (use "Continue with GitHub")

### 2. Environment Setup
- [ ] Run setup script: `npm run setup` or `bash deploy-setup.sh`
- [ ] Edit `backend/.env` with your credentials
- [ ] Edit `frontend/.env.local` with your credentials

### 3. MongoDB Atlas Setup (5 minutes)
1. Go to https://cloud.mongodb.com
2. Click "Create" → "Shared Cluster" (FREE)
3. Choose AWS as provider, select region closest to you
4. Click "Create Cluster" (wait 1-2 minutes)
5. Click "Database Access" → "Add New Database User"
   - Username: `admin`
   - Password: Generate secure password
   - Click "Add User"
6. Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your IP)
7. Click "Databases" → Click "Connect" on your cluster
   - Choose "Drivers"
   - Select "Node.js"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Save this string for later

### 4. Stripe Setup (3 minutes)
1. Go to https://dashboard.stripe.com
2. Complete account setup
3. Go to "Developers" → "API Keys"
4. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)
5. Save both keys for later

### 5. Push to GitHub (2 minutes)
```bash
# In your project directory
git init
git add .
git commit -m "Initial commit: Complete e-commerce platform"

# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/shopease.git
git branch -M main
git push -u origin main
```

### 6. Deploy Backend to Render (5 minutes)
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `shopease-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click "Advanced" and add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=generate_random_string_at_least_32_chars
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLIENT_URL=(leave empty for now, we'll update after frontend deploy)
   ```
6. Click "Create Web Service"
7. Wait for deployment (2-3 minutes)
8. Copy the backend URL (e.g., `https://shopease-backend.onrender.com`)

### 7. Deploy Frontend to Vercel (3 minutes)
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```
6. Click "Deploy"
7. Wait for deployment (1-2 minutes)
8. Copy the frontend URL (e.g., `https://shopease.vercel.app`)

### 8. Update Backend Environment (1 minute)
1. Go back to Render Dashboard
2. Click your backend service
3. Go to "Environment" tab
4. Add/update:
   ```
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
5. Click "Save Changes"
6. Wait for redeploy

### 9. Seed Database (2 minutes)
1. In Render Dashboard, click your backend service
2. Click "Shell" tab
3. Run: `npm run seed`
4. Wait for "Seed data created successfully!"

### 10. Test Your Deployment (5 minutes)
- [ ] Visit your Vercel frontend URL
- [ ] Register a new user account
- [ ] Browse products
- [ ] Add items to cart
- [ ] Apply coupon code: `WELCOME10`
- [ ] Test checkout with Stripe test card:
  - Card: `4242 4242 4242 4242`
  - Expiry: `12/25`
  - CVC: `123`
- [ ] Check order appears in "My Orders"
- [ ] Login as admin (admin@ecommerce.com / Admin123!)
- [ ] Access admin dashboard

## You're Live! 🎉

Your e-commerce platform is now deployed and running!

### Next Steps (Optional)
- [ ] Set up custom domain on Vercel
- [ ] Configure Stripe webhooks for production
- [ ] Enable email notifications
- [ ] Set up analytics (Google Analytics)
- [ ] Configure automated backups in MongoDB Atlas

### Troubleshooting

**CORS Errors?**
- Make sure CLIENT_URL matches your actual frontend URL exactly
- Include https://

**Database Connection Failed?**
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user password is correct

**Payment Not Working?**
- Verify Stripe keys are from the same account (test vs live)
- Check that NEXT_PUBLIC_STRIPE_PUBLIC_KEY is in frontend env
- Check that STRIPE_SECRET_KEY is in backend env

**Build Failures?**
- Check Render/Vercel build logs
- Ensure all environment variables are set
- Verify Node.js version is 18+

### Support Resources
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Stripe Docs**: https://stripe.com/docs

### Default Login Credentials
- **Admin**: admin@ecommerce.com / Admin123!
- **Sample User**: john@example.com / Password123!

---

**Estimated Total Time**: 30-45 minutes
**Estimated Cost**: $0 (all services offer free tiers)