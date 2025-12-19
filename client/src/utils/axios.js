import axios from "axios";

// In local dev, ALWAYS use relative "/api" so Vite proxy forwards to localhost:5000,
// even if a system-level VITE_API_URL is set (common cause of calls going to Render).
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// In prod, set VITE_API_URL to your deployed backend + "/api".
const API_URL = isLocalhost ? "/api" : import.meta.env.VITE_API_URL || "/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ cookie auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Bearer token (fallback when cookies aren't sent)
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token && token !== "null" && token !== "undefined") {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore storage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress console errors for expected 401s (not logged in)
    // Only log unexpected errors
    if (error?.response?.status === 401) {
      // Expected 401s are handled by the calling code, don't spam console
      // Only log if it's not a /me endpoint (which is expected to fail when not logged in)
      const url = error?.config?.url || "";
      if (!url.includes("/me")) {
        console.error("Authentication error:", error?.response?.data?.message || "Unauthorized");
      }
    } else if (error?.response?.status >= 500) {
      // Log server errors
      console.error("Server error:", error?.response?.data?.message || "Internal server error");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
