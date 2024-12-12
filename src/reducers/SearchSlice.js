import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Tạo hàm SearchMovie để thực hiện chức năng gọi API tìm kiếm phim
export const SearchMovie = createAsyncThunk('listmovie', async (name) => {
  const response = await fetch(
    `http://103.130.213.92:3006/movie/find?name=${name}` // API lấy movie theo tên
  );
  if (!response.ok) {
    throw new Error('Failed to fetch movie');
  }
  return await response.json();
});

// Tạo Slice quản lý trạng thái khi gọi hàm SearchMovie
export const searchSlice = createSlice({
  name: 'listmovie', // Đặt tên là 'listmovie'
  initialState: {
    searchData: [], // Dữ liệu tìm kiếm trả về
    searchStatus: 'idle', // Trạng thái mặc định
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchData = []; // Đặt lại dữ liệu tìm kiếm về rỗng
      state.searchStatus = 'idle'; // Trạng thái trở lại mặc định
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SearchMovie.pending, (state) => {
        state.searchStatus = 'loading'; // Đang gọi API
      })
      .addCase(SearchMovie.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded'; // Thành công
        state.searchData = action.payload; // Lưu dữ liệu phim nhận được từ API
      })
      .addCase(SearchMovie.rejected, (state, action) => {
        state.searchStatus = 'failed'; // Thất bại
        console.log(action.error.message);
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
