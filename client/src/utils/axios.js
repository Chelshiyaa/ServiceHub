import axios from "axios";

/**
 * COOKIE-BASED AUTH (httpOnly cookie).
 *
 * - In development: we use Vite's proxy → `/api`
 * - In production: set `VITE_API_URL` to your backend's base URL
 *   (with or without `/api`; we'll normalize it).
 */

let API_URL = "/api";

if (
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.VITE_API_URL
) {
  const raw = import.meta.env.VITE_API_URL;
  // If it already ends with /api, use as-is. Otherwise append /api.
  API_URL = raw.endsWith("/api")
    ? raw
    : `${raw.replace(/\/$/, "")}/api`;
}

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
      const serverMessage =
        error?.response?.data?.message || "Internal server error";

      // Don't spam console for known optional payment config issue
      if (!serverMessage.includes("Payment is not configured")) {
        console.error("Server error:", serverMessage);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;