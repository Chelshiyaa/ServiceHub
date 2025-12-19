import express from 'express';
import {
  registerUser,
  loginUser,
  registerProvider,
  loginProvider,
  loginAdmin,
  logout,
  getResetToken,
  resetPassword,
  getCategories,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
router.get("/me", protect, getMe);
router.get('/categories', getCategories);
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.post('/provider/register', registerProvider);
router.post('/provider/login', loginProvider);
router.post('/admin/login', loginAdmin);
router.post('/logout', protect, logout);
router.post('/reset-token', getResetToken);
router.post('/reset-password/:resettoken', resetPassword);

export default router;

