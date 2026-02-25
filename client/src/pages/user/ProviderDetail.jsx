import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../utils/axios';
import { toggleFavorite } from '../../redux/slices/userSlice';
import { FiMapPin, FiStar, FiHeart, FiPhone, FiMail, FiCheckCircle, FiClock, FiXCircle, FiArrowLeft, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProviderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.user);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        // Public endpoint for users browsing providers
        const response = await axiosInstance.get(`/provider/${id}`);
        setProvider(response.data.data);
      } catch (error) {
        console.error('Failed to fetch provider:', error);
        toast.error('Failed to load provider details');
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  const isFavorite = favorites?.some((fav) => fav._id === id || fav === id);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(id));
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return {
          icon: FiCheckCircle,
          text: 'Verified',
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-50',
        };
      case 'pending':
        return {
          icon: FiClock,
          text: 'Pending',
          color: 'from-yellow-500 to-yellow-600',
          bgColor: 'bg-yellow-50',
        };
      case 'rejected':
        return {
          icon: FiXCircle,
          text: 'Rejected',
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-50',
        };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading provider details...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-4">Provider not found</p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <FiArrowLeft /> Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(provider.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <FiArrowLeft /> Back to Search
        </Link>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-8 text-white relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={handleToggleFavorite}
                className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                  isFavorite ? 'bg-red-500 shadow-lg' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <FiHeart size={24} fill={isFavorite ? 'white' : 'none'} />
              </button>
            </div>
            <div className="flex items-start gap-4">
              {provider.profilePhoto && (
                <img
                  src={provider.profilePhoto.url}
                  alt={provider.serviceName}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{provider.serviceName}</h1>
                  {statusConfig && (
                    <div className={`px-4 py-2 ${statusConfig.bgColor} rounded-xl flex items-center gap-2`}>
                      <statusConfig.icon className={`text-xl bg-gradient-to-r ${statusConfig.color} bg-clip-text text-transparent`} />
                      <span className="font-bold text-gray-800">{statusConfig.text}</span>
                    </div>
                  )}
                </div>
                <p className="text-primary-100 text-lg">{provider.ownerName}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{provider.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiMail className="text-blue-600" /> Contact Information
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="font-semibold">{provider.email}</p>
                  <p className="font-semibold">{provider.phone}</p>
                  <p className="flex items-start gap-2">
                    <FiMapPin className="text-blue-600 mt-1" />
                    <span>{provider.address}</span>
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiStar className="text-green-600" /> Service Details
                </h3>
                {provider.status === 'approved' && (
                  <Link
                    to={`/book/provider/${id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold mb-4"
                  >
                    <FiCalendar /> Book Now
                  </Link>
                )}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FiStar className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-lg">
                      {provider.ratings?.average?.toFixed(1) || '0.0'} ({provider.ratings?.count || 0} reviews)
                    </span>
                  </div>
                  {provider.pricing && (
                    <p className="text-primary-700 font-bold text-lg">{provider.pricing}</p>
                  )}
                  {provider.experience && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Experience:</span> {provider.experience}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            {provider.skills && provider.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-3">
                  {provider.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 rounded-xl text-sm font-semibold shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Book Now - only for logged-in users with role user */}
            {user?.role === 'user' && (
              <div className="mb-8">
                <Link
                  to={`/provider/${id}/book`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all"
                >
                  <FiClock /> Book Now
                </Link>
                <p className="text-gray-500 text-sm mt-2">
                  Select date & time and pay securely with Razorpay
                </p>
              </div>
            )}

            {/* Service Images */}
            {provider.serviceImages && provider.serviceImages.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Service Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {provider.serviceImages.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Service ${index + 1}`}
                      className="w-full h-48 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
