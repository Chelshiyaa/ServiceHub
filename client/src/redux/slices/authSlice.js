import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import toast from "react-hot-toast";

/* ================= LOAD USER (COOKIE BASED) ================= */
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me", {
        withCredentials: true,
      });
      return res.data.user;
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

/* ================= REGISTER ================= */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/auth/user/register",
        data,
        { withCredentials: true }
      );
      toast.success("Registration successful");
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
      return rejectWithValue(null);
    }
  }
);

export const registerProvider = createAsyncThunk(
  "auth/registerProvider",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/auth/provider/register",
        data,
        { withCredentials: true }
      );
      toast.success("Provider registered successfully");
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
      return rejectWithValue(null);
    }
  }
);

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/auth/user/login",
        credentials,
        { withCredentials: true }
      );
      toast.success("Login successful");
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      return rejectWithValue(null);
    }
  }
);

export const loginProvider = createAsyncThunk(
  "auth/loginProvider",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/auth/provider/login",
        credentials,
        { withCredentials: true }
      );
      toast.success("Login successful");
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      return rejectWithValue(null);
    }
  }
);

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/auth/admin/login",
        credentials,
        { withCredentials: true }
      );
      toast.success("Admin login successful");
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      return rejectWithValue(null);
    }
  }
);

/* ================= LOGOUT ================= */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async () => {
    await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    toast.success("Logged out successfully");
  }
);

/* ================= INITIAL STATE ================= */
const initialState = {
  user: null,
  loading: false,
  error: null,
};

/* ================= SLICE ================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* 🔹 ALL addCase FIRST */
    builder
      // LOAD USER
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      });

    /* 🔹 ALL addMatcher AFTER addCase */
    builder
      // LOGIN & REGISTER SUCCESS
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") &&
          (action.type.includes("login") ||
            action.type.includes("register")),
        (state, action) => {
          state.user = action.payload.data;
          state.loading = false;
        }
      )

      // PENDING
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // REJECTED
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default authSlice.reducer;