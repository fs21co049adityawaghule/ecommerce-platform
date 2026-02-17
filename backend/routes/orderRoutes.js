const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getOrders,
  getOrderById,
  createOrder,
  createStripeSession,
  updateOrderStatus,
  getAllOrders,
  getOrderStats
} = require('../controllers/orderController');

router.get('/', protect, getOrders);
router.get('/all', protect, admin, getAllOrders);
router.get('/stats', protect, admin, getOrderStats);
router.get('/:id', protect, getOrderById);
router.post('/', protect, createOrder);
router.post('/create-payment-session', protect, createStripeSession);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;