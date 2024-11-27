import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const GetGenreDetail = createAsyncThunk('movieDetail', async data => {
  const response = await fetch('http://103.130.213.92:3006/genre/getDetail?_id='+data);
  if (!response.ok) {
    throw new Error('Failed');
  }
  return await response.json();
});


export const genreDetailSlice = createSlice({
  name: 'movieDetail',
  initialState: {
    genreDetailData: {},
    genreDetailStatus: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(GetGenreDetail.pending, (state, action) => {
        state.genreDetailStatus = 'loading';
      })
      .addCase(GetGenreDetail.fulfilled, (state, action) => {
        state.genreDetailStatus = 'succeeded';
        state.genreDetail = action.payload;
      })
      .addCase(GetGenreDetail.rejected, (state, action) => {
        state.genreDetailStatus = 'failed';
        console.log(action.error.message);
      });
  },
});

export default genreDetailSlice.reducer;
