import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser, registerProvider } from '../../redux/slices/authSlice';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEye, FiEyeOff, 
  FiBriefcase, FiFileText, FiTag, FiDollarSign, FiNavigation,
  FiArrowRight, FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    role: 'user',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    // Provider specific
    ownerName: '',
    serviceName: '',
    description: '',
    category: '',
    pricing: '',
    lat: '',
    lng: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success('Location captured successfully!');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      if (formData.role === 'user') {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          geolocation: formData.lat && formData.lng ? {
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
          } : undefined,
        };
        await dispatch(registerUser(userData)).unwrap();
        navigate('/user/dashboard');
      } else if (formData.role === 'provider') {
        if (!formData.lat || !formData.lng) {
          toast.error('Please get your location');
          return;
        }
        const providerData = {
          ownerName: formData.ownerName,
          serviceName: formData.serviceName,
          description: formData.description,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          geolocation: {
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
          },
          category: formData.category,
          pricing: formData.pricing,
        };
        await dispatch(registerProvider(providerData)).unwrap();
        navigate('/provider/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: 'Weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 2, text: 'Medium', color: 'bg-yellow-500' };
    return { strength: 3, text: 'Strong', color: 'bg-green-500' };
  };

  const passwordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-3xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-lg mb-4">
              <span className="text-3xl font-bold text-white">SH</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
              ServiceHub
            </h1>
          </Link>
          <p className="text-gray-600 text-lg font-medium">Create your account and get started</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="animate-fade-in-up">
              <label className="block text-sm font-bold text-gray-700 mb-4">
                I want to register as
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    formData.role === 'user'
                      ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'
                  }`}
                >
                  <FiUser
                    className={`mx-auto mb-3 transition-colors ${
                      formData.role === 'user' ? 'text-primary-600' : 'text-gray-400'
                    }`}
                    size={32}
                  />
                  <span
                    className={`text-sm font-bold block ${
                      formData.role === 'user' ? 'text-primary-700' : 'text-gray-600'
                    }`}
                  >
                    User
                  </span>
                  {formData.role === 'user' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'provider' })}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    formData.role === 'provider'
                      ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50'
                  }`}
                >
                  <FiBriefcase
                    className={`mx-auto mb-3 transition-colors ${
                      formData.role === 'provider' ? 'text-green-600' : 'text-gray-400'
                    }`}
                    size={32}
                  />
                  <span
                    className={`text-sm font-bold block ${
                      formData.role === 'provider' ? 'text-green-700' : 'text-gray-600'
                    }`}
                  >
                    Service Provider
                  </span>
                  {formData.role === 'provider' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* User Form Fields */}
            {formData.role === 'user' ? (
              <div className="space-y-5 animate-fade-in-up animation-delay-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                      <FiUser className="inline mr-2" /> Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                      <FiMail className="inline mr-2" /> Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                      <FiPhone className="inline mr-2" /> Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="+91 1234567890"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2">
                      <FiMapPin className="inline mr-2" /> Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Your address"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Provider Form Fields */
              <div className="space-y-5 animate-fade-in-up animation-delay-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="ownerName" className="block text-sm font-bold text-gray-700 mb-2">
                      <FiUser className="inline mr-2" /> Owner Name
                    </label>
                    <input
                      id="ownerName"
                      name="ownerName"
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Owner's name"
                    />
                  </div>
                  <div>
                    <label htmlFor="serviceName" className="block text-sm font-bold text-gray-700 mb-2">
                      <FiBriefcase className="inline mr-2" /> Service Name
                    </label>
                    <input
                      id="serviceName"
                      name="serviceName"
                      type="text"
                      required
                      value={formData.serviceName}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Your service name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                    <FiFileText className="inline mr-2" /> Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Describe your services..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                      <FiMail className="inline mr-2" /> Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="service@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                      <FiPhone className="inline mr-2" /> Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2">
                    <FiMapPin className="inline mr-2" /> Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Your business address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <FiNavigation className="inline mr-2" /> Location
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="lat"
                      name="lat"
                      type="number"
                      step="any"
                      required
                      value={formData.lat}
                      onChange={handleChange}
                      placeholder="Latitude"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                    <input
                      id="lng"
                      name="lng"
                      type="number"
                      step="any"
                      required
                      value={formData.lng}
                      onChange={handleChange}
                      placeholder="Longitude"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={loadingLocation}
                      className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {loadingLocation ? '...' : '📍 Get'}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">
                      <FiTag className="inline mr-2" /> Category ID
                    </label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Enter category ID"
                      className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="pricing" className="block text-sm font-bold text-gray-700 mb-2">
                      <FiDollarSign className="inline mr-2" /> Pricing
                    </label>
                    <input
                      id="pricing"
                      name="pricing"
                      type="text"
                      value={formData.pricing}
                      onChange={handleChange}
                      placeholder="e.g., ₹500/hour"
                      className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="space-y-5 animate-fade-in-up animation-delay-200">
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                  <FiLock className="inline mr-2" /> Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= passwordStrength().strength
                              ? passwordStrength().color
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      Password strength: <span className="font-semibold">{passwordStrength().text}</span>
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                  <FiLock className="inline mr-2" /> Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                      formData.confirmPassword
                        ? passwordMatch
                          ? 'border-green-500'
                          : 'border-red-500'
                        : 'border-gray-200'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p className={`text-xs mt-1 ${passwordMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 hover:from-primary-700 hover:via-primary-800 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
            >
              <span>Create Account</span>
              <FiArrowRight className="h-5 w-5" />
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center animate-fade-in-up animation-delay-300">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default Register;
