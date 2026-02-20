import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';
import toast from 'react-hot-toast';

export const getUserProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/profile');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/user/profile', userData);
      toast.success('Profile updated successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchServices = createAsyncThunk(
  'user/searchServices',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/search', {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'user/toggleFavorite',
  async (providerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/user/favorites/${providerId}`);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  profile: null,
  searchResults: [],
  favorites: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.favorites = action.payload.favorites || [];
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.searchResults = action.payload.data || [];
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  },
});

export const { clearSearchResults } = userSlice.actions;
export default userSlice.reducer;

