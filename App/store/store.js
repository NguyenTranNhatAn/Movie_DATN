import { configureStore } from '@reduxjs/toolkit';
import EditProfileReduce from '../../src/reducers/EditProfileSlide'


export const store = configureStore({
  reducer: {
    EditProfile: EditProfileReduce
  },
});
