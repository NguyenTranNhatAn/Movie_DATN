import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const GetShowTime = createAsyncThunk('showtime', async data => {
  const response = await fetch('http://103.130.213.92:3006/showtimes/'+data);
  if (!response.ok) {
    throw new Error('Failed');
  }
  return await response.json();
});


export const showtimeSlice = createSlice({
  name: 'showtime',
  initialState: {
    showtimeData: {},
    showtimeStatus: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(GetShowTime.pending, (state, action) => {
        state.showtimeStatus = 'loading';
      })
      .addCase(GetShowTime.fulfilled, (state, action) => {
        state.showtimeStatus = 'succeeded';
        state.showtimeData = action.payload;
      })
      .addCase(GetShowTime.rejected, (state, action) => {
        state.showtimeStatus = 'failed';
        console.log(action.error.message);
      });
      
  },
});

export default showtimeSlice.reducer;
