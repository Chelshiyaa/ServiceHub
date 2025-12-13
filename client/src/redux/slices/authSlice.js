import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';
import toast from 'react-hot-toast';

// CLEAN ERROR MESSAGE
const formatError = (error) => {
  return error?.response?.data?.message || error?.message || "Something went wrong";
};

// ================= USER REGISTER =================
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/user/register', userData);
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      toast.error(formatError(error));
      return rejectWithValue(formatError(error));
    }
  }
);

// ================= USER LOGIN =================
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/user/login', credentials);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      toast.error(formatError(error));
      return rejectWithValue(formatError(error));
    }
  }
);

// ================= PROVIDER REGISTER =================
export const registerProvider = createAsyncThunk(
  'auth/registerProvider',
  async (providerData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/provider/register', providerData);
      toast.success('Provider registered (pending admin approval)');
      return response.data;
    } catch (error) {
      toast.error(formatError(error));
      return rejectWithValue(formatError(error));
    }
  }
);

// ================= PROVIDER LOGIN =================
export const loginProvider = createAsyncThunk(
  'auth/loginProvider',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/provider/login', credentials);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      toast.error(formatError(error));
      return rejectWithValue(formatError(error));
    }
  }
);

// ================= ADMIN LOGIN =================
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/admin/login', credentials);
      toast.success('Admin login successful!');
      return response.data;
    } catch (error) {
      toast.error(formatError(error));
      return rejectWithValue(formatError(error));
    }
  }
);

// ================= LOGOUT =================
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/logout');
      toast.success('Logged out successfully');
      return null;
    } catch (error) {
      return rejectWithValue(formatError(error));
    }
  }
);

const initialState = {
  user: (() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 REGISTER USER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data || null;
        state.token = action.payload.token || null;

        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('token', state.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 LOGIN USER
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data || null;
        state.token = action.payload.token || null;

        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('token', state.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 REGISTER PROVIDER
      .addCase(registerProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data || null;
        state.token = action.payload.token || null;

        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('token', state.token);
      })
      .addCase(registerProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 LOGIN PROVIDER
      .addCase(loginProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data || null;
        state.token = action.payload.token || null;

        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('token', state.token);
      })
      .addCase(loginProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 ADMIN LOGIN
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data || null;
        state.token = action.payload.token || null;

        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('token', state.token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
