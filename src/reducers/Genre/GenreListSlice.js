import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const GenreList = createAsyncThunk('listGenre', async data => {
  const response = await fetch('http://103.69.193.151:3006/genre/getAll');
  if (!response.ok) {
    throw new Error('Failed');
  }
  return await response.json();
});


export const genreSlice = createSlice({
  name: 'listGenre',
  initialState: {
    genreData: [],
    genreStatus: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(GenreList.pending, (state, action) => {
        state.genreStatus = 'loading';
      })
      .addCase(GenreList.fulfilled, (state, action) => {
        state.genreStatus = 'succeeded';
        state.genreData = action.payload;
      })
      .addCase(GenreList.rejected, (state, action) => {
        state.genreStatus = 'failed';
        console.log(action.error.message);
      });
  },
});

export default genreSlice.reducer;
