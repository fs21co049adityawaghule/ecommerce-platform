const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  toggleFavorite,
  getFavorites
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/favorites/:productId', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

module.exports = router;