#!/bin/bash

# ============================================
# E-COMMERCE PLATFORM DEPLOYMENT SCRIPT
# ============================================
# This script prepares and deploys the full stack application
# Run: bash deploy.sh

set -e

echo "🚀 Starting Full Deployment Process..."
echo "============================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# STEP 1: VERIFY PROJECT STRUCTURE
# ============================================
echo -e "${YELLOW}[STEP 1/10] Verifying project structure...${NC}"

if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: backend/ or frontend/ directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project structure verified${NC}"

# ============================================
# STEP 2: GIT CONFIGURATION
# ============================================
echo -e "${YELLOW}[STEP 2/10] Configuring git...${NC}"

if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
else
    echo -e "${GREEN}✅ Git already initialized${NC}"
fi

# Check if there are changes to commit
if [ -n "$(git status --porcelain)" ]; then
    git add -A
    git commit -m "Production deployment ready - $(date)"
    echo -e "${GREEN}✅ Changes committed${NC}"
else
    echo -e "${GREEN}✅ No changes to commit${NC}"
fi

# ============================================
# STEP 3: VERIFY BACKEND CONFIG
# ============================================
echo -e "${YELLOW}[STEP 3/10] Verifying backend configuration...${NC}"

if [ ! -f "backend/server.js" ]; then
    echo -e "${RED}❌ Error: backend/server.js not found${NC}"
    exit 1
fi

if [ ! -f "backend/package.json" ]; then
    echo -e "${RED}❌ Error: backend/package.json not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend configuration verified${NC}"

# ============================================
# STEP 4: VERIFY FRONTEND CONFIG
# ============================================
echo -e "${YELLOW}[STEP 4/10] Verifying frontend configuration...${NC}"

if [ ! -f "frontend/next.config.js" ]; then
    echo -e "${RED}❌ Error: frontend/next.config.js not found${NC}"
    exit 1
fi

if [ ! -f "frontend/package.json" ]; then
    echo -e "${RED}❌ Error: frontend/package.json not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend configuration verified${NC}"

# ============================================
# STEP 5: CHECK DEPLOYMENT FILES
# ============================================
echo -e "${YELLOW}[STEP 5/10] Checking deployment configuration files...${NC}"

if [ ! -f "render.yaml" ]; then
    echo -e "${RED}❌ Error: render.yaml not found${NC}"
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ Error: vercel.json not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployment configuration files verified${NC}"

# ============================================
# STEP 6: PUSH TO GITHUB
# ============================================
echo -e "${YELLOW}[STEP 6/10] Pushing to GitHub...${NC}"

REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$REMOTE_URL" ]; then
    echo -e "${RED}❌ Error: No git remote configured${NC}"
    echo "Please run: git remote add origin https://github.com/YOUR_USERNAME/ecommerce-platform.git"
    exit 1
fi

git push -u origin main --force
echo -e "${GREEN}✅ Pushed to GitHub: $REMOTE_URL${NC}"

# ============================================
# STEP 7: DEPLOY BACKEND TO RENDER (MANUAL)
# ============================================
echo -e "${YELLOW}[STEP 7/10] Backend deployment to Render...${NC}"
echo -e "${YELLOW}⚠️  MANUAL STEP REQUIRED${NC}"
echo ""
echo "Please follow these steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Configure:"
echo "   - Name: ecommerce-backend"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "5. Add environment variables from .env.production.template"
echo "6. Click 'Create Web Service'"
echo ""
read -p "Press Enter after completing Render deployment..."

# ============================================
# STEP 8: DEPLOY FRONTEND TO VERCEL (MANUAL)
# ============================================
echo -e "${YELLOW}[STEP 8/10] Frontend deployment to Vercel...${NC}"
echo -e "${YELLOW}⚠️  MANUAL STEP REQUIRED${NC}"
echo ""
echo "Please follow these steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'Add New...' → 'Project'"
echo "3. Import your GitHub repository"
echo "4. Configure:"
echo "   - Framework Preset: Next.js"
echo "   - Root Directory: frontend"
echo "5. Add environment variables from .env.production.template"
echo "6. Click 'Deploy'"
echo ""
read -p "Press Enter after completing Vercel deployment..."

# ============================================
# STEP 9: UPDATE ENVIRONMENT VARIABLES
# ============================================
echo -e "${YELLOW}[STEP 9/10] Update environment variables...${NC}"
echo -e "${YELLOW}⚠️  MANUAL STEP REQUIRED${NC}"
echo ""
echo "After both deployments complete:"
echo "1. Copy your Render backend URL (e.g., https://ecommerce-backend-xxxx.onrender.com)"
echo "2. Add to Vercel environment variables:"
echo "   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api"
echo "3. Copy your Vercel frontend URL (e.g., https://ecommerce-platform-xxxx.vercel.app)"
echo "4. Add to Render environment variables:"
echo "   FRONTEND_URL=https://your-frontend-url.vercel.app"
echo "5. Redeploy both services"
echo ""
read -p "Press Enter after updating environment variables..."

# ============================================
# STEP 10: SEED DATABASE
# ============================================
echo -e "${YELLOW}[STEP 10/10] Seeding production database...${NC}"
echo -e "${YELLOW}⚠️  MANUAL STEP REQUIRED${NC}"
echo ""
echo "To seed the production database:"
echo "1. Go to Render Dashboard"
echo "2. Click your backend service"
echo "3. Click 'Shell' tab"
echo "4. Run: npm run seed"
echo "5. Wait for 'Seed data created successfully!'"
echo ""
read -p "Press Enter after seeding the database..."

echo ""
echo "============================================"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "============================================"
echo ""
echo "Your e-commerce platform should now be live!"
echo ""
echo "Next steps:"
echo "1. Test user registration"
echo "2. Test login with admin credentials"
echo "3. Test adding items to cart"
echo "4. Test checkout with Stripe test card: 4242 4242 4242 4242"
echo ""
echo "Default Admin Credentials:"
echo "  Email: admin@ecommerce.com"
echo "  Password: Admin123!"
echo ""
echo "Available Coupons:"
echo "  WELCOME20 - 20% off orders over $50"
echo "  SAVE10 - $10 off orders over $100"
echo ""
echo "============================================"