import express from 'express';
import {
  checkAvailability,
  createOrder,
  verifyPayment,
  getMyBookings,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.get('/availability/:providerId', checkAvailability);
router.post('/create-order', authorize('user'), createOrder);
router.post('/verify-payment', authorize('user'), verifyPayment);
router.get('/my-bookings', authorize('user'), getMyBookings);

export default router;
