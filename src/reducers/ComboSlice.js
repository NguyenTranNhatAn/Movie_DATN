// redux/slices/comboSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API_BASE_URL from '../screens/config';

// Thunk để gọi API lấy danh sách combo
export const fetchCombos = createAsyncThunk('combos/fetchCombos', async () => {
    const response = await fetch(`${API_BASE_URL}/combo/getAll`);
    if (!response.ok) {
        throw new Error('Failed to fetch combos');
    }
    return await response.json();
});

const comboSlice = createSlice({
    name: 'combos',
    initialState: {
        combos: [],
        quantities: {},
        totalPrice: 0,
        status: 'idle',
        error: null,
    },
    reducers: {
        increaseQuantity: (state, action) => {
            const id = action.payload;
            state.quantities[id] = (state.quantities[id] || 0) + 1;
            comboSlice.caseReducers.calculateTotalPrice(state);
        },
        decreaseQuantity: (state, action) => {
            const id = action.payload;
            state.quantities[id] = Math.max((state.quantities[id] || 0) - 1, 0);
            comboSlice.caseReducers.calculateTotalPrice(state);
        },
        calculateTotalPrice: (state) => {
            let total = 0;
            state.combos.forEach((combo) => {
                const quantity = state.quantities[combo._id] || 0;
                total += combo.price * quantity;
            });
            state.totalPrice = total.toFixed(3);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCombos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCombos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.combos = action.payload;
                state.quantities = action.payload.reduce((acc, combo) => {
                    acc[combo._id] = combo.quantity || 0;
                    return acc;
                }, {});
                comboSlice.caseReducers.calculateTotalPrice(state);
            })
            .addCase(fetchCombos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { increaseQuantity, decreaseQuantity } = comboSlice.actions;
export default comboSlice.reducer;
