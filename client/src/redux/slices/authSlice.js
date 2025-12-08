import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';
import toast from 'react-hot-toast';

// ======================= USER REGISTER ========================
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/user/register', userData);
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ======================= USER LOGIN ========================
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/user/login', credentials);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ======================= PROVIDER REGISTER ========================
export const registerProvider = createAsyncThunk(
  'auth/registerProvider',
  async (providerData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/provider/register', providerData);
      toast.success('Registration successful! Pending admin approval.');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ======================= PROVIDER LOGIN ========================
export const loginProvider = createAsyncThunk(
  'auth/loginProvider',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/provider/login', credentials);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ======================= ADMIN LOGIN ========================
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/admin/login', credentials);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ======================= LOGOUT ========================
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.post('/api/auth/logout');
    toast.success('Logged out successfully');
    return null;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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