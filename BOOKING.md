# Booking & Razorpay Integration

## Overview

ServiceHub includes a calendar + time slot booking flow with Razorpay payment integration.

## Setup

### 1. Install Razorpay (backend)

```bash
cd server
npm install razorpay
```

### 2. Add Razorpay keys to `.env`

Get your keys from [Razorpay Dashboard](https://dashboard.razorpay.com/):

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Flow

1. **Provider Detail** → Logged-in users with role `user` see "Book Now" button
2. **Book Service** (`/provider/:id/book`) → Select date and time slot
3. **Availability Check** → Occupied slots show "Occupied", free slots are selectable
4. **Proceed to Pay** → Razorpay checkout opens
5. **Verify** → On success, booking is confirmed and user is redirected to dashboard
6. **My Bookings** (`/user/bookings`) → View all bookings

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/booking/availability/:providerId?date=&timeSlot=` | Check if slot is free |
| GET | `/api/booking/slots/:providerId?date=` | Get booked slots for a date |
| POST | `/api/booking/create-order` | Create Razorpay order (body: providerId, date, timeSlot, amount) |
| POST | `/api/booking/verify-payment` | Verify payment and confirm booking |
| GET | `/api/booking/my-bookings` | Get user's bookings |
| GET | `/api/booking/razorpay-key` | Get Razorpay key for frontend |

## Time Slots

Default slots: 09:00–10:00, 10:00–11:00, … 17:00–18:00 (configurable in `server/controllers/bookingController.js`).

## Database

- **Booking** model: user, provider, date (YYYY-MM-DD), timeSlot, amount, status, razorpay fields.
