import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  searchServices,
  toggleFavorite,
  changePassword,
} from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/search', searchServices);
router.post('/favorites/:id', toggleFavorite);
router.put('/change-password', changePassword);

export default router;

