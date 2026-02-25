import axios from "axios";

/**
 * COOKIE-BASED AUTH (httpOnly cookie).
 *
 * - In development: we use Vite's proxy → `/api`
 * - In production: set `VITE_API_URL` to your backend's full URL (including `/api`)
 *   e.g. VITE_API_URL="https://your-backend-domain.com/api"
 */

// If VITE_API_URL is defined, use that. Otherwise fall back to relative `/api` (dev with proxy).
const API_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  "/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const url = error?.config?.url || "";

      // `/me` can fail when user is not logged in – ignore logging in that case
      if (!url.includes("/me")) {
        console.error(
          "Authentication error:",
          error?.response?.data?.message || "Unauthorized"
        );
      }
    } else if (error?.response?.status >= 500) {
      console.error(
        "Server error:",
        error?.response?.data?.message || "Internal server error"
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;