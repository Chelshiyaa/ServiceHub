import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
      // YYYY-MM-DD format for timezone-free availability checks
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true,
      // e.g. "09:00-10:00", "10:00-11:00"
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound unique index: same provider can't have double booking for same slot
bookingSchema.index({ provider: 1, date: 1, timeSlot: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
