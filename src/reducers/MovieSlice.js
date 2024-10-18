import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const GetMovieList = createAsyncThunk('listMovie', async data => {
  const response = await fetch('https://be-movie-sooty.vercel.app/movie/getAll');
  if (!response.ok) {
    throw new Error('Failed');
  }
  return await response.json();
});


export const movieSlice = createSlice({
  name: 'listMovie',
  initialState: {
    movieData: [],
    movieStatus: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(GetMovieList.pending, (state, action) => {
        state.movieStatus = 'loading';
      })
      .addCase(GetMovieList.fulfilled, (state, action) => {
        state.movieStatus = 'succeeded';
        state.movieData = action.payload;
      })
      .addCase(GetMovieList.rejected, (state, action) => {
        state.movieStatus = 'failed';
        console.log(action.error.message);
      });
  },
});

export default movieSlice.reducer;
