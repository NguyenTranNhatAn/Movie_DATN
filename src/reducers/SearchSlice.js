import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Tạo hàm SearchMovie để thực hiện chức năng gọi API tìm kiếm phim
export const SearchMovie = createAsyncThunk('listmovie', async (name) => {
  const response = await fetch(
    `https://be-movie-sooty.vercel.app/movie/find?name=${name}`, // API lấy movie theo tên
  );
  if (!response.ok) {
    throw new Error('Failed to fetch movie');
  }
  return await response.json();
});

// Tạo Slice quản lý trạng thái khi gọi hàm SearchMovie
export const searchSlice = createSlice({
  name: 'listmovie',  // Đặt tên là 'listmovie'
  initialState: {
    searchData: [],  // Đổi thành mảng vì dữ liệu trả về là danh sách phim
    searchStatus: 'idle',  // Trạng thái mặc định là 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(SearchMovie.pending, (state) => {
        state.searchStatus = 'loading';  // Đang gọi API
      })
      .addCase(SearchMovie.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded';  // Thành công
        state.searchData = action.payload;  // Lưu dữ liệu phim nhận được từ API
      })
      .addCase(SearchMovie.rejected, (state, action) => {
        state.searchStatus = 'failed';  // Thất bại
        console.log(action.error.message);
      });
  },
});

export default searchSlice.reducer;
