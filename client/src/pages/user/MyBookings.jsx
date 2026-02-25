import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { FiCalendar, FiClock, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/booking/my-bookings')
      .then((res) => setBookings(res.data.data || []))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => {
    if (!d) return '-';
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to="/user/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <FiArrowLeft /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No bookings yet</p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              Find a service
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  {b.provider?.profilePhoto?.url && (
                    <img
                      src={b.provider.profilePhoto.url}
                      alt={b.provider.serviceName}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {b.provider?.serviceName || 'Service'}
                    </h3>
                    <p className="text-gray-600">{b.provider?.ownerName}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiCalendar /> {formatDate(b.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock /> {b.timeSlot}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusStyle(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                    <p className="font-bold text-primary-700">
                      ₹{b.amount}
                    </p>
                    {b.provider && (
                      <Link
                        to={`/provider/${b.provider._id}`}
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        <FiMapPin /> View provider
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
