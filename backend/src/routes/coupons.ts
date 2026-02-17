import express from 'express';
import {
  getMyReferralCoupon,
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/validate', validateCoupon);

// Protected routes
router.get('/my-referral', authenticate, getMyReferralCoupon);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), getAllCoupons);
router.post('/admin', authenticate, authorize('admin'), createCoupon);
router.put('/admin/:id', authenticate, authorize('admin'), updateCoupon);
router.delete('/admin/:id', authenticate, authorize('admin'), deleteCoupon);

export default router;