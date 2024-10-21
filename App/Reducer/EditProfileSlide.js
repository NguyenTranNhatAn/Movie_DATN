import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm thực hiện API gọi cập nhật thông tin tài khoản
export const EditProfile = createAsyncThunk(
  'editprofile',
  async (data, { rejectWithValue }) => {
    try {
      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Không tìm thấy token, vui lòng đăng nhập lại');
      }

      const response = await axios.post(
        'https://be-movie-sooty.vercel.app/user/updateUser',
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Truyền token vào header
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to update profile');
      }

      return response.data; // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Tạo Slice để quản lý trạng thái khi gọi API EditProfile
export const EditProfileSlice = createSlice({
  name: 'editprofile',
  initialState: {
    editprofileData: {},
    editprofileStatus: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(EditProfile.pending, (state) => {
        state.editprofileStatus = 'loading';
        state.error = null;
      })
      .addCase(EditProfile.fulfilled, (state, action) => {
        state.editprofileStatus = 'succeeded';
        state.editprofileData = action.payload;
      })
      .addCase(EditProfile.rejected, (state, action) => {
        state.editprofileStatus = 'failed';
        state.error = action.payload; // Lưu lỗi vào state
        console.log(action.payload); // Hiển thị lỗi trong console
      });
  },
});

export default EditProfileSlice.reducer;
