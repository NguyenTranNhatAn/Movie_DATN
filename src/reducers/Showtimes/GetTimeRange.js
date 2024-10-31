import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const GetTime = createAsyncThunk('gettime', async data => {
  const response = await fetch('https://be-movie-sooty.vercel.app/showtime/getFilterTime?movieId='+data.movieId+'&day='+data.day);
  if (!response.ok) {
    throw new Error('Failed');
  }
  return await response.json();
});


export const getimeSlice = createSlice({
  name: 'gettime',
  initialState: {
    getTimeData: [],
    getTimeStatus: 'idle',
  },
  reducers: {
    clearShowtimeData: (state) => {
      state.getTimeData = [];  // Reset dữ liệu showtime
      state.getTimeStatus = 'idle'; // Reset trạng thái nếu cần
    },
  },
  extraReducers: builder => {
    builder
      .addCase(GetTime.pending, (state, action) => {
        state.getTimeStatus = 'loading';
      })
      .addCase(GetTime.fulfilled, (state, action) => {
        state.getTimeStatus = 'succeeded';
        state.getTimeData = action.payload;
      })
      .addCase(GetTime.rejected, (state, action) => {
        state.getTimeStatus = 'failed';
        console.log(action.error.message);
      });
  },
});
export const { clearShowtimeData } = getimeSlice.actions;
export default getimeSlice.reducer;
