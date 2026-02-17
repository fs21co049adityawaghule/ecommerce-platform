import express from 'express';
import {
  createOrder,
  confirmPayment,
  getOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// User routes
router.post('/', authenticate, createOrder);
router.post('/:id/confirm', authenticate, confirmPayment);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrder);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), getAllOrders);
router.put('/:id/status', authenticate, authorize('admin'), updateOrderStatus);

export default router;