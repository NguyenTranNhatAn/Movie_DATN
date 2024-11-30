import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Thêm import

// Hàm thực hiện API gọi thông tin tài khoản
export const UploadUsers = createAsyncThunk(
  'UploadUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token); // Log token để kiểm tra

      if (!token) throw new Error('Token không tồn tại');

      // Gọi API với token trong header Authorization
      const response = await axios.get(
        'http://http://103.130.213.92:3006/api/user-info',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Truyền token vào header
          },
        }
      );

      console.log('API Response:', response.data); // Log dữ liệu API trả về

      if (response.status !== 200) {
        throw new Error('Failed to fetch user info');
      }

      return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
      console.error('API Error:', error); // Log lỗi nếu có
      // Xử lý lỗi chính xác và trả về rejectWithValue
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Lỗi không xác định'
      );
    }
  }
);

// Tạo Slice để quản lý trạng thái khi gọi API UploadUsers
export const UploadUserslide = createSlice({
  name: 'UploadUsers',
  initialState: {
    UploadUsersData: {},
    UploadUsersStatus: 'idle', // idle | loading | succeeded | failed
    error: null, // Thêm để lưu lỗi nếu có
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(UploadUsers.pending, (state) => {
        state.UploadUsersStatus = 'loading';
        state.error = null; // Reset lỗi
      })
      .addCase(UploadUsers.fulfilled, (state, action) => {
        state.UploadUsersStatus = 'succeeded';
        state.UploadUsersData = action.payload; // Lưu dữ liệu người dùng
      })
      .addCase(UploadUsers.rejected, (state, action) => {
        state.UploadUsersStatus = 'failed';
        state.error = action.payload; // Lưu lỗi vào state
        console.error('Fetch user info failed:', action.payload); // Log lỗi
      });
  },
});

export default UploadUserslide.reducer;
