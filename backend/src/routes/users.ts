import express from 'express';
import {
  getProfile,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  redeemCoins
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// User routes
router.get('/profile', authenticate, getProfile);
router.get('/favorites', authenticate, getFavorites);
router.post('/favorites/:productId', authenticate, addToFavorites);
router.delete('/favorites/:productId', authenticate, removeFromFavorites);
router.post('/redeem-coins', authenticate, redeemCoins);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), getAllUsers);
router.get('/admin/:id', authenticate, authorize('admin'), getUser);
router.put('/admin/:id', authenticate, authorize('admin'), updateUser);
router.delete('/admin/:id', authenticate, authorize('admin'), deleteUser);

export default router;