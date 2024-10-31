import { configureStore } from '@reduxjs/toolkit';
import EditProfileReduce from '../Reducer/EditProfileSlide'
import UploadUsersReduce from '../Reducer/UploadUserslide'
import LoginSliceReduce, { Login } from '../Reducer/LoginSlide'
import paymentSlice from '../Reducer/PaymentSlide'




export const store = configureStore({
  reducer: {
    EditProfile: EditProfileReduce,
    UploadUsers: UploadUsersReduce,
    Login: LoginSliceReduce,
    payment: paymentSlice
  },
});
