import { configureStore } from '@reduxjs/toolkit';
import EditProfileReduce from '../Reducer/EditProfileSlide'
import UploadUsersReduce from '../Reducer/UploadUserslide'
import LoginSliceReduce, { Login } from '../Reducer/LoginSlide'




export const store = configureStore({
  reducer: {
    EditProfile: EditProfileReduce,
    UploadUsers: UploadUsersReduce,
    Login: LoginSliceReduce
  },
});
