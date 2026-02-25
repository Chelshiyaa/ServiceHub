import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { FiArrowLeft, FiCalendar, FiClock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { TIME_SLOTS } from '../../constants/booking';

const BookingPage = () => {
  const { id: providerId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await axiosInstance.get(`/provider/${providerId}`);
        setProvider(res.data.data);
      } catch (err) {
        toast.error('Failed to load provider');
        navigate('/search');
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [providerId, navigate]);

  useEffect(() => {
    if (!selectedDate || !providerId) return;
    setSlotsLoading(true);
    axiosInstance
      .get(`/booking/availability/${providerId}?date=${selectedDate}`)
      .then((res) => setSlots(res.data.data || []))
      .catch(() => {
        toast.error('Failed to load availability');
        setSlots(TIME_SLOTS.map((slot) => ({ slot, available: false })));
      })
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, providerId]);

  const getAmountFromPricing = () => {
    if (!provider?.pricing) return 500;
    const match = provider.pricing.match(/\d+/);
    return match ? parseInt(match[0], 10) : 500;
  };

  const amount = getAmountFromPricing();

  const handleProceedToPay = async () => {
    if (!window.Razorpay) {
      toast.error('Payment gateway is loading. Please try again.');
      return;
    }
    setPaymentLoading(true);
    try {
      const { data } = await axiosInstance.post('/booking/create-order', {
        providerId,
        date: selectedDate,
        timeSlot: selectedSlot,
        amount,
      });

      const { orderId, key } = data.data;
      const rzp = new window.Razorpay({
        key,
        amount: data.data.amount,
        currency: 'INR',
        order_id: orderId,
        name: 'ServiceHub',
        description: `Booking with ${provider?.serviceName || 'Provider'}`,
        handler: async (response) => {
          try {
            await axiosInstance.post('/booking/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              providerId,
              date: selectedDate,
              timeSlot: selectedSlot,
              amount,
            });
            toast.success('Booking confirmed!');
            navigate('/user/bookings');
          } catch (err) {
            toast.error(err?.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: provider?.ownerName || '',
          contact: provider?.phone || '',
        },
      });
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create order');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!provider) return null;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link
          to={`/provider/${providerId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <FiArrowLeft /> Back to provider
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
            <h1 className="text-2xl font-bold">{provider.serviceName}</h1>
            <p className="text-primary-100">{provider.ownerName}</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Step 1: Date picker */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiCalendar className="text-primary-600" />
                Step 1: Select date
              </h2>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Step 2: Time slot picker */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiClock className="text-primary-600" />
                Step 2: Select time slot
              </h2>
              {!selectedDate ? (
                <p className="text-gray-500">Select a date first</p>
              ) : slotsLoading ? (
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <div
                      key={slot}
                      className="h-12 rounded-lg bg-gray-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map(({ slot, available }) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => available && setSelectedSlot(slot)}
                      disabled={!available}
                      className={`relative px-4 py-3 rounded-xl font-medium transition-all ${
                        available
                          ? selectedSlot === slot
                            ? 'bg-primary-600 text-white ring-2 ring-primary-400 ring-offset-2'
                            : 'bg-primary-50 text-primary-800 hover:bg-primary-100'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70'
                      }`}
                    >
                      {slot}
                      {!available && (
                        <span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                          Occupied
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Amount & Pay */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiCheck className="text-primary-600" />
                Step 3: Confirm & pay
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Amount</span>
                  <span className="font-bold text-xl">₹{amount}</span>
                </div>
                <button
                  onClick={handleProceedToPay}
                  disabled={
                    !selectedDate ||
                    !selectedSlot ||
                    paymentLoading ||
                    slotsLoading
                  }
                  className="w-full py-4 px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {paymentLoading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Pay'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
