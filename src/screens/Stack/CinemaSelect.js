
import React, { useEffect, useRef, useState } from 'react';
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
  ActivityIndicator,
  Alert,
  BackHandler
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
import { BrandList, clearBrand } from '../../reducers/Brand/GetAllBrand';
import { Image } from 'react-native-animatable';
import { getDateList } from '../../utils/getListDate';

import { clearShowtimeData, GetTime } from '../../reducers/Showtimes/GetTimeRange';
import { genreSlice } from '../../reducers/Genre/GenreListSlice';
import { ShowCine, clearmainShowtime } from '../../reducers/Showtimes/ShowTimeCinema';
import { GetShowDays, clearDayShow } from '../../reducers/Showtimes/GetDayShow';
import { scrollTo } from 'react-native-reanimated';
import API_BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';





const CinemaSelect = ({ navigation, route }) => {
  const { id, image } = route.params;

  const [iD, setID] = useState(id);
  const [dateArray, setDateArray] = useState([]);
  const scrollRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState({});
  const { brandData, brandStatus } = useSelector((state) => state.brandList);
  const { getTimeData, getTimeStatus } = useSelector((state) => state.listTime);
  const { showdayData, showdayStatus } = useSelector((state) => state.showdayReducer);
  const { showCinemaData, showCinemaStatus } = useSelector((state) => state.cinemaShow);
  const [timeARR, setTimeARR] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState();
  const [selectedBrand, setSelectedBrand] = useState();
  const [start, setstart] = useState()
  const [end, setEnd] = useState()
  const [selectedTimeIndex, setSelectedTimeIndex] = useState();
  const [brandId, setBrandId] = useState(undefined);
  const [listBrand, setListBrand] = useState([]);
  const [dataNot, setDatanot] = useState(false);
  const [cinemaData, setCinemaData] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const loadUserData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);

      if (storedToken) {
        const response = await fetch(`${API_BASE_URL}/api/user-info`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        const data = await response.json();
        setUserId(data._id);
      } else {
        Alert.alert("Error", "Không tìm thấy token, vui lòng đăng nhập lại.");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      Alert.alert("Error", "Không thể lấy thông tin người dùng.");
    }
  };
  useEffect(() => {
    loadUserData();
  }, []);


  useEffect(() => {
    const resetData = route.params?.resetData || false;

    if (resetData) {
      // Xóa dữ liệu cũ và tải lại từ đầu
      dispatch(clearShowtimeData());
      dispatch(clearmainShowtime());
      dispatch(clearDayShow());
      dispatch(clearBrand());
      setDateArray([]);
      setTimeARR([]);
      setListBrand([]);
      console.log("Reset data and reload fresh data");
    } else {
      console.log("Keep old data");
    }
  }, [route.params]);



  useEffect(() => {
    const resetAndGoBack = () => {

      dispatch(clearShowtimeData());
      dispatch(clearmainShowtime());
      dispatch(clearDayShow());
      dispatch(clearBrand());
      setTimeARR([]);
      setListBrand([]);

      // Quay lại màn hình trước
      navigation.goBack();
    };

    const backAction = () => {
      resetAndGoBack();
      return true; // Chặn hành động back mặc định sau khi xử lý
    };

    // Thêm sự kiện lắng nghe nút Back
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup khi component bị unmount
  }, []);


  useEffect(() => {

    if (showdayStatus === "idle") {
      dispatch(GetShowDays({ movieId: iD }))

    }
    if (showdayData?.days?.length > 0) {
      setDateArray(showdayData.days);
    }
  }, [showdayStatus]);

  useEffect(() => {

    setSelectedDateIndex(0);
    setSelectedTimeIndex(0);
    setSelectedBrand(0);
    setstart(0);
    setID(id);
    setTimeARR([]);
    setListBrand([]);
  }, []);

  useEffect(() => {

    setIsLoading(true); // Start loading
    dispatch(
      ShowCine({
        movieId: iD,
        day: selectedDateIndex ? dateArray[selectedDateIndex]?.date : dateArray[0]?.date,
        startHour: start ?? 0,
        endHour: end ?? 24,
        brandId: brandId
      })
    )
      .then((response) => {
        if (response.length > 0) {
          setCinemaData(response.payload || []);
        }
      })
      .finally(() => setIsLoading(false)); // Stop loading
  }, [dateArray, start, end, brandId,]);

  useEffect(() => {
    if (showCinemaData.length === 0) {

      dispatch(ShowCine({ movieId: iD, day: dateArray[0]?.date, startHour: start ?? 0, endHour: end ?? 24, brandId: brandId }));
      console.log("run")
    }


    if (showCinemaData.length > 0) {
      setCinemaData(showCinemaData);
    }

  }, [showCinemaData])

  useEffect(() => {

    if (brandStatus === 'idle' || brandData.length === 0) {
      dispatch(BrandList({ movieId: iD, day: dateArray[0]?.date }));

    }

    // Cập nhật timeARR khi getTimeData thay đổi
    if (brandData.length > 0) {
      setListBrand(brandData);


    }

  }, [brandData, brandStatus]);



  useEffect(() => {
    if (getTimeData.length === 0) {
      dispatch(GetTime({ movieId: iD, day: dateArray[0]?.date }));
    }
    if (getTimeData.length > 0) {
      //   console.log(getTimeData)
      setTimeARR(getTimeData);
      setDatanot(false)
    }

  }, [getTimeStatus, getTimeData, id]);
  const scrollToTime = (index) => {
    scrollRef.current?.scrollTo({
      x: index * 120, // 120 là chiều rộng phần tử (tùy chỉnh theo thiết kế)
      animated: true,
    });
  };
  const toggleDate = (index) => {
    setSelectedDateIndex(index);
    setCinemaData([]);
    const selectedDate = dateArray[index].date;
    setIsLoading(true); // Start loading
    dispatch(GetTime({ movieId: iD, day: selectedDate, brandId: brandId }))
      .then((response) => {
        if (selectedTimeIndex != 0) {
          const timeList = response.payload || [];
          const isCurrentTimeRangeValid = timeList.some(
            (time) => time.start === start && time.end === end
          );

          if (isCurrentTimeRangeValid) {
            const selectedIndex = timeList.findIndex(
              (time) => time.start === start && time.end === end
            );

            setSelectedTimeIndex(selectedIndex + 1);
            scrollToTime(selectedIndex + 1)
          } else {
            scrollToTime(0);
            setSelectedTimeIndex(0);
            allDate();
          }
        }
      });
    dispatch(ShowCine({ movieId: iD, day: selectedDate, startHour: start ?? 0, endHour: end ?? 24, brandId: brandId })).finally(() => setIsLoading(false));;
    dispatch(BrandList({ movieId: iD, day: selectedDate }));
  };

  const allDate = () => {
    const selectedDate = dateArray[selectedDateIndex].date;
    console.log(selectedDate)
    setstart(0);
    setEnd(24)
    setSelectedTimeIndex(0)
    dispatch(ShowCine({ movieId: iD, day: selectedDate, startHour: 0, endHour: 24, brandId: brandId }));

  }
  const toggleTime = (index, item) => {
    setstart(item.start)
    setEnd(item.end)
    const selectedDate = dateArray[selectedDateIndex].date;
    setSelectedTimeIndex(index);
    console.log(item.start, item.end)
    dispatch(ShowCine({ movieId: iD, day: selectedDate, startHour: item.start, endHour: item.end, brandId: brandId }));

    console.log(item.start, item.end, brandId)

  };
  const toggleBrand = (item, index) => {
    setBrandId(item.brandId)
    console.log(item.brandId)
    setSelectedBrand(index + 1)
    const selectedDate = dateArray[selectedDateIndex].date;
    dispatch(GetTime({ movieId: iD, day: selectedDate, brandId: item.brandId }))
      .then((response) => {
        if (selectedTimeIndex != 0) {
          const timeList = response.payload || [];
          const isCurrentTimeRangeValid = timeList.some(
            (time) => time.start === start && time.end === end
          );

          if (isCurrentTimeRangeValid) {
            const selectedIndex = timeList.findIndex(
              (time) => time.start === start && time.end === end
            );
            scrollToTime(selectedIndex + 1)
            setSelectedTimeIndex(selectedIndex + 1);
          } else {
            scrollToTime(0)
            setSelectedTimeIndex(0);
            allDate();
          }
        }
      });
    dispatch(ShowCine({ movieId: iD, day: selectedDate, startHour: start ?? 0, endHour: end ?? 24, brandId: item.brandId }));
    //console.log(start ?? 0)
  };

  const allBrand = () => {
    setBrandId(undefined)
    const selectedDate = dateArray[selectedDateIndex].date;
    setSelectedBrand(0);
    dispatch(GetTime({ movieId: iD, day: selectedDate, brandId: brandId }))
      .then((response) => {
        if (selectedTimeIndex != 0) {
          const timeList = response.payload || [];
          const isCurrentTimeRangeValid = timeList.some(
            (time) => time.start === start && time.end === end
          );

          if (isCurrentTimeRangeValid) {
            const selectedIndex = timeList.findIndex(
              (time) => time.start === start && time.end === end
            );
            scrollToTime(selectedIndex + 1)
            setSelectedTimeIndex(selectedIndex + 1);
          } else {
            scrollToTime(0)
            setSelectedTimeIndex(0);
            allDate();
          }
        }
      });
    dispatch(ShowCine({ movieId: iD, day: selectedDate, startHour: start ?? 0, endHour: end ?? 24 }));

  }

  const toggleExpand = (id) => {
    setExpanded((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const min = date.getMinutes();

    return `${hours}h`;
  };
  const goBack = () => {
    dispatch(clearShowtimeData());
    dispatch(clearmainShowtime());
    dispatch(clearDayShow());
    dispatch(clearBrand());
    setDateArray([]);
    setTimeARR([])
    setListBrand([])
    // Quay lại màn hình trước
    navigation.goBack();
  }
  const toggleSeat = (item, item1, index) => {

    const showtimeId = item1.showtimeId
    const roomId = item1.roomId;
    const startTime = formatTime(item1.startTime)
    const endTime = formatTime(item1.endTime)
    const day = new Date(item1.startTime)
    const cinemaId = item.cinema._id
    // console.log(cinemaId)          
    const date = `${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()}`;


    navigation.navigate("Seat", {
      startTime: startTime, day: date, showtimeId: showtimeId, movieId: iD, endTime: endTime, cinemaId: cinemaId,
      userId123: userId,
      roomId: roomId
    })
  }

  return (
    <ScrollView style={ styles.container } bounces={ false } showsVerticalScrollIndicator={ false }>
      <StatusBar hidden />

      <View>
        <ImageBackground
          source={ { uri: image[0] } }
          style={ styles.ImageBG }>
          <LinearGradient colors={ [COLORS.BlackRGB10, COLORS.Black] } style={ styles.linearGradient }>
            <View style={ styles.appHeaderContainer }>
              <AppHeader name="close" header="" action={ () => goBack() } />
            </View>
          </LinearGradient>
        </ImageBackground>

      </View>
      <View style={ { marginTop: 15, } }>
        <FlatList
          data={ dateArray }
          keyExtractor={ item => item.day + item.date }
          horizontal
          showsHorizontalScrollIndicator={ false }
          bounces={ false }
          contentContainerStyle={ styles.containerGap24 }
          renderItem={ ({ item, index }) => {
            const date = new Date(item.date);

            return (
              <TouchableOpacity onPress={ () => toggleDate(index) }>
                <View
                  style={ [
                    styles.dateContainer,
                    index === 0
                      ? { marginLeft: SPACING.space_24 }
                      : index === dateArray.length - 1
                        ? { marginRight: SPACING.space_24 }
                        : {},
                    index === selectedDateIndex
                      ? { backgroundColor: COLORS.Red }
                      : {},
                  ] }>
                  <Text style={ [styles.dateText, index === selectedDateIndex ? { color: COLORS.White } : {}] }>{ date.getDate() }</Text>
                  <Text style={ [styles.dayText, index === selectedDateIndex ? { color: COLORS.White } : {}] }>{ item?.day }</Text>
                </View>
              </TouchableOpacity>
            );
          } }
        />
      </View>
      <View style={ { marginTop: 15 } }>
        { isLoading && (
          <View style={ styles.loadingContainer }>
            <ActivityIndicator size="large" color={ COLORS.Red } />
            <Text style={ styles.loadingText }>Loading...</Text>
          </View>
        ) }</View>
      { !dataNot ? <View style={ styles.OutterContainer }>

        <ScrollView
          ref={ scrollRef }
          horizontal={ true }
          showsHorizontalScrollIndicator={ false }
          contentContainerStyle={ [styles.containerGap24, { paddingLeft: 24 }] }

        >

          <TouchableOpacity onPress={ () => allDate() }>
            <View
              style={ [
                styles.timeContainer,

                selectedTimeIndex === 0
                  ? { backgroundColor: COLORS.Red }
                  : {},
              ] }>
              <Text style={ [styles.timeText, 0 === selectedTimeIndex ? { color: COLORS.White } : {}] }>Tất cả</Text>
            </View>
          </TouchableOpacity>


          {
            timeARR.map((item, index) => {
              return (
                <TouchableOpacity key={ index + 1 } onPress={ () => {
                  toggleTime(index + 1, item);
                } }>
                  <View
                    style={ [
                      styles.timeContainer,
                      index + 1 === 0
                        ? { marginLeft: SPACING.space_24 }
                        : index === timeARR.length - 1
                          ? { marginRight: SPACING.space_24 }
                          : {},
                      index + 1 === selectedTimeIndex
                        ? { backgroundColor: COLORS.Red }
                        : {},
                    ] }>

                    <Text style={ [styles.timeText, index + 1 === selectedTimeIndex ? { color: COLORS.White } : {}] }>{ item.label ?? "" }</Text>

                  </View>
                </TouchableOpacity>
              );
            })
          }

        </ScrollView>
      </View>
        : <></>
      }
      <View style={ styles.body }>

        <View style={ { borderRadius: 10, marginTop: 20, marginHorizontal: 24, paddingVertical: 15, backgroundColor: 'white' } }>
          { !dataNot ? <ScrollView
            horizontal={ true }
            showsHorizontalScrollIndicator={ false }
            contentContainerStyle={ { gap: 15, paddingLeft: 15, } }
          >
            { <TouchableOpacity onPress={ () => allBrand() } style={ { justifyContent: 'center', alignItems: 'center', } }>
              <View style={ { borderColor: 0 == selectedBrand ? COLORS.Red : COLORS.GreyWhite, borderWidth: 2, padding: 5, borderRadius: 10 } }>
                <Image style={ { resizeMode: 'contain', height: 40, width: 40 } } source={ { uri: "https://res.cloudinary.com/dqpwsunpc/image/upload/v1730307886/igugmco1rieyhpveixnv.jpg" } } />

              </View>
              <Text numberOfLines={ 1 } style={ { textAlign: 'center', width: 70, color: 0 == selectedBrand ? COLORS.Red : 'grey', fontWeight: 'bold' } }>All</Text>
            </TouchableOpacity> }
            {
              listBrand.map((item, index) => {
                return (
                  <TouchableOpacity key={ item.logo } onPress={ () => toggleBrand(item, index) } style={ { justifyContent: 'center', alignItems: 'center' } }>
                    <View style={ { borderColor: index + 1 === selectedBrand ? COLORS.Red : COLORS.GreyWhite, borderWidth: 2, padding: 5, borderRadius: 10 } }>
                      <Image style={ { resizeMode: 'contain', height: 40, width: 40 } } source={ { uri: item.logo } } />
                    </View>
                    <Text numberOfLines={ 1 } style={ { textAlign: 'center', width: 70, color: index + 1 === selectedBrand ? COLORS.Red : 'grey', fontWeight: 'bold' } }>{ item.name }</Text>
                  </TouchableOpacity>
                );
              })
            }
          </ScrollView> : <Text style={ { textAlign: 'center', color: 'black', fontSize: 25, fontWeight: 'bold' } }>Không có Lịch Chiếu</Text> }

        </View>
        {
          !dataNot ?
            <>
              <View style={ { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 10 } }>
                <Text style={ { color: 'black', fontSize: 20, fontWeight: 'bold' } }>
                  CGV
                </Text>
                <Text style={ { color: 'black', fontSize: 20, fontWeight: 'bold' } }>
                  Số rạp
                </Text>
              </View>
              <ScrollView contentContainerStyle={ { display: 'flex', gap: 15, marginHorizontal: 24, marginTop: 10, } }>
                {
                  cinemaData.map((item, index) => {
                    return (
                      <View key={ item.cinema._id } style={ { backgroundColor: 'white', borderRadius: 10, borderRadius: 10, padding: 10, } }>
                        <View style={ { flexDirection: 'row' } }>
                          <View style={ { flexDirection: 'row', flex: 1 } }>
                            <View style={ { flexDirection: 'row', flex: 1 } }>
                              <View style={ { borderColor: COLORS.GreyWhite, borderWidth: 2, padding: 5, borderRadius: 10 } }>
                                <Image style={ { height: 40, width: 40 } } source={ { uri: item.cinema.brandId.logo } } />
                              </View>
                              <View style={ { marginLeft: 10, alignSelf: 'center' } }>
                                <Text style={ { color: 'black', fontSize: 14, fontWeight: 'bold' } }>
                                  { item.cinema.name }
                                </Text>
                                <Text numberOfLines={ 1 } style={ { color: 'black', fontSize: 12, width: 220 } }>
                                  { item.cinema.address }
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity onPress={ () => toggleExpand(item.cinema._id) } style={ { height: 50, width: 50, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' } }>
                              <Image style={ { width: 30, height: 30, } } source={ require('../../../image/image.png') } />
                            </TouchableOpacity>
                          </View>
                        </View>
                        { expanded[item.cinema._id] && (
                          <View style={ { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", marginTop: 10, } }>
                            { item.showtimes.map((item1, index) => (
                              <TouchableOpacity
                                onPress={ () => toggleSeat(item, item1, index) }
                                key={ 'Room' + index }
                                // onPress={() => setSelectedTimeIndex(index + 1)}
                                style={ {
                                  flexBasis: '30%', // Tùy chỉnh để item chiếm khoảng 30% chiều rộng
                                  marginBottom: 10,
                                  marginRight: index % 3 !== 2 ? '3%' : 0, // Cách đều trừ item cuối dòng
                                } }
                              >
                                <View
                                  style={ styles.timeContainer }
                                >
                                  <Text
                                    style={ [
                                      styles.timeText,

                                    ] }
                                  >
                                    { `${formatTime(item1.startTime)}-${formatTime(item1.endTime)}` ?? "" }
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            )) }
                          </View>
                        ) }
                      </View>
                    );
                  })
                }
              </ScrollView></>
            : <></>
        }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.Black,
  },
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
  container: {
    display: 'flex',
    flex: 1,

  },
  empty: {
    padding: 10,
    margin: 5,
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


