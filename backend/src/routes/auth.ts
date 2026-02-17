import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress,
  claimReward
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/address', authenticate, addAddress);
router.delete('/address/:index', authenticate, deleteAddress);
router.post('/claim-reward/:milestone', authenticate, claimReward);

export default router;