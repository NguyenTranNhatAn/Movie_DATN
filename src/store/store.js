
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../reducers/SearchSlice';
export const store = configureStore({
  reducer: {
  search: searchReducer
  },
});

