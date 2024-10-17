import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Hàm thực hiện API gọi cập nhật thông tin tài khoản
export const EditProfile = createAsyncThunk('editprofile', async (data) => {
  const response = await axios.post(
    'https://be-movie-sooty.vercel.app/user/updateUser',
    JSON.stringify(data),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.status !== 200) {
    throw new Error('Failed to update profile');
  }

  return response.data; // Lấy dữ liệu từ response
});

// Tạo Slice để quản lý trạng thái khi gọi API EditProfile
export const EditProfileSlice = createSlice({
  name: 'editprofile',
  initialState: {
    editprofileData: {},
    editprofileStatus: 'idle', // idle | loading | succeeded | failed
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(EditProfile.pending, (state) => {
        state.editprofileStatus = 'loading';
      })
      .addCase(EditProfile.fulfilled, (state, action) => {
        state.editprofileStatus = 'succeeded';
        state.editprofileData = action.payload;
      })
      .addCase(EditProfile.rejected, (state, action) => {
        state.editprofileStatus = 'failed';
        console.log(action.error.message);
      });
  },
});

export default EditProfileSlice.reducer;
