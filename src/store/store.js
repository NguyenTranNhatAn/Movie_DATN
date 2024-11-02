
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../reducers/SearchSlice';
import EditProfileReduce from '../reducers/EditProfileSlide'
import movieListReducer from '../reducers/MovieSlice'
import genreDetailReducer from '../reducers/Genre/GenreDetailSlice'
import genreListReducer from '../reducers/Genre/GenreListSlice'
import showtimeReducer from '../reducers/Showtimes/GetShowTimeSlide'
import brandListReducer from '../reducers/Brand/GetAllBrand'
import showTimeListMovieReducer from '../reducers/Showtimes/ShowTimeByMovie'
import timeRangeMovieReducer from '../reducers/Showtimes/GetTimeRange'
import cinemaShowtime from '../reducers/Showtimes/ShowTimeCinema'
export const store = configureStore({
  reducer: {
    search: searchReducer,
    editProfile: EditProfileReduce,
    movieList: movieListReducer,
    genreDetail: genreDetailReducer,
    genreList: genreListReducer,
    showTime: showtimeReducer,
    brandList: brandListReducer,
    showtimebyMovie: showTimeListMovieReducer,
    listTime:timeRangeMovieReducer,
    cinemaShow:cinemaShowtime,
  },
});

