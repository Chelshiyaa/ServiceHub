import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchServices } from '../../redux/slices/userSlice';
import { FiMapPin, FiStar, FiHeart, FiFilter, FiSearch, FiSliders } from 'react-icons/fi';
import { toggleFavorite } from '../../redux/slices/userSlice';

const Search = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults, favorites } = useSelector((state) => state.user);
  const [filters, setFilters] = useState({
    service: searchParams.get('service') || '',
    lat: searchParams.get('lat') || '',
    lng: searchParams.get('lng') || '',
    radius: searchParams.get('radius') || '50',
    minRating: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = {};
    if (filters.service) params.service = filters.service;
    if (filters.lat) params.lat = filters.lat;
    if (filters.lng) params.lng = filters.lng;
    if (filters.radius) params.radius = filters.radius;
    if (filters.minRating) params.minRating = filters.minRating;

    dispatch(searchServices(params));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const isFavorite = (providerId) => {
    return favorites?.some((fav) => fav._id === providerId || fav === providerId);
  };

  const handleToggleFavorite = (e, providerId) => {
    e.preventDefault();
    dispatch(toggleFavorite(providerId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
            Search Services
          </h1>
          <p className="text-gray-600">Find the perfect service provider near you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FiSliders className="text-primary-600" /> Filters
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <FiFilter />
                </button>
              </div>
              <div className={`space-y-5 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Service Type
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="service"
                      value={filters.service}
                      onChange={handleFilterChange}
                      placeholder="Search service"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Radius (km)
                  </label>
                  <input
                    type="number"
                    name="radius"
                    value={filters.radius}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <input
                    type="number"
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0.0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Results ({searchResults?.length || 0})
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {searchResults && searchResults.length > 0 ? (
                searchResults.map((provider, index) => (
                  <Link
                    key={provider._id}
                    to={`/provider/${provider._id}`}
                    className="block bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-white/20 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">{provider.serviceName}</h3>
                          {provider.status === 'approved' && (
                            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full shadow-lg">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">{provider.description}</p>
                        <div className="flex flex-wrap items-center gap-6 text-sm">
                          {provider.geolocation && (
                            <span className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                              <FiMapPin className="text-primary-600" />
                              {provider.distance
                                ? `${provider.distance.toFixed(2)} km away`
                                : 'Location available'}
                            </span>
                          )}
                          <span className="flex items-center gap-2 text-gray-600 bg-yellow-50 px-3 py-1.5 rounded-lg">
                            <FiStar className="text-yellow-500 fill-yellow-500" />
                            <span className="font-bold">{provider.ratings?.average?.toFixed(1) || '0.0'}</span>
                            <span className="text-gray-500">({provider.ratings?.count || 0} reviews)</span>
                          </span>
                          {provider.pricing && (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 font-bold rounded-lg">
                              {provider.pricing}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleToggleFavorite(e, provider._id)}
                        className={`ml-4 p-3 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                          isFavorite(provider._id)
                            ? 'text-red-500 bg-red-50 shadow-lg'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <FiHeart size={24} fill={isFavorite(provider._id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                  <FiSearch className="mx-auto text-6xl text-gray-300 mb-4" />
                  <p className="text-xl text-gray-500 font-semibold mb-2">No services found</p>
                  <p className="text-gray-400">Try adjusting your filters to find more results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Search;
