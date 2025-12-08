import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';
import toast from 'react-hot-toast';

export const getStats = createAsyncThunk(
  'admin/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUsers = createAsyncThunk(
  'admin/getUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/users');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProviders = createAsyncThunk(
  'admin/getProviders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/providers');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProviderStatus = createAsyncThunk(
  'admin/updateProviderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/provider/status/${id}`, { status });
      toast.success('Status updated successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCategories = createAsyncThunk(
  'admin/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/category');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'admin/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin/category', categoryData);
      toast.success('Category created successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Creation failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'admin/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/category/${id}`, categoryData);
      toast.success('Category updated successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'admin/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/category/${id}`);
      toast.success('Category deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deletion failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  stats: null,
  users: [],
  providers: [],
  categories: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getProviders.fulfilled, (state, action) => {
        state.providers = action.payload;
      })
      .addCase(updateProviderStatus.fulfilled, (state, action) => {
        const index = state.providers.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.providers[index] = action.payload;
        }
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload);
      });
  },
});

export default adminSlice.reducer;

