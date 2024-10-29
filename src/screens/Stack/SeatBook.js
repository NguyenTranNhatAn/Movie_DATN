
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
const timeArray = [
  '10:30',
  '12:30',
  '14:30',
  '15:00',
  '19:30',
  '21:00',
];

const generateDate = () => {
  const date = new Date();
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdays = [];
  for (let i = 0; i < 7; i++) {
    const tempDate = {
      date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
      day: weekday[new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()],
    };
    weekdays.push(tempDate);
  }
  return weekdays;
};




const SeatBookScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [seats, setSeats] = useState([]);
  const { showtimeData, showtimeStatus } = useSelector((state) => state.showTime);
  const [dateArray, setDateArray] = useState(generateDate());
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState();
  const [price, setPrice] = useState(0);
  const [twoDSeatArray, setTwoDSeatArray] = useState([]);
  const [selectedSeatArray, setSelectedSeatArray] = useState([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState();
  useEffect(() => {

    if (Object.keys(showtimeData).length === 0) {
      dispatch(GetShowTime('671885512ababaf253de9238'));
    }
    else {

      setSeats(showtimeData.Room_Shape.split('/').filter(row => row.trim() !== ''))
    }
  }, [dispatch, showtimeData])
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    // Lắng nghe sự kiện khi ghế được chọn
    socket.on('seat_selected', (data) => {   
      dispatch(GetShowTime('671885512ababaf253de9238'));    
    })
    // Lắng nghe sự kiện khi ghế được khôi phục
    socket.on('seat_reverted', (data) => {
      console.log('Seat reverted:', data);
      const o={row:data.row,col:data.col};
      const index = selectedSeatArray.findIndex(obj => obj ===o );
      if (index !== -1) {
      const newArr=  selectedSeatArray.splice(index, 1); // Xóa đối tượng tại chỉ số tìm thấy
      setSelectedSeatArray(newArr)
      setPrice(newArr.length * 5.0);
      }
      dispatch(GetShowTime('671885512ababaf253de9238'));
     
    });
    // Lắng nghe sự kiện khi ghế đã được đặt
    socket.on('seat_booked', (data) => {
      console.log('Seat booked:', data);
      dispatch(GetShowTime('671885512ababaf253de9238'));

    });
    socket.on('deselect_seat', (data) => {
      console.log('Seat huy:', data);
      dispatch(GetShowTime('671885512ababaf253de9238'));

    });
    socket.on('error', (data) => {
      console.log(data)

    });

    // Dọn dẹp khi component unmount
    return () => {
      socket.on('disconnect')
      socket.off('seat_selected');
      socket.off('seat_reverted');
      socket.off('seat_booked');
    };
  }, []);

  const getSeatStyle = (seat, isSelected) => {
    switch (seat) {
      case 'U':
        return COLORS.Grey; // Ghế đã đặt
      case 'P':
        return COLORS.Orange; // Ghế đã đặt
      default:
        return COLORS.White; // Mặc định
    }
  };
  const handleSeatSelect = (rowIndex, seatIndex) => {
    const showtimeId = showtimeData.showtimeId;
    socket.emit('select_seat', { showtimeId, row: rowIndex, col: seatIndex });
  
    const arr = [...selectedSeatArray];
    const obj = { row: rowIndex, col: seatIndex };
    
    const seatIndexInArray = arr.findIndex(item => item.row === obj.row && item.col === obj.col);
    
    if (seatIndexInArray === -1) {
      arr.push(obj); // Add seat if not already selected
    } else {
      arr.splice(seatIndexInArray, 1); // Remove seat if already selected
    }
  
    console.log(arr);
    setPrice(arr.length * 5.0);
    setSelectedSeatArray(arr);
  };
    
  const renderSeatRow = ({ item, index }) => (
    <View style={styles.row}>
      {item.split('').map((seat, seatIndex) => {
        const seatId = index * 10 + seatIndex; // Tạo ID duy nhất cho ghế
        const isSelected = selectedIds.includes(seatId);

        return (
          seat == '_' ?
            <View style={{ width: 20, height: 20 }} key={seatId}>
            </View> :
            <TouchableOpacity key={seatId} onPress={() => handleSeatSelect(index, seatIndex)}>
              <View style={styles.seatContainer1}>

                <Icon1
                  name="sofa-single"
                  style={[
                    styles.seatIcon,
                    { color: getSeatStyle(seat, isSelected) }
                  ]} />
              </View>

            </TouchableOpacity>
        );
      })}
    </View>
  );

  const BookSeats = async () => {
    if (
      selectedSeatArray.length !== 0 &&
      timeArray[selectedTimeIndex] !== undefined &&
      dateArray[selectedDateIndex] !== undefined
    ) {
      try {
        await EncryptedStorage.setItem(
          'ticket',
          JSON.stringify({
            seatArray: selectedSeatArray,
            time: timeArray[selectedTimeIndex],
            date: dateArray[selectedDateIndex],
            //  ticketImage: route.params.PosterImage,
          }),
        );
      } catch (error) {
        console.error('Something went Wrong while storing in BookSeats Functions', error);
      }
      socket.emit('pay_for_seats', { showtimeId:showtimeData.showtimeId,seats:selectedSeatArray });
      navigation.navigate('Ticket', {
        seatArray: selectedSeatArray,
        time: timeArray[selectedTimeIndex],
        date: dateArray[selectedDateIndex],
        // ticketImage: route.params.PosterImage,
      });
    } else {
      ToastAndroid.showWithGravity(
        'Please Select Seats, Date and Time of the Show',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };


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
        <Text style={styles.screenText}>Screen this side</Text>
      </View>

      <View style={styles.seatContainer}>

        <ScrollView horizontal={true} >
          <FlatList
            contentContainerStyle={{ justifyContent: 'center', gap: 20 }}

            data={seats}
            renderItem={renderSeatRow}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
        <View style={styles.seatRadioContainer}>
          <View style={styles.radioContainer}>
            <Icon1 name="sofa-single" style={styles.radioIcon} />
            <Text style={styles.radioText}>Available</Text>
          </View>
          <View style={styles.radioContainer}>
            <Icon1 name="sofa-single" style={[styles.radioIcon, { color: COLORS.Grey }]} />
            <Text style={styles.radioText}>Taken</Text>
          </View>
          <View style={styles.radioContainer}>
            <Icon1 name="sofa-single" style={[styles.radioIcon, { color: COLORS.Orange }]} />
            <Text style={styles.radioText}>Selected</Text>
          </View>
        </View>
      </View>


      <View>
        <FlatList
          data={dateArray}
          keyExtractor={item => item.date}
          horizontal

          bounces={false}
          contentContainerStyle={styles.containerGap24}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => setSelectedDateIndex(index)}>
                <View
                  style={[
                    styles.dateContainer,
                    index === 0
                      ? { marginLeft: SPACING.space_24 }
                      : index === dateArray.length - 1
                        ? { marginRight: SPACING.space_24 }
                        : {},
                    index === selectedDateIndex
                      ? { backgroundColor: COLORS.Orange }
                      : {},
                  ]}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.OutterContainer}>
        <FlatList
          data={timeArray}
          keyExtractor={item => item}
          horizontal
          bounces={false}
          contentContainerStyle={styles.containerGap24}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => setSelectedTimeIndex(index)}>
                <View
                  style={[
                    styles.timeContainer,
                    index === 0
                      ? { marginLeft: SPACING.space_24 }
                      : index === timeArray.length - 1
                        ? { marginRight: SPACING.space_24 }
                        : {},
                    index === selectedTimeIndex
                      ? { backgroundColor: COLORS.Orange }
                      : {},
                  ]}>
                  <Text style={styles.timeText}>{item}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.buttonPriceContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalPriceText}>Total Price</Text>
          <Text style={styles.price}>$ {price}.00</Text>
        </View>
        <TouchableOpacity onPress={BookSeats}>
          <Text style={styles.buttonText}>Buy Tickets</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: COLORS.Black,
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
    height: SPACING.space_10 * 10,
    borderRadius: SPACING.space_10 * 10,
    backgroundColor: COLORS.DarkGrey,
    alignItems: 'center',
    justifyContent: 'center',

  },
  dateText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  dayText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
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
    backgroundColor: COLORS.DarkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
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

export default SeatBookScreen;


