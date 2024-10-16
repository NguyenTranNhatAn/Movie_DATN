import { configureStore } from '@reduxjs/toolkit';
import EditProfileReduce from '../Reducer/EditProfileSlide'


export const store = configureStore({
  reducer: {
    EditProfile: EditProfileReduce
  },
});
