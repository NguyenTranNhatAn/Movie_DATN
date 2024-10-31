
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  Alert,
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../../theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import AppHeader from '../../components/AppHeader';
import CustomIcon from '../../components/CustomIcon';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { GetShowTime } from '../../reducers/Showtimes/GetShowTimeSlide';
import { color } from '../../constants/color';
import socket from '../../store/socket'

import { black, white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { BrandList } from '../../reducers/Brand/GetAllBrand';
import { Image } from 'react-native-animatable';
import { getDateList } from '../../utils/getListDate';
import { GetMovieShowtime } from '../../reducers/Showtimes/ShowTimeByMovie';
import { GetTime } from '../../reducers/Showtimes/GetTimeRange';
import { genreSlice } from '../../reducers/Genre/GenreListSlice';
const timeArray = [
  "All",
  '9:00 - 12:00',
  '12:00 - 15:00',
  '15:00 - 18:00',
  '18:00 - 21:00',
  '21:00 - 24:00',


];





const CinemaSelect = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [showTimeByMovie, setShowTimeByMovie] = useState([]);
  const [seats, setSeats] = useState([]);
  const { showtimeData, showtimeStatus } = useSelector((state) => state.showTime);
  const { brandData, brandStatus } = useSelector((state) => state.brandList);
  const { getTimeData, getTimeStatus } = useSelector((state) => state.listTime);
  const { showtimeMovieData, showtimeMovieStatus } = useSelector((state) => state.showtimebyMovie);
  const [dateArray, setDateArray] = useState(getDateList(7));
  const [selectedIds, setSelectedIds] = useState([]);
  const [timeARR, setTimeARR] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState();
  const [selectedBrand, setSelectedBrand] = useState();
  const [price, setPrice] = useState(0);
  const [twoDSeatArray, setTwoDSeatArray] = useState([]);
  const [selectedSeatArray, setSelectedSeatArray] = useState([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState();
  const [listBrand, setListBrand] = useState([]);


  useEffect(() => {
    setSelectedDateIndex(0);
    setSelectedTimeIndex(0);
    setSelectedBrand(0);
  }, []);

 

  useEffect(() => {
    // Kiểm tra trạng thái để gọi dispatch
    if (brandStatus === 'idle' || brandStatus.length === 0) {
      dispatch(BrandList({movieId: '670b3bcf184ded8e7759c0ab', day: dateArray[0].date}));
    }

    // Cập nhật timeARR khi getTimeData thay đổi
    if (brandData.length > 0) {
      setListBrand(brandData);

    }
    console.log(brandData)
  }, [dispatch, brandData, brandStatus]);
  
  useEffect(() => {
    if (showtimeMovieData.length === 0) {

      dispatch(GetMovieShowtime({ movieId: '670b3bcf184ded8e7759c0ab', day: dateArray[0].date }));
    }



    setShowTimeByMovie(showtimeMovieData);


  }, [dispatch, showtimeMovieData])

  useEffect(() => {
    // Kiểm tra trạng thái để gọi dispatch
    if (getTimeStatus === 'idle' || getTimeData.length === 0) {
      dispatch(GetTime({ movieId: '670b3bcf184ded8e7759c0ab', day: "2024-10-31T14:35:22.123Z" }));
    }

    // Cập nhật timeARR khi getTimeData thay đổi
    if (getTimeData.length > 0) {
      setTimeARR(getTimeData);

    }
    //console.log(timeARR)
  }, [dispatch, getTimeStatus, getTimeData]);

  const toggleDate = (index)=>{
    setSelectedDateIndex(index)
  }
  const toggleExpand = () => {

    setExpanded(!expanded);
  };

  const renderBrand = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => setSelectedBrand(index)} style={{ justifyContent: 'center', alignItems: 'center', }}>
        <View style={{ borderColor: index == selectedBrand ? COLORS.Red : COLORS.GreyWhite, borderWidth: 2, padding: 5, borderRadius: 10 }}>
          <Image style={{ resizeMode: 'contain', height: 50, width: 50 }} source={{ uri: item.logo }} />

        </View>
        <Text numberOfLines={1} style={{ textAlign: 'center', width: 70, color: index == selectedBrand ? 'black' : 'grey', fontWeight: 'bold' }}>{item.name}</Text>
      </TouchableOpacity>
    )

  }

  return (
    <View style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      <StatusBar hidden />

      <View>
        <ImageBackground
          source={{ uri: 'https://i.ytimg.com/vi/jBpUvgVFuXE/hqdefault.jpg' }}
          style={styles.ImageBG}>
          <LinearGradient colors={[COLORS.BlackRGB10, COLORS.Black]} style={styles.linearGradient}>
            <View style={styles.appHeaderContainer}>
              <AppHeader name="close" header="" action={() => navigation.goBack()} />
            </View>
          </LinearGradient>
        </ImageBackground>

      </View>
      <View style={{ marginTop: 15 }}>
        <FlatList
          data={dateArray}
          keyExtractor={item => item.day + item.date}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.containerGap24}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() =>toggleDate(index)}>
                <View
                  style={[
                    styles.dateContainer,
                    index === 0
                      ? { marginLeft: SPACING.space_24 }
                      : index === dateArray.length - 1
                        ? { marginRight: SPACING.space_24 }
                        : {},
                    index === selectedDateIndex
                      ? { backgroundColor: COLORS.Red }
                      : {},
                  ]}>
                  <Text style={[styles.dateText, index === selectedDateIndex ? { color: COLORS.White } : {}]}>{item.date.getDate()}</Text>
                  <Text style={[styles.dayText, index === selectedDateIndex ? { color: COLORS.White } : {}]}>{item.day}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.OutterContainer}>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.containerGap24,{paddingLeft:24}]}

        >
          {
            <TouchableOpacity onPress={() => setSelectedTimeIndex(0)}>
              <View
                style={[
                  styles.timeContainer,
                 
                  selectedTimeIndex === 0
                    ? { backgroundColor: COLORS.Red }
                    : {},
                ]}>
                <Text style={[styles.timeText, 0 === selectedTimeIndex ? { color: COLORS.White } : {}]}>Tất cả</Text>
              </View>
            </TouchableOpacity>
          }

          {
            timeARR.map((item, index) => {
              return (
                <TouchableOpacity key={index+1} onPress={() => setSelectedTimeIndex(index+1)}>
                  <View
                    style={[
                      styles.timeContainer,
                      index+1 === 0
                        ? { marginLeft: SPACING.space_24 }
                        : index === timeArray.length - 1
                          ? { marginRight: SPACING.space_24 }
                          : {},
                      index+1 === selectedTimeIndex
                        ? { backgroundColor: COLORS.Red }
                        : {},
                    ]}>

                    <Text style={[styles.timeText, index+1 === selectedTimeIndex ? { color: COLORS.White } : {}]}>{item.label ?? ""}</Text>

                  </View>
                </TouchableOpacity>
              );
            })
          }

        </ScrollView>
      </View>
      <View style={styles.body}>

        <View style={{ borderRadius: 10, marginTop: 20, marginHorizontal: 24, paddingVertical: 15, backgroundColor: 'white' }}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 15, paddingLeft: 15, }}
          >
            {<TouchableOpacity onPress={() => setSelectedBrand(0)} style={{ justifyContent: 'center', alignItems: 'center', }}>
              <View style={{ borderColor: 0 == selectedBrand ? COLORS.Red : COLORS.GreyWhite, borderWidth: 2, padding: 5, borderRadius: 10 }}>
                <Image style={{ resizeMode: 'contain', height: 50, width: 50 }} source={{ uri: "https://res.cloudinary.com/dqpwsunpc/image/upload/v1730307886/igugmco1rieyhpveixnv.jpg" }} />

              </View>
              <Text numberOfLines={1} style={{ textAlign: 'center', width: 70, color: 0 == selectedBrand ? COLORS.Red : 'grey', fontWeight: 'bold' }}>All</Text>
            </TouchableOpacity>}
            {
              listBrand.map((item, index) => {
                return (
                  <TouchableOpacity key={item._id} onPress={() => setSelectedBrand(index + 1)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ borderColor: index + 1 === selectedBrand ? COLORS.Red : COLORS.GreyWhite, borderWidth: 2, padding: 5, borderRadius: 10 }}>
                      <Image style={{ resizeMode: 'contain', height: 50, width: 50 }} source={{ uri: item.logo }} />
                    </View>
                    <Text numberOfLines={1} style={{ textAlign: 'center', width: 70, color: index + 1 === selectedBrand ? COLORS.Red : 'grey', fontWeight: 'bold' }}>{item.name}</Text>
                  </TouchableOpacity>
                );
              })
            }
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.GreyFade,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginLeft: 10
  },
  available: {
    backgroundColor: 'green',
    borderRadius: 5,
    color: 'white',
    padding: 10,
  },
  selected: {
    backgroundColor: 'blue',
    borderRadius: 5,
    color: 'white',
    padding: 10,
  },
  booked: {
    backgroundColor: 'red',
    borderRadius: 5,
    color: 'white',
    padding: 10,
  },
  reserved: {
    backgroundColor: 'orange',
    borderRadius: 5,
    color: 'white',
    padding: 10,
  },
  empty: {
    padding: 10,
    margin: 5,
  },
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.White,
  },
  ImageBG: {
    width: '100%',
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    height: '100%',
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  screenText: {
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.WhiteRGBA15,
  },
  seatContainer: {
    marginVertical: SPACING.space_20,
    flex: 2
  },
  containerGap20: {
    gap: SPACING.space_20,
  },
  seatRow: {
    flexDirection: 'row',
    gap: SPACING.space_20,
    justifyContent: 'center',
  },
  seatIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  seatRadioContainer: {
    flexDirection: 'row',
    marginTop: SPACING.space_36,
    marginBottom: SPACING.space_10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  radioContainer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
  },
  radioIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
  },
  radioText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
  },
  containerGap24: {
    gap: SPACING.space_24,
    
  },
  dateContainer: {
    width: SPACING.space_10 * 7,
    height: SPACING.space_10 * 7,
    borderRadius: 15,
    backgroundColor: COLORS.GreyWhite,
    alignItems: 'center',
    justifyContent: 'center',

  },
  dateText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.Black,
  },
  dayText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.Black,
  },
  OutterContainer: {
    marginVertical: SPACING.space_24,
  },
  timeContainer: {
    paddingVertical: SPACING.space_10,
    borderWidth: 1,
    borderColor: COLORS.WhiteRGBA50,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_25,
    backgroundColor: COLORS.GreyWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Black,
  },
  buttonPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.space_24,
    paddingBottom: SPACING.space_24,
  },
  priceContainer: {
    alignItems: 'center',
  },
  totalPriceText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Grey,
  },
  price: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  buttonText: {
    borderRadius: BORDERRADIUS.radius_25,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
    backgroundColor: COLORS.Orange,
  },
  seatContainer1: {
    alignItems: 'center',
  },
  seatLabel: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
    marginTop: 5,
  },
});

export default CinemaSelect;


