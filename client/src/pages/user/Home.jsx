import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSearch, FiMapPin, FiZap, FiShield, FiUsers, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleGetLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success('Location captured!');
          setLoadingLocation(false);
        },
        (error) => {
          toast.error('Error getting location: ' + error.message);
          setLoadingLocation(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
      setLoadingLocation(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to search for services');
      navigate('/login');
      return;
    }
    
    const params = new URLSearchParams();
    if (searchQuery) params.append('service', searchQuery);
    if (location.lat) params.append('lat', location.lat);
    if (location.lng) params.append('lng', location.lng);
    params.append('radius', '50');
    navigate(`/search?${params.toString()}`);
  };

  const features = [
    {
      icon: FiZap,
      title: 'Easy Search',
      description: 'Find services by type, location, and distance with our powerful search engine.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: FiShield,
      title: 'Trusted Providers',
      description: 'All service providers are verified and reviewed by our community.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: FiUsers,
      title: 'Local Services',
      description: 'Connect with professionals in your neighborhood quickly and easily.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent">
            Find Local Services
            <br />
            <span className="text-5xl md:text-6xl">Near You</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-medium">
            Connect with trusted service providers in your area. Search, compare, and book services instantly.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto animate-fade-in-up animation-delay-200">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-2 border border-white/20">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for services (e.g., plumber, electrician, tutor)"
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={loadingLocation}
                  className="px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  <FiMapPin className="text-xl" />
                  {loadingLocation ? 'Getting...' : 'Location'}
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Search
                  <FiArrowRight className="text-xl" />
                </button>
              </div>
            </div>
            {location.lat && (
              <p className="mt-4 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
                📍 Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            )}
          </form>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-400">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className={`text-3xl bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Section - Only show when user is NOT logged in */}
        {!user && (
          <div className="mt-24 text-center animate-fade-in-up animation-delay-600">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-12 shadow-2xl">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-primary-100 mb-8">Join thousands of users finding the best local services</p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/register"
                  className="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Sign Up Free
                </a>
                <a
                  href="/search"
                  className="px-8 py-4 bg-white/20 text-white border-2 border-white rounded-xl font-bold hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  Browse Services
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};

export default Home;
