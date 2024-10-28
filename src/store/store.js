
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../reducers/SearchSlice';
import EditProfileReduce from '../reducers/EditProfileSlide'
import movieListReducer from '../reducers/MovieSlice'
import genreDetailReducer from '../reducers/Genre/GenreDetailSlice'
import genreListReducer from '../reducers/Genre/GenreListSlice'
import showtimeReducer from '../reducers/Showtimes/GetShowTimeSlide'
export const store = configureStore({
  reducer: {
    search: searchReducer,
    editProfile: EditProfileReduce,
    movieList: movieListReducer,
    genreDetail: genreDetailReducer,
    genreList: genreListReducer,
    showTime: showtimeReducer
  },
});

