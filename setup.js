const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 ShopEase Deployment Helper');
console.log('==============================\n');

// Check prerequisites
console.log('Checking prerequisites...');
try {
  execSync('git --version', { stdio: 'ignore' });
  execSync('node --version', { stdio: 'ignore' });
  console.log('✅ Prerequisites check passed\n');
} catch (error) {
  console.error('❌ Please install Git and Node.js 18+ first');
  process.exit(1);
}

// Step 1: Initialize Git
console.log('Step 1: Initializing Git repository...');
if (!fs.existsSync('.git')) {
  try {
    execSync('git init', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit: Complete e-commerce platform"', { stdio: 'ignore' });
    console.log('✅ Git repository initialized\n');
  } catch (error) {
    console.log('⚠️  Git init failed, continuing...\n');
  }
} else {
  console.log('✅ Git repository already exists\n');
}

// Step 2: Create environment files
console.log('Step 2: Setting up environment files...');

const jwtSecret = crypto.randomBytes(32).toString('hex');

// Backend .env
const backendEnvPath = path.join('backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  const backendEnv = `PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
`;
  fs.writeFileSync(backendEnvPath, backendEnv);
  console.log('✅ Backend .env created (please edit with your credentials)');
} else {
  console.log('✅ Backend .env already exists');
}

// Frontend .env.local
const frontendEnvPath = path.join('frontend', '.env.local');
if (!fs.existsSync(frontendEnvPath)) {
  const frontendEnv = `NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
`;
  fs.writeFileSync(frontendEnvPath, frontendEnv);
  console.log('✅ Frontend .env.local created (please edit with your credentials)');
} else {
  console.log('✅ Frontend .env.local already exists');
}

console.log('');

// Step 3: Install dependencies
console.log('Step 3: Installing dependencies...');
console.log('Installing backend dependencies...');
try {
  process.chdir('backend');
  execSync('npm install', { stdio: 'inherit' });
  process.chdir('..');
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Backend npm install failed');
  process.exit(1);
}

console.log('Installing frontend dependencies...');
try {
  process.chdir('frontend');
  execSync('npm install', { stdio: 'inherit' });
  process.chdir('..');
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Frontend npm install failed');
  process.exit(1);
}

console.log('');

// Step 4: Test builds
console.log('Step 4: Testing builds...');
console.log('Building backend...');
try {
  process.chdir('backend');
  execSync('npm run build', { stdio: 'inherit' });
  process.chdir('..');
  console.log('✅ Backend build successful');
} catch (error) {
  console.error('❌ Backend build failed');
  process.exit(1);
}

console.log('Building frontend...');
try {
  process.chdir('frontend');
  execSync('npm run build', { stdio: 'inherit' });
  process.chdir('..');
  console.log('✅ Frontend build successful');
} catch (error) {
  console.error('❌ Frontend build failed');
  process.exit(1);
}

console.log('');
console.log('==============================');
console.log('✅ Setup Complete!');
console.log('');
console.log('Next steps:');
console.log('1. Create accounts:');
console.log('   - GitHub: https://github.com/signup');
console.log('   - MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
console.log('   - Stripe: https://stripe.com');
console.log('   - Render: https://render.com');
console.log('   - Vercel: https://vercel.com/signup');
console.log('');
console.log('2. Update environment files:');
console.log('   - backend/.env');
console.log('   - frontend/.env.local');
console.log('');
console.log('3. Follow the deployment guide in QUICK_START.md');
console.log('');
console.log('To start locally:');
console.log('  Backend: cd backend && npm run dev');
console.log('  Frontend: cd frontend && npm run dev');
console.log('');
console.log('For detailed instructions, see:');
console.log('  - QUICK_START.md (step-by-step checklist)');
console.log('  - DEPLOYMENT.md (detailed deployment guide)');
console.log('  - README.md (project documentation)');
console.log('');