import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm thực hiện API gọi cập nhật thông tin tài khoản
export const EditProfile = createAsyncThunk(
  'editprofile',
  async ({ name, phone, address, email }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token, vui lòng đăng nhập lại');
      }

      const response = await axios.post(
        'http://http://103.130.213.92:3006/api/edit-profile',
        { name, phone, address, email },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Trả về thông báo lỗi từ backend
        return rejectWithValue(error.response.data.message);
      }
      // Trả về lỗi khác nếu có
      return rejectWithValue(error.message || 'Có lỗi xảy ra.');
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
        state.editprofileData = action.payload.user; // Cập nhật với dữ liệu user mới
        console.log('Updated Redux Store:', state.editprofileData); // Kiểm tra Redux Store
      })
      .addCase(EditProfile.rejected, (state, action) => {
        state.editprofileStatus = 'failed';
        state.error = action.payload; // Lưu lỗi vào state
        console.log('Error:', action.payload); // Hiển thị lỗi trong console
      });
  },
});

export default EditProfileSlice.reducer;
