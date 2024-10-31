import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const ShowCine = createAsyncThunk('showcine', async data => {
  const response = await fetch('https://be-movie-sooty.vercel.app/showtime/getCinemaMain?movieId='+data.movieId+'&day='+data.day+'&startHour='+data.startHour+'&endHour='+data.endHour);
  if (!response.ok) {
    throw new Error('Failed');
  }
  return await response.json();
});


export const showCineSlice = createSlice({
  name: 'showcine',
  initialState: {
    showCinemaData: [],
    showCinemaStatus: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(ShowCine.pending, (state, action) => {
        state.showCinemaStatus = 'loading';
      })
      .addCase(ShowCine.fulfilled, (state, action) => {
        state.showCinemaStatus = 'succeeded';
        state.showCinemaData = action.payload;
      })
      .addCase(ShowCine.rejected, (state, action) => {
        state.showCinemaStatus = 'failed';
        console.log(action.error.message);
        
      });
  },
});

export default showCineSlice.reducer;
