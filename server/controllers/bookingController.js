import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Provider from '../models/Provider.js';

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// Time slots: 9:00 AM to 6:00 PM, 1-hour each
export const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00',
];

// @desc    Check availability for all slots on a date
// @route   GET /api/booking/availability/:providerId?date=YYYY-MM-DD
// @access  Private
export const checkAvailability = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date (YYYY-MM-DD)',
      });
    }

    const provider = await Provider.findById(providerId);
    if (!provider || provider.status !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }

    const dateStr = String(date).slice(0, 10); // YYYY-MM-DD

    const booked = await Booking.find({
      provider: providerId,
      date: dateStr,
      status: { $in: ['pending', 'confirmed', 'completed'] },
    }).select('timeSlot');

    const bookedSlots = new Set(booked.map((b) => b.timeSlot));

    const slots = TIME_SLOTS.map((slot) => ({
      slot,
      available: !bookedSlots.has(slot),
    }));

    res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Razorpay order
// @route   POST /api/booking/create-order
// @body    providerId, date, timeSlot, amount
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { providerId, date, timeSlot, amount } = req.body;

    if (!providerId || !date || !timeSlot || amount == null || amount === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide providerId, date, timeSlot and amount',
      });
    }

    if (!TIME_SLOTS.includes(timeSlot)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time slot',
      });
    }

    const provider = await Provider.findById(providerId);
    if (!provider || provider.status !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }

    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server .env',
      });
    }

    const dateStr = String(date).slice(0, 10);

    const existing = await Booking.findOne({
      provider: providerId,
      date: dateStr,
      timeSlot,
      status: { $in: ['pending', 'confirmed', 'completed'] },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This slot is already occupied. Please choose a different date or time.',
      });
    }

    const amountInPaise = Math.round(parseFloat(amount) * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `bk${req.user._id.toString().slice(-10)}${Date.now().toString().slice(-8)}`,
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: amountInPaise,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment and create confirmed booking
// @route   POST /api/booking/verify-payment
// @body    razorpay_order_id, razorpay_payment_id, razorpay_signature, providerId, date, timeSlot, amount
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      providerId,
      date,
      timeSlot,
      amount,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !providerId ||
      !date ||
      !timeSlot ||
      amount == null ||
      amount === ''
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details',
      });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    const dateStr = String(date).slice(0, 10);

    // Re-check availability (slot could have been taken between create-order and payment)
    const existing = await Booking.findOne({
      provider: providerId,
      date: dateStr,
      timeSlot,
      status: { $in: ['pending', 'confirmed', 'completed'] },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This slot is no longer available. Please choose another.',
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      provider: providerId,
      date: dateStr,
      timeSlot,
      amount: parseFloat(amount),
      currency: 'INR',
      status: 'confirmed',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    await booking.populate('provider', 'serviceName ownerName profilePhoto pricing');

    res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/booking/my-bookings
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('provider', 'serviceName ownerName profilePhoto pricing')
      .populate('provider.category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
