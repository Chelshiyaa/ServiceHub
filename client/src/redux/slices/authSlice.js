import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import toast from "react-hot-toast";

/* ================= ERROR FORMATTER ================= */
const formatError = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

/* ================= LOCAL STORAGE HELPERS ================= */
const getStoredToken = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "null" || token === "undefined") return null;
  return token;
};

const setStoredToken = (token) => {
  if (!token || token === "null" || token === "undefined") {
    localStorage.removeItem("token");
  } else {
    localStorage.setItem("token", token);
  }
};

/* ================= LOAD USER ================= */
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    // Skip API call if no token exists (user not logged in)
    const token = getStoredToken();
    if (!token) {
      // Clear any stale data
      try {
        localStorage.removeItem("user");
      } catch {
        // ignore storage errors
      }
      return rejectWithValue(null);
    }

    try {
      // Deployed backend variants:
      // - New:   GET /api/auth/me
      // - Older: GET /api/user/me | /api/provider/me | /api/admin/me
      const candidates = ["/auth/me", "/user/me", "/provider/me", "/admin/me"];

      for (const path of candidates) {
        try {
          const res = await axiosInstance.get(path);
          const maybeUser = res?.data?.user ?? res?.data?.data ?? res?.data?.profile;
          if (maybeUser) return maybeUser;
          // If API returns the user object at top-level, accept it too
          if (res?.data && typeof res.data === "object") return res.data;
        } catch (err) {
          const status = err?.response?.status;
          // If the route doesn't exist on the deployed backend, try next.
          if (status === 404) continue;
          // Any other failure (401/403/etc) means not logged in / invalid session.
          throw err;
        }
      }

      // None of the endpoints exist (or returned unexpected payload)
      return rejectWithValue(null);
    } catch (error) {
      // Session is invalid/missing -> clear any stale persisted auth
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } catch {
        // ignore storage errors
      }
      return rejectWithValue(null);
    }
  }
);

/* ================= REGISTER ================= */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/user/register", data);
      toast.success("Registration successful");
      return res.data;
    } catch (error) {
      toast.error(formatError(error));
      return rejectWithValue(formatError(error));
    }
  }
);

export const registerProvider = createAsyncThunk(
  "auth/registerProvider",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/provider/register", data);
      toast.success("Provider registered (pending approval)");
      return res.data;
    } catch (error) {
      toast.error(formatError(error));
      return rejectWithValue(formatError(error));
    }
  }
);

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/user/login", credentials);
      toast.success("Login successful");
      return res.data;
    } catch (error) {
      toast.error(formatError(error));
      return rejectWithValue(formatError(error));
    }
  }
);

export const loginProvider = createAsyncThunk(
  "auth/loginProvider",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/provider/login", credentials);
      toast.success("Login successful");
      return res.data;
    } catch (error) {
      toast.error(formatError(error));
      return rejectWithValue(formatError(error));
    }
  }
);

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/admin/login", credentials);
      toast.success("Admin login successful");
      return res.data;
    } catch (error) {
      toast.error(formatError(error));
      return rejectWithValue(formatError(error));
    }
  }
);

/* ================= LOGOUT ================= */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async () => {
    await axiosInstance.post("/auth/logout");
    toast.success("Logged out successfully");
  }
);

/* ================= INITIAL STATE ================= */
const initialState = {
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })(),
  token: getStoredToken(),
  loading: false,
  error: null,
};

/* ================= SLICE ================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* 🔹 ALL addCase FIRST */
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })

      /* 🔹 MATCHERS AFTER ALL CASES */
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") &&
          (action.type.includes("login") ||
            action.type.includes("register")),
        (state, action) => {
          state.user = action.payload.data;
          state.token = action.payload.token;
          state.loading = false;

          localStorage.setItem("user", JSON.stringify(state.user));
          setStoredToken(state.token);
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
