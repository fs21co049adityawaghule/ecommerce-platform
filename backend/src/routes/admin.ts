import express from 'express';
import {
  getDashboardStats,
  getReferralAnalytics,
  getCoinAnalytics
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/referrals', getReferralAnalytics);
router.get('/coins', getCoinAnalytics);

export default router;