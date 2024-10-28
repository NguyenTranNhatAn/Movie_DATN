
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

const generateSeats = () => {
  const numRow = 8;
  let numColumn = 3;
  const rowArray = [];
  let start = 1;
  let reachnine = false;

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  for (let i = 0; i < numRow; i++) {
    const columnArray = [];
    for (let j = 0; j < numColumn; j++) {
      const seatObject = {
        number: start,
        row: rows[i],

        taken: Boolean(Math.round(Math.random())),
        selected: false,
      };

      columnArray.push(seatObject);
      start++;
    }
    if (i === 3) {
      numColumn += 2;
    }
    if (numColumn < 9 && !reachnine) {
      numColumn += 2;
    } else {
      reachnine = true;
      numColumn -= 2;
    }
    rowArray.push(columnArray);
  }
  return rowArray;
};
const generateSeat = (roomShape) => {
 

  const rowArray =  roomShape.split('/').filter(row => row.trim() !== '').map(row =>row.split(''));
  const designArr= []
  let start = 1;
  let reachnine = false;

  const rows = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ]
  ;
  rowArray.forEach((row )=> {
    const columnArray = [];
    let i=0
    row.forEach((seat) => {
      const taken = (seat =='U')?true:false;
      const seatObject ={
        number:start,
        row:rows[i],
        taken:taken,
        select:false
      }
      columnArray.push(seatObject);
      start++,
      i++
    });
    designArr.push(columnArray)
  });
 
  return designArr;
};

const SeatBookScreen1 = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { showtimeData, showtimeStatus } = useSelector((state) => state.showTime);
  const [dateArray, setDateArray] = useState(generateDate());
  const [selectedDateIndex, setSelectedDateIndex] = useState();
  const [price, setPrice] = useState(0);
  const [twoDSeatArray, setTwoDSeatArray] = useState([]);
  const [selectedSeatArray, setSelectedSeatArray] = useState([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState();
 
  useEffect(() => {

    if (Object.keys(showtimeData).length === 0) {
      dispatch(GetShowTime());
    
     

    }
    console.log(showtimeData)
    setTwoDSeatArray(generateSeat(showtimeData.Room_Shape))  
  }, [dispatch, showtimeData])

  const selectSeat = (index, subindex, num) => {
    if (!twoDSeatArray[index][subindex].taken) {
      const array = [...selectedSeatArray];
      const temp = [...twoDSeatArray];
      temp[index][subindex].selected = !temp[index][subindex].selected;
      if (!array.includes(num)) {
        array.push(num);
        setSelectedSeatArray(array);
      } else {
        const tempindex = array.indexOf(num);
        if (tempindex > -1) {
          array.splice(tempindex, 1);
          setSelectedSeatArray(array);
        }
      }
      setPrice(array.length * 5.0);
      setTwoDSeatArray(temp);
    }
  };

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
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      <StatusBar hidden />

      <View>
        <ImageBackground
          source={{ uri: 'https://i.ytimg.com/vi/jBpUvgVFuXE/hqdefault.jpg' }}
          style={styles.ImageBG}>
          <LinearGradient colors={[COLORS.BlackRGB10, COLORS.Black]} style={styles.linearGradient}>
            <View style={styles.appHeaderContainer}>
            <AppHeader name="close" header="" action={ () => navigation.goBack() } />
            </View>
          </LinearGradient>
        </ImageBackground>
        <Text style={styles.screenText}>Screen this side</Text>
      </View>

      <View style={styles.seatContainer}>
        <View style={styles.containerGap20}>
          {twoDSeatArray?.map((item, index) => {
            return (
              <View key={index} style={styles.seatRow}>
                {item?.map((subitem, subindex) => {
                  return (
                    <TouchableOpacity
                      key={subitem.number}
                      onPress={() => {
                        selectSeat(index, subindex, subitem.number);
                      }}>
                      <View style={styles.seatContainer1}>
                        <Icon1
                          name="sofa-single"
                          style={[
                            styles.seatIcon,
                            subitem.taken ? { color: COLORS.Grey } : {},
                            subitem.selected ? { color: COLORS.Orange } : {},
                          ]}
                        />
                        <Text style={styles.seatLabel}>
                          {`${subitem.row || 'undefined'}${subitem.number || 'undefined'}`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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

export default SeatBookScreen1;


