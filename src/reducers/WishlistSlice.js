import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Tạo async thunk cho thêm vào wishlist
export const addToWishlist = createAsyncThunk('wishlist/add', async ({ userId, movieId }) => {
  const response = await axios.post(`https://be-movie-sooty.vercel.app/movie/addWishList?_id=${userId}&movieId=${movieId}`);
  if (!response.data.status) {
    throw new Error(response.data.message);
  }
  return response.data.user; // Trả về thông tin người dùng
});

// Tạo async thunk cho xóa khỏi wishlist
export const removeFromWishlist = createAsyncThunk('wishlist/remove', async ({ userId, movieId }) => {
  const response = await axios.post(`https://be-movie-sooty.vercel.app/movie/removeWishList?_id=${userId}&movieId=${movieId}`);
  if (!response.data.status) {
    throw new Error(response.data.message);
  }
  return response.data.user; // Trả về thông tin người dùng
});

// Tạo slice quản lý wishlist
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    user: null, // Thông tin người dùng
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Thiết lập thông tin người dùng
    },
    clearWishlist: (state) => {
      state.user = null; // Xóa thông tin người dùng
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true; // Đang xử lý
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false; // Xử lý thành công
        state.user = action.payload; // Cập nhật thông tin người dùng
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false; // Xử lý thất bại
        state.error = action.error.message; // Lưu thông báo lỗi
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true; // Đang xử lý
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false; // Xử lý thành công
        state.user = action.payload; // Cập nhật thông tin người dùng
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false; // Xử lý thất bại
        state.error = action.error.message; // Lưu thông báo lỗi
      });
  },
});

// Xuất ra các action và reducer
export const { setUser, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
