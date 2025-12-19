import axios from "axios";

// In local dev, ALWAYS use relative "/api" so Vite proxy forwards to localhost:5000,
// even if a system-level VITE_API_URL is set (common cause of calls going to Render).
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// In prod, set VITE_API_URL to your deployed backend + "/api".
// const API_URL = isLocalhost ? "/api" : import.meta.env.VITE_API_URL || "/api";

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

export default axiosInstance;
