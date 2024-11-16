import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createPayment = createAsyncThunk(
  'payment/createPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://192.168.1.51/payment', paymentData);

      if (!response.data || !response.data.data) {
        throw new Error('Phản hồi không hợp lệ từ API');
      }

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi thanh toán';
      return rejectWithValue(errorMessage);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: { loading: false, success: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Thanh toán thất bại';
      });
  },
});

export default paymentSlice.reducer;
