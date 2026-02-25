import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../../redux/slices/userSlice';
import { FiUser, FiHeart, FiSearch, FiMail, FiPhone, FiMapPin, FiArrowRight, FiCalendar } from 'react-icons/fi';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const cards = [
    {
      icon: FiUser,
      title: 'My Profile',
      description: 'View and edit your profile information',
      link: '/user/profile',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: FiHeart,
      title: 'Favorites',
      description: `${profile?.favorites?.length || 0} saved providers`,
      link: '/user/favorites',
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: FiSearch,
      title: 'Search Services',
      description: 'Find service providers near you',
      link: '/search',
      gradient: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: FiCalendar,
      title: 'My Bookings',
      description: 'View your service bookings',
      link: '/user/bookings',
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
            User Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Welcome back! Manage your account and services</p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={index}
                to={card.link}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-white/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 ${card.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className={`text-3xl bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{card.title}</h2>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <div className="flex items-center text-primary-600 font-semibold">
                  <span>View Details</span>
                  <FiArrowRight className="ml-2" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Profile Info Card */}
        {profile && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 animate-fade-in-up animation-delay-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiUser className="text-primary-600" /> Quick Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                  <FiUser className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-bold text-gray-900">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FiMail className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-lg font-bold text-gray-900">{profile.email}</p>
                </div>
              </div>
              {profile.phone && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <FiPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="text-lg font-bold text-gray-900">{profile.phone}</p>
                  </div>
                </div>
              )}
              {profile.address && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <FiMapPin className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="text-lg font-bold text-gray-900">{profile.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
