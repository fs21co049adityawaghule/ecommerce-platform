#!/bin/bash

echo "🚀 ShopEase Deployment Helper"
echo "=============================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Step 1: Initialize Git repository
echo "Step 1: Initializing Git repository..."
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial commit: Complete e-commerce platform"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi
echo ""

# Step 2: Create environment files
echo "Step 2: Setting up environment files..."

cd backend
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cat > .env << EOL
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
EOL
    echo "✅ Backend .env created (please edit with your credentials)"
else
    echo "✅ Backend .env already exists"
fi

cd ../frontend
if [ ! -f ".env.local" ]; then
    echo "Creating frontend .env.local file..."
    cat > .env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
EOL
    echo "✅ Frontend .env.local created (please edit with your credentials)"
else
    echo "✅ Frontend .env.local already exists"
fi

cd ..
echo ""

# Step 3: Install dependencies
echo "Step 3: Installing dependencies..."
echo "Installing backend dependencies..."
cd backend && npm install
cd ..

echo "Installing frontend dependencies..."
cd frontend && npm install
cd ..
echo "✅ Dependencies installed"
echo ""

# Step 4: Test build
echo "Step 4: Testing builds..."
echo "Building backend..."
cd backend && npm run build
if [ $? -eq 0 ]; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed"
    exit 1
fi
cd ..

echo "Building frontend..."
cd frontend && npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..
echo ""

echo "=============================="
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Create a GitHub repository and push your code"
echo "2. Set up MongoDB Atlas (https://www.mongodb.com/cloud/atlas)"
echo "3. Set up Stripe account (https://stripe.com)"
echo "4. Update the .env files with your actual credentials"
echo "5. Deploy to Render and Vercel (see DEPLOYMENT.md)"
echo ""
echo "To start locally:"
echo "  - Backend: cd backend && npm run dev"
echo "  - Frontend: cd frontend && npm run dev"
echo ""