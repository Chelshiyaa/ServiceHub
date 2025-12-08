import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../../redux/slices/userSlice';
import { FiMapPin, FiStar, FiHeart, FiSearch, FiArrowRight } from 'react-icons/fi';

const Favorites = () => {
  const dispatch = useDispatch();
  const { profile, favorites } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600 text-lg">Your saved service providers</p>
        </div>

        {favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((provider, index) => (
              <Link
                key={provider._id || provider}
                to={`/provider/${provider._id || provider}`}
                className="block bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-white/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {typeof provider === 'object' ? provider.serviceName : 'Loading...'}
                    </h3>
                    {typeof provider === 'object' && provider.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{provider.description}</p>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center ml-4">
                    <FiHeart className="text-red-500" size={24} fill="currentColor" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {typeof provider === 'object' && provider.ratings && (
                    <span className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg">
                      <FiStar className="text-yellow-500 fill-yellow-500" />
                      <span className="font-bold">{provider.ratings.average?.toFixed(1) || '0.0'}</span>
                      <span className="text-gray-500">({provider.ratings.count || 0})</span>
                    </span>
                  )}
                  {typeof provider === 'object' && provider.address && (
                    <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <FiMapPin className="text-primary-600" />
                      <span className="truncate max-w-[150px]">{provider.address}</span>
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center text-primary-600 font-semibold">
                  <span>View Details</span>
                  <FiArrowRight className="ml-2" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 animate-fade-in">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiHeart className="text-red-500" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">No favorites yet</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Start exploring services and add your favorite providers to this list!
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <FiSearch /> Search Services
            </Link>
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
      `}</style>
    </div>
  );
};

export default Favorites;
