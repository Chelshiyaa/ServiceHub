import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import {
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiSearch,
  FiBriefcase,
  FiShield,
} from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔥 MERGED LOGOUT (API + Redux + Redirect)
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "provider") return "/provider/dashboard";
    return "/user/dashboard";
  };

  const getRoleIcon = () => {
    if (!user) return null;
    if (user.role === "admin") return <FiShield className="text-purple-600" />;
    if (user.role === "provider")
      return <FiBriefcase className="text-green-600" />;
    return <FiUser className="text-blue-600" />;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                <span className="text-xl font-bold text-white">SH</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                ServiceHub
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600 flex items-center gap-2"
            >
              <FiHome /> Home
            </Link>

            <Link
              to="/search"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600 flex items-center gap-2"
            >
              <FiSearch /> Search
            </Link>

            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600 flex items-center gap-2"
                >
                  {getRoleIcon()}
                  Dashboard
                </Link>

                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-lg">
                    {getRoleIcon()}
                    <span className="text-sm font-semibold text-gray-700 capitalize">
                      {user.role}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-primary-50"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl font-semibold hover:bg-primary-50 flex items-center gap-2"
            >
              <FiHome /> Home
            </Link>

            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl font-semibold hover:bg-primary-50 flex items-center gap-2"
            >
              <FiSearch /> Search
            </Link>

            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-semibold hover:bg-primary-50 flex items-center gap-2"
                >
                  {getRoleIcon()} Dashboard
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-semibold hover:bg-primary-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-semibold text-white bg-primary-600 text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
