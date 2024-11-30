import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm thực hiện API đăng nhập và lưu token vào AsyncStorage
export const Login = createAsyncThunk(
  'login/Login',
  async (data, { rejectWithValue }) => {
    try {
      console.log('Dữ liệu gửi đi:', data); // Log dữ liệu đăng nhập

      const response = await axios.post(
        'http://http://103.130.213.92:3006/api/login',
        data, // Không cần JSON.stringify, axios tự chuyển đổi
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Phản hồi API:', response.data); // Log phản hồi API

      // Kiểm tra nếu không có token hoặc mã lỗi khác 200
      if (response.status !== 200 || !response.data.token) {
        const message = response.data?.message || 'Failed to login';
        throw new Error(message); // Ném ra lỗi với thông báo chi tiết
      }

      const { token } = response.data; // Lấy token từ response
      console.log('Token nhận được:', token); // Log token để kiểm tra

      await AsyncStorage.setItem('authToken', token); // Lưu token vào AsyncStorage
      console.log('Token đã lưu vào AsyncStorage'); // Log thông báo lưu thành công

      return response.data; // Trả về dữ liệu người dùng hoặc thông tin cần thiết
    } catch (error) {
      console.error('Lỗi đăng nhập:', error); // Log lỗi chi tiết
      // Trả về lỗi cho Redux thông qua rejectWithValue
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);

// Tạo Slice để quản lý trạng thái đăng nhập
export const LoginSlice = createSlice({
  name: 'login',
  initialState: {
    loginData: {},
    loginStatus: 'idle', // idle | loading | succeeded | failed
    error: null, // Lưu lỗi nếu có
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Login.pending, (state) => {
        state.loginStatus = 'loading';
        state.error = null; // Reset lỗi khi bắt đầu login
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.loginStatus = 'succeeded';
        state.loginData = action.payload; // Lưu dữ liệu người dùng
        console.log('Đăng nhập thành công:', action.payload); // Log thành công
      })
      .addCase(Login.rejected, (state, action) => {
        state.loginStatus = 'failed';
        state.error = action.payload || 'Login failed'; // Lưu lỗi vào state
        console.error('Đăng nhập thất bại:', state.error); // Log lỗi
      });
  },
});

export default LoginSlice.reducer;