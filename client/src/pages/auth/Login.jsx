import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  loginProvider,
  loginAdmin,
} from "../../redux/slices/authSlice";
import {
  FiMail,
  FiLock,
  FiUser,
  FiBriefcase,
  FiShield,
  FiArrowRight,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, user } = useSelector((state) => state.auth);

  /* 🔥 REDIRECT AFTER LOGIN (SAFE) */
  useEffect(() => {
    if (!user) return;

    if (user.role === "user") navigate("/user/dashboard");
    if (user.role === "provider") navigate("/provider/dashboard");
    if (user.role === "admin") navigate("/admin/dashboard");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.role === "user") {
        await dispatch(
          loginUser({
            email: formData.email,
            password: formData.password,
          })
        ).unwrap();
      } else if (formData.role === "provider") {
        await dispatch(
          loginProvider({
            email: formData.email,
            password: formData.password,
          })
        ).unwrap();
      } else if (formData.role === "admin") {
        await dispatch(
          loginAdmin({
            email: formData.email,
            password: formData.password,
          })
        ).unwrap();
      }
      // ❌ navigate yahan se hata diya (IMPORTANT)
    } catch (error) {
      console.error("Login failed (unwrap):", error);
    }
  };

  const roleOptions = [
    {
      value: "user",
      label: "User",
      icon: FiUser,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
    },
    {
      value: "provider",
      label: "Service Provider",
      icon: FiBriefcase,
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
    },
    {
      value: "admin",
      label: "Admin",
      icon: FiShield,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-4xl font-bold text-primary-700">
              ServiceHub
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ROLE */}
            <div className="grid grid-cols-3 gap-3">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const active = formData.role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: opt.value })
                    }
                    className={`p-3 rounded-xl border-2 transition ${
                      active
                        ? `${opt.borderColor} ${opt.bgColor}`
                        : "border-gray-200"
                    }`}
                  >
                    <Icon className="mx-auto mb-1" />
                    <span className="text-xs font-semibold">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {loading ? "Signing in..." : "Sign in"}
              <FiArrowRight />
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;