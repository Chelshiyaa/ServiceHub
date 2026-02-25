import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import {
  FiMapPin,
  FiStar,
  FiCalendar,
  FiClock,
  FiArrowLeft,
  FiCheck,
  FiX,
  FiCreditCard,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const TIME_SLOTS = [
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

const BookService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    if (document.querySelector('script[src*="razorpay.com"]')) return;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await axiosInstance.get(`/provider/${id}`);
        setProvider(response.data.data);
      } catch (error) {
        toast.error('Failed to load provider');
        navigate('/search');
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id, navigate]);

  useEffect(() => {
    if (!date || !id) return;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setBookedSlots([]);
      setTimeSlot('');
      setSlotError(null);
      try {
        const res = await axiosInstance.get(`/booking/slots/${id}?date=${date}`);
        setBookedSlots(res.data.data.bookedSlots || []);
      } catch {
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [date, id]);

  const handleTimeSelect = (slot) => {
    if (bookedSlots.includes(slot)) return;
    setTimeSlot(slot);
    setSlotError(null);
  };

  const getAmount = () => {
    if (!provider?.pricing) return 500;
    const match = provider.pricing.match(/₹?\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 500;
  };

  const handleProceedToPay = async () => {
    if (!date || !timeSlot) {
      setSlotError('Please select a date and time slot');
      return;
    }

    setPaymentLoading(true);
    try {
      const orderRes = await axiosInstance.post('/booking/create-order', {
        providerId: id,
        date,
        timeSlot,
        amount: getAmount(),
      });

      const { orderId, amount } = orderRes.data.data;

      const keyRes = await axiosInstance.get('/booking/razorpay-key');
      const { keyId } = keyRes.data.data;

      const options = {
        key: keyId,
        amount,
        currency: 'INR',
        name: provider.serviceName,
        description: `Booking for ${date} at ${timeSlot}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            await axiosInstance.post('/booking/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: orderRes.data.data.bookingId,
            });
            toast.success('Booking confirmed!');
            navigate('/user/dashboard');
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      if (msg.includes('occupied') || msg.includes('busy')) {
        setSlotError(msg);
        setTimeSlot('');
        setBookedSlots((prev) => [...prev, timeSlot]);
      } else {
        toast.error(msg);
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading || !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={`/provider/${id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <FiArrowLeft /> Back to Provider
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
            <h1 className="text-2xl font-bold">Book Service</h1>
            <div className="flex items-center gap-3 mt-3">
              {provider.profilePhoto && (
                <img
                  src={provider.profilePhoto.url}
                  alt={provider.serviceName}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white/30"
                />
              )}
              <div>
                <p className="font-semibold text-lg">{provider.serviceName}</p>
                <p className="text-primary-100">{provider.ownerName}</p>
                {provider.pricing && (
                  <p className="font-bold mt-1">{provider.pricing}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Date Picker */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <FiCalendar className="text-primary-600" /> Select Date
              </label>
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
              />
            </div>

            {/* Time Slots */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <FiClock className="text-primary-600" /> Select Time
              </label>
              {!date ? (
                <p className="text-gray-500 py-4">Please select a date first</p>
              ) : loadingSlots ? (
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <div
                      key={slot}
                      className="py-3 rounded-xl bg-gray-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const occupied = bookedSlots.includes(slot);
                    const selected = timeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleTimeSelect(slot)}
                        disabled={occupied}
                        className={`
                          py-3 rounded-xl font-medium transition-all
                          ${occupied
                            ? 'bg-red-50 text-red-400 cursor-not-allowed line-through'
                            : selected
                            ? 'bg-primary-600 text-white ring-2 ring-primary-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                          }
                        `}
                      >
                        {occupied ? (
                          <span className="flex items-center justify-center gap-1">
                            <FiX size={14} /> Occupied
                          </span>
                        ) : (
                          slot
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {slotError && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 border border-red-100">
                <FiX className="flex-shrink-0" />
                <p>{slotError}</p>
              </div>
            )}

            {/* Amount & Pay */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">Amount</span>
                <span className="text-xl font-bold text-primary-700">
                  ₹{getAmount()}
                </span>
              </div>
              <button
                onClick={handleProceedToPay}
                disabled={!date || !timeSlot || paymentLoading}
                className="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {paymentLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <FiCreditCard size={20} /> Proceed to Pay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;
