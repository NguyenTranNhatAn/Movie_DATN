import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const BrandList = createAsyncThunk('listBrand', async data => {
  const response = await fetch('http://localhost:3000/showtime/getBrandShowtime?movieId='+data.movieId+'&day='+data.day);
  if (!response.ok) {
    throw new Error('Failed');
  }
  return await response.json();
});


export const brandSlice = createSlice({
  name: 'listBrand',
  initialState: {
    brandData: [],
    brandStatus: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(BrandList.pending, (state, action) => {
        state.brandStatus = 'loading';
      })
      .addCase(BrandList.fulfilled, (state, action) => {
        state.brandStatus = 'succeeded';
        state.brandData = action.payload;
      })
      .addCase(BrandList.rejected, (state, action) => {
        state.brandStatus = 'failed';
        console.log(action.error.message);
      });
  },
});

export default brandSlice.reducer;
