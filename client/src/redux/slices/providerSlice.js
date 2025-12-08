import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';
import toast from 'react-hot-toast';

export const getProviderProfile = createAsyncThunk(
  'provider/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/provider/profile');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProviderProfile = createAsyncThunk(
  'provider/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/provider/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile updated successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addServiceImages = createAsyncThunk(
  'provider/addServiceImages',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/provider/services/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Images uploaded successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProviderProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateProviderProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export default providerSlice.reducer;

