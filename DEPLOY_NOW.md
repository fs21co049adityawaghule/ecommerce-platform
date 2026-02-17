# 🚀 DEPLOYMENT GUIDE - GitHub + Render + Vercel

## ✅ Repository Created Successfully!

Your code has been committed locally. Now let's deploy it live!

---

## Step 1: Push to GitHub (3 minutes)

```bash
# Navigate to your project
cd C:\Users\Aditya\ecommerce-platform

# Check git status
git status

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Don't have a GitHub repo yet?**
1. Go to https://github.com/new
2. Repository name: `ecommerce-platform`
3. Make it Public or Private
4. Click "Create repository"
5. Then run the commands above

---

## Step 2: MongoDB Atlas Setup (5 minutes)

1. **Create Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Cluster**:
   - Click "Create" → "Shared Cluster" (FREE tier)
   - Select AWS region closest to you
   - Click "Create Cluster" (wait 1-2 minutes)

3. **Create Database User**:
   - Go to "Database Access" → "Add New Database User"
   - Username: `admin`
   - Password: Generate a secure password (save it!)
   - Click "Add User"

4. **Whitelist IP**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Drivers" → "Node.js"
   - Copy the connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

---

## Step 3: Stripe Setup (2 minutes)

1. **Create Account**: https://dashboard.stripe.com/register
2. **Get API Keys**:
   - Go to "Developers" → "API Keys"
   - Copy **Publishable key** (starts with `pk_test_`)
   - Copy **Secret key** (starts with `sk_test_`)
   - Save both for later

---

## Step 4: Deploy Backend to Render (5 minutes)

1. **Create Account**: https://render.com (use "Sign up with GitHub")
2. **New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Click "Connect"

3. **Configure**:
   - **Name**: `ecommerce-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Environment Variables** (Click "Advanced"):
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string_from_step_2
   JWT_SECRET=generate_a_random_string_min_32_characters_here
   JWT_EXPIRES_IN=30d
   STRIPE_SECRET_KEY=your_stripe_secret_key_from_step_3
   FRONTEND_URL=leave_this_empty_for_now
   ```

5. Click "Create Web Service"
6. Wait for deployment (2-3 minutes)
7. **Copy your backend URL** (e.g., `https://ecommerce-backend-xxxx.onrender.com`)

---

## Step 5: Deploy Frontend to Vercel (3 minutes)

1. **Create Account**: https://vercel.com/signup (use "Continue with GitHub")
2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`

4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   NEXT_PUBLIC_STRIPE_KEY=your_stripe_publishable_key_from_step_3
   ```

5. Click "Deploy"
6. Wait for deployment (1-2 minutes)
7. **Copy your frontend URL** (e.g., `https://ecommerce-platform-xxxx.vercel.app`)

---

## Step 6: Update Backend Environment (1 minute)

1. Go back to Render Dashboard
2. Click your backend service
3. Go to "Environment" tab
4. Add:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
5. Click "Save Changes"
6. Wait for redeploy

---

## Step 7: Seed Database (2 minutes)

1. In Render Dashboard, click your backend service
2. Click "Shell" tab
3. Run:
   ```bash
   npm run seed
   ```
4. Wait for "Seed data created successfully!"

---

## Step 8: Test Your Live Website! 🎉

Open your Vercel URL and test:

1. ✅ Visit your website: `https://your-frontend-url.vercel.app`
2. ✅ Register a new user account
3. ✅ Browse products on Shop page
4. ✅ Add items to cart
5. ✅ Apply coupon code: `WELCOME20`
6. ✅ Test checkout with Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
7. ✅ Check order appears in "My Orders"
8. ✅ Login as admin:
   - Email: `admin@ecommerce.com`
   - Password: `Admin123!`
9. ✅ Access admin dashboard

---

## 🌐 Your Live URLs

After deployment, you'll have:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-api.onrender.com/api`
- **Admin Panel**: `https://your-app.vercel.app/admin`

---

## 🔑 Default Credentials

| Role  | Email                  | Password      |
|-------|------------------------|---------------|
| Admin | admin@ecommerce.com    | Admin123!     |
| User  | john@example.com       | Password123!  |

---

## 🎫 Available Coupons

- `WELCOME20`: 20% off orders over $50
- `SAVE10`: $10 off orders over $100

---

## 🆘 Troubleshooting

### CORS Errors?
Make sure `FRONTEND_URL` in Render exactly matches your Vercel URL (including https://)

### Database Connection Failed?
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify connection string format
- Ensure database user password is correct

### Payment Not Working?
- Verify Stripe keys are from test mode (not live)
- Check `NEXT_PUBLIC_STRIPE_KEY` is in Vercel env
- Check `STRIPE_SECRET_KEY` is in Render env

### Build Failures?
- Check Render/Vercel build logs
- Ensure all environment variables are set
- Verify Node.js version is 18+

---

## 📧 Need Help?

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → View Logs
3. Common issues are in the troubleshooting section above

---

## ⏱️ Total Estimated Time: 20-25 minutes

**Cost: $0** (all services offer generous free tiers)

Your e-commerce platform will be LIVE and ready to use! 🚀