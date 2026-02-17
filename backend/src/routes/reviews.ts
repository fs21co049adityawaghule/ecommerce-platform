import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  getAllReviews,
  replyToReview,
  toggleReview
} from '../controllers/reviewController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', authenticate, createReview);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);
router.post('/:id/helpful', authenticate, markHelpful);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), getAllReviews);
router.post('/:id/reply', authenticate, authorize('admin'), replyToReview);
router.put('/:id/toggle', authenticate, authorize('admin'), toggleReview);

export default router;