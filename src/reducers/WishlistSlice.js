// reducers/WishListSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (movieId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('Vui lòng đăng nhập để thêm vào wishlist');
      }

      const response = await axios.get(
        `http://103.130.213.92:3006/movie/addWishList?movieId=${movieId}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      

      return response.data;
    } catch (error) {
      console.log(error.response); 
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
