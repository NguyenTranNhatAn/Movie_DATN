import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const GetShowDays = createAsyncThunk('showday', async data => {
  const response = await fetch('http://103.130.213.92:3006/showtime/showdays?movieId=' + data.movieId);
  if (!response.ok) {
    throw new Error('Failed');
  }
  return await response.json();
});


export const showdaySlice = createSlice({
  name: 'showday',
  initialState: {
    showdayData: [],
    showdayStatus: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(GetShowDays.pending, (state, action) => {
        state.showdayStatus = 'loading';
      })
      .addCase(GetShowDays.fulfilled, (state, action) => {
        state.showdayStatus = 'succeeded';
        state.showdayData = action.payload;
      })
      .addCase(GetShowDays.rejected, (state, action) => {
        state.showdayStatus = 'failed';
        console.log(action.error.message);
      });

  },
});

export default showdaySlice.reducer;
