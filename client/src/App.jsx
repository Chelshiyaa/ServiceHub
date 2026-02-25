import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { loadUser } from "./redux/slices/authSlice";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// User Pages
import Home from "./pages/user/Home";
import Search from "./pages/user/Search";
import ProviderDetail from "./pages/user/ProviderDetail";
import BookingPage from "./pages/booking/BookingPage";
import MyBookings from "./pages/user/MyBookings";
import UserDashboard from "./pages/user/UserDashboard";
import UserProfile from "./pages/user/UserProfile";
import Favorites from "./pages/user/Favorites";

// Provider Pages
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderProfile from "./pages/provider/ProviderProfile";
import ProviderServices from "./pages/provider/ProviderServices";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminCategories from "./pages/admin/AdminCategories";

function App() {
  const dispatch = useDispatch();

  // ✅ Cookie-based auto login (runs once)
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/provider/:id" element={<ProviderDetail />} />
          <Route
            path="/book/provider/:id"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <BookingPage />
              </PrivateRoute>
            }
          />

          {/* Protected Search */}
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/bookings"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <MyBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/favorites"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <Favorites />
              </PrivateRoute>
            }
          />

          {/* Provider Routes */}
          <Route
            path="/provider/dashboard"
            element={
              <PrivateRoute allowedRoles={["provider"]}>
                <ProviderDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/profile"
            element={
              <PrivateRoute allowedRoles={["provider"]}>
                <ProviderProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/services"
            element={
              <PrivateRoute allowedRoles={["provider"]}>
                <ProviderServices />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/providers"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminProviders />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminCategories />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;