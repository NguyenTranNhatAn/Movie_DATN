
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../reducers/SearchSlice';
import EditProfileReduce from '../reducers/EditProfileSlide'
export const store = configureStore({
  reducer: {
  search: searchReducer,
  editProfile: EditProfileReduce,
  },
});

