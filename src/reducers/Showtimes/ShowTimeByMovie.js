import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching movie showtimes
export const GetMovieShowtime = createAsyncThunk('showtimeMovie', async (data) => {
  const response = await fetch('http://103.130.213.92:3006/showtime/getMovieShowtime?movieId='+data.movieId+'&day='+data.day);
  if (!response.ok) {
    // Provide more context in the error message
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch showtimes');
  }
  return await response.json();
});

// Slice for movie showtimes
export const showtimeMovieSlice = createSlice({
  name: 'showtimeMovie',
  initialState: {
    showtimeMovieData: [],
    showtimeMovieStatus: 'idle',
    error: null, // Adding error field for error handling
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetMovieShowtime.pending, (state) => {
        state.showtimeMovieStatus = 'loading';
        state.error = null; // Reset error on new request
      })
      .addCase(GetMovieShowtime.fulfilled, (state, action) => {
        state.showtimeMovieStatus = 'succeeded';
        state.showtimeMovieData = action.payload;
      })
      .addCase(GetMovieShowtime.rejected, (state, action) => {
        state.showtimeMovieStatus = 'failed';
        state.error = action.error.message; // Save error message
        console.log(action.error.message); // Keep logging the error
      });
  },
});

// Export the reducer
export default showtimeMovieSlice.reducer;
