import axios from "axios";

/**
 * We are using COOKIE-BASED AUTH.
 * Frontend and backend are same-origin via Nginx.
 * So:
 *  ❌ No Authorization header
 *  ❌ No localStorage token
 *  ✅ httpOnly cookie only
 */

// Always use relative /api (nginx proxies to backend)
const API_URL = "/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ VERY IMPORTANT
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle API errors cleanly
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const url = error?.config?.url || "";

      // /me can fail when user is not logged in → ignore
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