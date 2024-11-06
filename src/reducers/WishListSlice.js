import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const addToWishlist = createAsyncThunk('wishlist/add', async (movieId) => {
  try {
    const _id = await AsyncStorage.getItem('_id'); // Lấy _id từ AsyncStorage
    console.log("User ID:", _id);
    console.log("Movie ID:", movieId);

    const response = await fetch(`https://be-movie-sooty.vercel.app/movie/addWishList?_id=${_id}&movieId=${movieId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to add to wishlist');
    }

    const result = await response.json();
    console.log("API response:", result);
    return result.user.wishlist;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
});

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.pending, (state) => {
        console.log("Adding to wishlist...");
        state.status = 'loading';
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        console.log("Added to wishlist successfully:", action.payload);
        state.status = 'succeeded';
        state.wishlist = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        console.log("Failed to add to wishlist:", action.error.message);
        state.status = 'failed';
      });
  },
});

export default wishlistSlice.reducer;
