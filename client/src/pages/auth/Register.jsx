import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, registerProvider } from '../../redux/slices/authSlice';
import axiosInstance from '../../utils/axios';
import { FiMail, FiLock, FiUser, FiBriefcase, FiPhone, FiMapPin, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    role: 'user',
    // User fields
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    // Provider fields
    ownerName: '',
    serviceName: '',
    description: '',
    category: '',
    pricing: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/auth/categories');
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      if (formData.role === 'user') {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
        };
        await dispatch(registerUser(userData)).unwrap();
        navigate('/user/dashboard');
      } else if (formData.role === 'provider') {
        const providerData = {
          ownerName: formData.ownerName,
          serviceName: formData.serviceName,
          description: formData.description,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          category: formData.category,
          pricing: formData.pricing || undefined,
          geolocation: {
            lat: 0, // Default - can be enhanced with geocoding
            lng: 0,
          },
        };
        await dispatch(registerProvider(providerData)).unwrap();
        navigate('/provider/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const roleOptions = [
    { value: 'user', label: 'User', icon: FiUser, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-500' },
    { value: 'provider', label: 'Service Provider', icon: FiBriefcase, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-500' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-lg mb-4">
              <span className="text-3xl font-bold text-white">SH</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
              ServiceHub
            </h1>
          </Link>
          <p className="text-gray-600 text-lg font-medium">Create your account to get started</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:shadow-3xl transition-all duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="animate-fade-in-up">
              <label className="block text-sm font-bold text-gray-700 mb-4">
                I want to register as
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.role === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: option.value })}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        isSelected
                          ? `${option.borderColor} ${option.bgColor} shadow-lg scale-105`
                          : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'
                      }`}
                    >
                      <Icon
                        className={`mx-auto mb-2 transition-colors ${
                          isSelected ? 'text-primary-600' : 'text-gray-400'
                        }`}
                        size={28}
                      />
                      <span
                        className={`text-xs font-bold block ${
                          isSelected ? 'text-primary-700' : 'text-gray-600'
                        }`}
                      >
                        {option.label}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User Registration Fields */}
            {formData.role === 'user' && (
              <>
                <div className="animate-fade-in-up animation-delay-100">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className={`h-5 w-5 transition-colors ${formData.name ? 'text-primary-600' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Provider Registration Fields */}
            {formData.role === 'provider' && (
              <>
                <div className="animate-fade-in-up animation-delay-100">
                  <label htmlFor="ownerName" className="block text-sm font-bold text-gray-700 mb-2">
                    Owner Name *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className={`h-5 w-5 transition-colors ${formData.ownerName ? 'text-primary-600' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="ownerName"
                      name="ownerName"
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="animate-fade-in-up animation-delay-100">
                  <label htmlFor="serviceName" className="block text-sm font-bold text-gray-700 mb-2">
                    Service Name *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiBriefcase className={`h-5 w-5 transition-colors ${formData.serviceName ? 'text-primary-600' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="serviceName"
                      name="serviceName"
                      type="text"
                      required
                      value={formData.serviceName}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="My Service Business"
                    />
                  </div>
                </div>

                <div className="animate-fade-in-up animation-delay-100">
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Describe your service..."
                  />
                </div>

                <div className="animate-fade-in-up animation-delay-100">
                  <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="animate-fade-in-up animation-delay-100">
                  <label htmlFor="pricing" className="block text-sm font-bold text-gray-700 mb-2">
                    Pricing
                  </label>
                  <input
                    id="pricing"
                    name="pricing"
                    type="text"
                    value={formData.pricing}
                    onChange={handleChange}
                    className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="e.g., $50/hour or $200/day"
                  />
                </div>
              </>
            )}

            {/* Common Fields */}
            <div className="animate-fade-in-up animation-delay-200">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className={`h-5 w-5 transition-colors ${formData.email ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="animate-fade-in-up animation-delay-300">
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number {formData.role === 'provider' ? '*' : ''}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiPhone className={`h-5 w-5 transition-colors ${formData.phone ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required={formData.role === 'provider'}
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="animate-fade-in-up animation-delay-300">
              <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2">
                Address {formData.role === 'provider' ? '*' : ''}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMapPin className={`h-5 w-5 transition-colors ${formData.address ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required={formData.role === 'provider'}
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="123 Main St, City, State"
                />
              </div>
            </div>

            <div className="animate-fade-in-up animation-delay-400">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className={`h-5 w-5 transition-colors ${formData.password ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <div className="animate-fade-in-up animation-delay-500">
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className={`h-5 w-5 transition-colors ${formData.confirmPassword ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 hover:from-primary-700 hover:via-primary-800 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Sign up</span>
                  <FiArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center animate-fade-in-up animation-delay-600">
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

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <Link to="#" className="text-primary-600 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="#" className="text-primary-600 hover:underline">Privacy Policy</Link>
        </p>
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
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};

export default Register;
