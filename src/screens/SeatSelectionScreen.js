import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Linking, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import io from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useDebounce from '../hook/useDebounce';
import API_BASE_URL from './config';
import { useFocusEffect } from '@react-navigation/native';


// Component ghế được memo hóa
const Seat = memo(({ seatId, isSelected, onSeatPress, isMinimap, seatType }) => {
  let seatStyle = styles.seat; // Mặc định là ghế thường

  // Xác định màu sắc ghế dựa vào loại
  switch (seatType) {
    case 'T':
      seatStyle = styles.legendColorStandard;
      break;
    case 'V':
      seatStyle = styles.legendColorVIP;
      break;
    case 'D':
      seatStyle = styles.legendColorSweetBox;
      break;
    case 'U':
      seatStyle = styles.legendColorReserved;
      break;
    case 'P':
      seatStyle = styles.legendColorSelected;
      break;
    default:
      break;
  }

  return (
    <TouchableOpacity
      key={ seatId }
      style={ [
        seatStyle,
        isMinimap && styles.minimapSeat,
        isSelected && (isMinimap ? styles.minimapSelectedSeat : styles.selectedSeat),
      ] }
      onPress={ () => onSeatPress(seatId) }
      disabled={ isMinimap } // Không cho phép chọn ghế trong minimap
    >
      { !isMinimap && <Text style={ styles.seatText }>{ seatId }</Text> }
    </TouchableOpacity>
  );
});

const SeatSelectionScreen = ({ route }) => {

  const { startTime, day, showtimeId, movieId, endTime, cinemaId, reset } = route.params;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState({});
  const [seatMap, setSeatMap] = useState([]);
  const [seatMapId, setSeatMapId] = useState([]);
  const [seatPrices, setSeatPrices] = useState({});
  const [originalSeatMap, setOriginalSeatMap] = useState([]);
  const [movieName, setMovieName] = useState('');
  const [roomName, setRoomName] = useState('MA');
  const [cinemaName, setCinemaName] = useState('');
  const [formattedDay, setFormattedDay] = useState('');
  const [formattedStartTime, setFormattedStartTime] = useState('');
  const [formattedEndTime, setFormattedEndTime] = useState('');
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [seatCount, setSeatCount] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });

  const navigation = useNavigation();
  const socket = io(`${API_BASE_URL}`);
  const zoomableViewRef = useRef(null);







  //reset ghế
  // Hàm lưu trạng thái ghế vào AsyncStorage
  const saveSeatState = async () => {
    try {
      const seatsData = JSON.stringify(selectedSeats);
      await AsyncStorage.setItem('selectedSeats', seatsData);
      console.log('Trạng thái ghế đã được lưu:', selectedSeats);
    } catch (error) {
      console.error('Lỗi khi lưu trạng thái ghế:', error);
    }
  };
  /// reset ghế



  useEffect(() => {
    loadUserData();
    loadSeatMap();


    socket.on('seat_map_updated', ({ seatMap }) => {
      // Chuyển đổi seatMap từ server thành dữ liệu sử dụng tại client
      const newSeatMapId = seatMap.map((row) =>
        row.map((seat) => ({
          userId: seat.userId, // ID người dùng giữ ghế
          status: seat.status, // Trạng thái ghế (T, V, D, P, U)
        }))
      );

      // Lưu thông tin seatMapId vào state
      setSeatMapId(newSeatMapId);

      // Cập nhật sơ đồ ghế hiển thị

      setSeatMap(seatMap.map((row) => row.map((seat) => seat.status)));
      loadSeatMap();
    });




    socket.on('seat_selected', ({ row, col, userId: selectedUserId }) => {
      if (userId !== selectedUserId) {
        setSeatMap(prevMap =>
          prevMap.map((rowSeats, rowIndex) =>
            rowSeats.map((seat, colIndex) =>
              rowIndex === row && colIndex === col ? 'P' : seat
            )
          )
        );
      }
    });

    socket.on('error', ({ message }) => {
      Alert.alert('Error', message);
    });

    return () => {
      console.log("Socket disconnecting...");
      socket.disconnect();
    };
  }, []);






  useEffect(() => {
    // Lắng nghe socket chỉ một lần khi component mount
    socket.on('seat_map_updated', ({ seatMap }) => {
      const newSeatMapId = seatMap.map((row) =>
        row.map((seat) => ({
          userId: seat.userId, // ID người dùng giữ ghế
          status: seat.status, // Trạng thái ghế
        }))
      );

      setSeatMapId(newSeatMapId);
      setSeatMap(seatMap.map((row) => row.map((seat) => seat.status)));
    });

    socket.on('seat_selected', ({ row, col, userId: selectedUserId }) => {
      if (userId !== selectedUserId) {
        setSeatMap((prevMap) =>
          prevMap.map((rowSeats, rowIndex) =>
            rowSeats.map((seat, colIndex) =>
              rowIndex === row && colIndex === col ? 'P' : seat
            )
          )
        );
      }
    });

    socket.on('error', ({ message }) => {
      Alert.alert('Error', message);
    });

    return () => {
      // Ngắt kết nối socket khi component unmount
      socket.disconnect();
    };
  }, []); // Lắng nghe chỉ một lần



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



  const loadSeatMap = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/showtimes/${showtimeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cinemaId })
      });
      const data = await response.json();

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        });
      };

      const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        });
      };

      setFormattedDay(formatDate(data.day));
      setFormattedStartTime(formatTime(data.startTime));
      setFormattedEndTime(formatTime(data.endTime));
      setMovieName(data.movieName);
      setCinemaName(data.cinemaName);
      setRoomName(data.roomName);

      const prices = {};
      data.seatTypes.forEach(type => {
        prices[type.typeSeatName] = type.typeSeatPrice;
      });
      setSeatPrices(prices);

      if (data.Room_Shape) {
        const rows = data.Room_Shape.split('/').map(row => row.split(''));
        setSeatMap(rows);
        console.log("Ghế hiện tại:", seatMap);
        setOriginalSeatMap(_.cloneDeep(rows));
      } else {
        Alert.alert('Error', 'Không tìm thấy layout ghế');
      }
    } catch (error) {
      Alert.alert('Error', 'Lỗi khi lấy dữ liệu ghế');
      console.error('Chi tiết lỗi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Gọi hàm cập nhật seatMap
    console.log("Ghế hiện tại sau khi cập nhật123:", seatMap);

  }, [seatMap]); // Gây vòng lặp vô hạn vì loadSeatMap cập nhật seatMap



  // Gọi API để tải sơ đồ ghế khi màn hình được mở
  useEffect(() => {
    loadSeatMap();
  }, []);






  // Gọi API để tải `seatMap` khi màn hình được mở
  useEffect(() => {
    loadSeatMap();
  }, []);



  useEffect(() => {
    const newTotalPrice = Array.isArray(selectedSeats)
      ? selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
      : 0;

    setTotalPrice(newTotalPrice);

    const averageSeatPrice = Object.values(seatPrices).reduce((sum, price) => sum + price, 0) / Object.values(seatPrices).length;
    const estimatedSeatCount = Math.round(newTotalPrice / averageSeatPrice);
    setSeatCount(estimatedSeatCount);
  }, [selectedSeats, seatPrices]);









  const debouncedSeatPress = useDebounce((seatId, rowIndex, colIndex, seatType) => {
    handleSeatPress(seatId, rowIndex, colIndex, seatType);
  }, 50);


  useEffect(() => {
    // Khi người dùng kết nối
    socket.emit('join_showtime', { showtimeId, userId });

    // Lắng nghe các sự kiện từ server
    socket.on('seat_selected', ({ seatId, rowIndex, colIndex, userId, time }) => {
      setSeatMap(prevMap =>
        prevMap.map((rowSeats, rIndex) =>
          rIndex === rowIndex
            ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? 'P' : seat))
            : rowSeats
        )
      );
      // Lưu thời gian ghế được chọn để quản lý
      seatMapId[rowIndex][colIndex].time = time;
    });

    socket.on('seat_deselected', ({ seatId, rowIndex, colIndex }) => {
      setSeatMap(prevMap =>
        prevMap.map((rowSeats, rIndex) =>
          rIndex === rowIndex
            ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? originalSeatMap[rowIndex][colIndex] : seat))
            : rowSeats
        )
      );
      // Xóa thời gian khi ghế bị bỏ chọn
      seatMapId[rowIndex][colIndex].time = null;
    });

    socket.on('seat_locked', ({ seatId, userId }) => {
      setLockedSeats(prevLockedSeats => ({
        ...prevLockedSeats,
        [seatId]: userId
      }));
    });

    socket.on('seat_unlocked', ({ seatId }) => {
      setLockedSeats(prevLockedSeats => {
        const updatedLockedSeats = { ...prevLockedSeats };
        delete updatedLockedSeats[seatId];
        return updatedLockedSeats;
      });
    });

    socket.on('seat_map', (seatMap) => {
      setSeatMap(seatMap);
    });

    // Xử lý khi người dùng rời khỏi (disconnect)
    socket.on('disconnect', () => {
      Alert.alert('Thông báo', 'Kết nối bị mất');
    });

    // Cleanup khi component bị hủy
    return () => {
      socket.emit('leave_showtime', { showtimeId, userId });
      socket.off('seat_selected');
      socket.off('seat_deselected');
      socket.off('seat_locked');
      socket.off('seat_unlocked');
      socket.off('seat_map');
      socket.off('disconnect');
    };
  }, [showtimeId, userId, socket, originalSeatMap]);






  const handleSeatPress = useCallback((seatId, rowIndex, colIndex, seatType) => {
    if (seatType === 'U' || seatType === '_') {
      Alert.alert('Thông báo', 'Ghế này đã được đặt hoặc không thể chọn.');
      return;
    }

    if (seatType === 'P') {
      const currentSeatUser = seatMapId[rowIndex][colIndex]?.userId; // Lấy userId từ seatMapId
      console.log('User giữ ghế:', currentSeatUser);

      if (currentSeatUser && currentSeatUser !== userId) {
        Alert.alert('Thông báo', 'Ghế này đã được chọn bởi người dùng khác.');
        return;
      }
    }

    const seatPrice = seatPrices[seatType] || 0;
    const currentTime = Date.now();  // Thêm thời gian hiện tại

    setSelectedSeats((prevSeats) => {
      const isSeatSelected = prevSeats.some(seat => seat.seatId === seatId);
      let updatedSeats;

      if (isSeatSelected) {
        updatedSeats = prevSeats.filter(seat => seat.seatId !== seatId);
        socket.emit('deselect_seat', { showtimeId, row: rowIndex, col: colIndex, userId });
        const originalType = originalSeatMap[rowIndex][colIndex];
        setSeatMap((prevMap) =>
          prevMap.map((rowSeats, rIndex) =>
            rIndex === rowIndex
              ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? originalType : seat))
              : rowSeats
          )
        );
      } else {
        updatedSeats = [...prevSeats, { seatId, rowIndex, colIndex, price: seatPrice, time: currentTime }];
        socket.emit('select_seat', { showtimeId, row: rowIndex, col: colIndex, userId, time: currentTime });  // Gửi thời gian
        setSeatMap((prevMap) =>
          prevMap.map((rowSeats, rIndex) =>
            rIndex === rowIndex
              ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? 'P' : seat))
              : rowSeats
          )
        );
      }

      return updatedSeats;
    });
  }, [seatMap, originalSeatMap, seatPrices, showtimeId, userId, debouncedSeatPress]);
  /* 
  /// gốc
    const handleSeatPress = useCallback((seatId, rowIndex, colIndex, seatType) => {
      if (seatType === 'U' || seatType === '_') {
        Alert.alert('Thông báo', 'Ghế này đã được đặt hoặc không thể chọn.');
        return;
      }
  
  
      if (seatType === 'P') {
        const currentSeatUser = seatMapId[rowIndex][colIndex]?.userId; // Lấy userId từ seatMapId
        console.log('User giữ ghế:', currentSeatUser);
  
        if (currentSeatUser && currentSeatUser !== userId) {
          Alert.alert('Thông báo', 'Ghế này đã được chọn bởi người dùng khác.');
          return;
        }
      }
  
  
  
  
  
  
      const seatPrice = seatPrices[seatType] || 0;
  
      setSelectedSeats((prevSeats) => {
        const isSeatSelected = prevSeats.some(seat => seat.seatId === seatId);
        let updatedSeats;
  
        if (isSeatSelected) {
          updatedSeats = prevSeats.filter(seat => seat.seatId !== seatId);
          socket.emit('deselect_seat', { showtimeId, row: rowIndex, col: colIndex, userId });
          const originalType = originalSeatMap[rowIndex][colIndex];
          setSeatMap((prevMap) =>
            prevMap.map((rowSeats, rIndex) =>
              rIndex === rowIndex
                ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? originalType : seat))
                : rowSeats
            )
          );
        } else {
          updatedSeats = [...prevSeats, { seatId, rowIndex, colIndex, price: seatPrice }];
          socket.emit('select_seat', { showtimeId, row: rowIndex, col: colIndex, userId });
          setSeatMap((prevMap) =>
            prevMap.map((rowSeats, rIndex) =>
              rIndex === rowIndex
                ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? 'P' : seat))
                : rowSeats
            )
          );
        }
  
        return updatedSeats;
      });
    }, [seatMap, originalSeatMap, seatPrices, showtimeId, userId, debouncedSeatPress]);
  ///
  */

  /*
  /// sửa theo lỗi mới
    useEffect(() => {
      socket.on('seat_locked', ({ seatId }) => {
        Alert.alert('Thông báo', `Ghế ${seatId} đã được giữ thành công.`);
        // Cập nhật trạng thái ghế trên UI
        setSeatMap((prevMap) =>
          prevMap.map((rowSeats) =>
            rowSeats.map((seat) => (seat.seatId === seatId ? { ...seat, type: 'P' } : seat))
          )
        );
      });
  
      socket.on('seat_unlocked', ({ row, col }) => {
        Alert.alert('Thông báo', `Ghế tại hàng ${row}, cột ${col} đã được giải phóng.`);
        // Cập nhật trạng thái ghế trên UI
        setSeatMap((prevMap) =>
          prevMap.map((rowSeats, rIndex) =>
            rIndex === row
              ? rowSeats.map((seat, cIndex) =>
                cIndex === col ? { ...seat, type: 'T' } : seat
              )
              : rowSeats
          )
        );
      });
  
      return () => {
        socket.off('seat_locked');
        socket.off('seat_unlocked');
      };
    }, []);
  
    const handleSeatPress = useCallback((seatId, rowIndex, colIndex, seatType) => {
      // Kiểm tra nếu ghế đã bị khóa
      const lockedSeat = lockedSeats[`${showtimeId}-${rowIndex}-${colIndex}`];
      if (lockedSeat && lockedSeat !== userId) {
        Alert.alert('Thông báo', 'Ghế này đã bị khóa bởi người dùng khác.');
        return;
      }
  
  
      if (seatType === 'U' || seatType === '_') {
        Alert.alert('Thông báo', 'Ghế này đã được đặt hoặc không thể chọn.');
        return;
      }
  
      if (seatType === 'P') {
        const currentSeatUser = seatMapId[rowIndex][colIndex]?.userId; // Lấy userId từ seatMapId
        console.log('User giữ ghế:', currentSeatUser);
  
        if (currentSeatUser && currentSeatUser !== userId) {
          Alert.alert('Thông báo', 'Ghế này đã được chọn bởi người dùng khác.');
          return;
        }
      }
      if (selectedSeats.length >= 5 && !selectedSeats.some(seat => seat.seatId === seatId)) {
        Alert.alert('Thông báo', 'Bạn không thể chọn quá 5 ghế cùng lúc.');
        return;
      }
      const seatPrice = seatPrices[seatType] || 0;
  
      setSelectedSeats((prevSeats) => {
        const isSeatSelected = prevSeats.some(seat => seat.seatId === seatId);
        let updatedSeats;
  
        if (isSeatSelected) {
          updatedSeats = prevSeats.filter(seat => seat.seatId !== seatId);
          socket.emit('deselect_seat', { showtimeId, row: rowIndex, col: colIndex, userId });
          const originalType = originalSeatMap[rowIndex][colIndex];
          setSeatMap((prevMap) =>
            prevMap.map((rowSeats, rIndex) =>
              rIndex === rowIndex
                ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? originalType : seat))
                : rowSeats
            )
          );
        } else {
          updatedSeats = [...prevSeats, { seatId, rowIndex, colIndex, price: seatPrice }];
          socket.emit('select_seat', { showtimeId, row: rowIndex, col: colIndex, userId });
          setSeatMap((prevMap) =>
            prevMap.map((rowSeats, rIndex) =>
              rIndex === rowIndex
                ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? 'P' : seat))
                : rowSeats
            )
          );
        }
  
        return updatedSeats;
      });
    }, [seatMap, originalSeatMap, seatPrices, showtimeId, userId, debouncedSeatPress, lockedSeats]);
  */










  useEffect(() => {
    socket.on('seat_locked', ({ row, col, userId }) => {
      setSeatMap((prevMap) =>
        prevMap.map((rowSeats, rIndex) =>
          rIndex === row
            ? rowSeats.map((seat, cIndex) => (cIndex === col ? 'P' : seat))
            : rowSeats
        )
      );
      // Cập nhật lockedSeats
      setLockedSeats((prevLockedSeats) => ({
        ...prevLockedSeats,
        [`${showtimeId}-${row}-${col}`]: userId,
      }));
    });

    socket.on('seat_unlocked', ({ row, col }) => {
      setSeatMap((prevMap) =>
        prevMap.map((rowSeats, rIndex) =>
          rIndex === row
            ? rowSeats.map((seat, cIndex) => (cIndex === col ? originalSeatMap[row][col] : seat))
            : rowSeats
        )
      );
      // Xóa khỏi lockedSeats
      setLockedSeats((prevLockedSeats) => {
        const updatedLockedSeats = { ...prevLockedSeats };
        delete updatedLockedSeats[`${showtimeId}-${row}-${col}`];
        return updatedLockedSeats;
      });
    });

    return () => {
      socket.off('seat_locked');
      socket.off('seat_unlocked');
    };
  }, [showtimeId, originalSeatMap]);





  // Lắng nghe thông tin ghế đã được chọn từ server
  useEffect(() => {
    socket.on('seat_selected', ({ row, col, userId }) => {
      if (seatMap[row][col] === 'P') {
        Alert.alert('Thông báo', `Ghế ${row}-${col} đã được chọn.`);
      }
    });

    return () => {
      socket.off('seat_selected');
    };
  }, [seatMap]);



  const handleBook = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một ghế.');
      return;
    }

    const seatsData = selectedSeats.map(seat => ({
      seatName: seat.seatId,
      price: seat.price,
    }));

    const bookingData = {
      showtimeId: showtimeId,
      seats: seatsData,
      cinemaName: cinemaName,
      roomName: roomName,
      showTime: formattedStartTime,
      showDate: formattedDay,
      movieName: movieName,
      userId: userId,
      movieId: movieId,
      amount: totalPrice,
      description: `Thanh toán vé phim`,
      returnUrl: 'myapp://home123',
      cancelUrl: 'myapp://home123'
    };
    /*
    navigation.navigate('Combo', {

      bookingData: bookingData,
    });
    */
    try {
      // Lưu trạng thái ghế trước khi chuyển màn hình
      await saveSeatState();

      // Chuyển màn hình
      navigation.navigate('Combo', {
        bookingData: bookingData,
      });
    } catch (error) {
      console.error('Lỗi khi lưu trạng thái hoặc điều hướng:', error);
    }
  };



  // goBack





  const handleGoBack = () => {
    Alert.alert(
      'Thoát màn hình',
      'Bạn có chắc chắn muốn thoát? Các lựa chọn ghế của bạn sẽ bị mất.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Thoát',
          onPress: () => {
            // Reset trạng thái
            selectedSeats.forEach(seat => {
              socket.emit('deselect_seat', {
                showtimeId,
                row: seat.rowIndex,
                col: seat.colIndex,
                userId,
              });
            });
            setSelectedSeats([]);
            setSeatMap(_.cloneDeep(originalSeatMap));

            // Điều hướng quay lại
            navigation.goBack();
          },
        },
      ]
    );
  };




  //goBack
  const renderSeats = useCallback(
    (isMinimap = false) => {
      if (!Array.isArray(seatMap) || seatMap.length === 0) {
        return <Text style={ { color: 'white' } }>Đang tải dữ liệu ghế...</Text>;
      }

      const seats = seatMap.map((row, rowIndex) => {
        if (row.length > 0) {
          const seatRow = row.map((char, colIndex) => {
            if (char !== '_') {
              const seatId = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
              const isSelected = Array.isArray(selectedSeats) && selectedSeats.includes(seatId);

              return (
                <Seat
                  key={ seatId }
                  seatId={ seatId }
                  isSelected={ isSelected }
                  onSeatPress={ () => handleSeatPress(seatId, rowIndex, colIndex, char) }
                  isMinimap={ isMinimap }
                  seatType={ char }
                />
              );
            }
            return null;
          });

          return (
            <View key={ `row-${rowIndex}` } style={ styles.seatRow }>
              { seatRow }
            </View>
          );
        }
        return null;
      });

      return seats;
    },
    [seatMap, selectedSeats, handleSeatPress]
  );

  const handleZoomAfter = useCallback(
    _.throttle((event, gestureState, zoomableViewEventObject) => {
      setZoomLevel(zoomableViewEventObject.zoomLevel);
      setViewPosition({
        x: zoomableViewEventObject.offsetX,
        y: zoomableViewEventObject.offsetY,
      });
    }, 100),
    []
  );

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const minimapWidth = 120;
  const minimapHeight = 120;
  const seatMapWidth = 10 * 36;
  const seatMapHeight = 10 * 36;
  const minimapScale = (minimapWidth / seatMapWidth) * 2;

  const viewportWidth = Math.min((screenWidth * minimapScale) / zoomLevel, minimapWidth);
  const viewportHeight = Math.min((screenHeight * minimapScale) / zoomLevel, minimapHeight);

  return (
    <GestureHandlerRootView style={ styles.container }>
      <View style={ styles.header }>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={ 24 } color="red" style={ styles.backButton } onPress={ handleGoBack } />
        </TouchableOpacity>
        <View style={ styles.headerTitleContainer }>
          <Text style={ styles.headerText }>{ cinemaName }</Text>
          <Text style={ styles.showTimeTextHeader }>{ roomName }, { formattedDay }, { formattedStartTime }~{ formattedEndTime }</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="menu" size={ 24 } color="red" style={ styles.menuButton } />
        </TouchableOpacity>
      </View>

      { isLoading ? (
        <View style={ styles.loadingContainer }>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={ styles.loadingText }>Đang cập nhật sơ đồ ghế...</Text>
        </View>
      ) : (
        <ReactNativeZoomableView
          ref={ zoomableViewRef }
          maxZoom={ 4.0 }
          minZoom={ 0.5 }
          zoomStep={ 0.5 }
          initialZoom={ 1 }
          bindToBorders={ true }
          onZoomAfter={ handleZoomAfter }
          style={ styles.zoomableView }
        >
          <View style={ styles.seatMap }>{ renderSeats() }</View>
        </ReactNativeZoomableView>
      ) }

      <View style={ styles.minimapContainer }>
        <View style={ [styles.minimap, { width: minimapWidth, height: minimapHeight }] }>
          <View style={ [styles.seatMap, { transform: [{ scale: minimapScale }] }] }>
            { renderSeats(true) }
          </View>
          <View
            style={ [
              styles.minimapViewport,
              {
                width: viewportWidth,
                height: viewportHeight,
                transform: [
                  { translateX: -viewPosition.x * minimapScale },
                  { translateY: -viewPosition.y * minimapScale },
                ],
              },
            ] }
          />
        </View>
      </View>

      <View style={ styles.legendContainer }>
        <View style={ styles.legendItem }>
          <View style={ styles.legendColorSelected } />
          <Text style={ styles.legendText }>Đang chọn</Text>
        </View>
        <View style={ styles.legendItem }>
          <View style={ styles.legendColorReserved } />
          <Text style={ styles.legendText }>Đã đặt</Text>
        </View>
        <View style={ styles.legendItem }>
          <View style={ styles.legendColorStandard } />
          <Text style={ styles.legendText }>Thường</Text>
        </View>
        <View style={ styles.legendItem }>
          <View style={ styles.legendColorVIP } />
          <Text style={ styles.legendText }>VIP</Text>
        </View>
        <View style={ styles.legendItem }>
          <View style={ styles.legendColorSweetBox } />
          <Text style={ styles.legendText }>Sweet Box</Text>
        </View>
      </View>

      <View style={ styles.footer }>
        <Text style={ styles.movieTitle }>{ movieName }</Text>
        <Text style={ styles.movieDetails }>2D Phụ Đề Việt | Rạp STARIUM</Text>
        <Text style={ styles.price }>{ `${totalPrice.toLocaleString()} ₫` }</Text>
        <Text style={ styles.seatCount }>{ selectedSeats.length > 0 ? `${selectedSeats.length} ghế` : '0 ghế' }</Text>
        <TouchableOpacity style={ styles.bookButton } onPress={ handleBook }>
          <Text style={ styles.bookButtonText }>ĐẶT VÉ</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    paddingHorizontal: 10,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  showTimeTextHeader: {
    fontSize: 14,
    color: '#333',
  },
  menuButton: {
    paddingHorizontal: 10,
  },
  zoomableView: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 10,
  },
  seatMap: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
  },
  seatRow: {
    flexDirection: 'row',
  },
  seat: {
    width: 30,
    height: 30,
    backgroundColor: '#888',
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  minimapSeat: {
    width: 12,
    height: 12,
    margin: 1,
  },
  seatText: {
    fontSize: 8,
    color: '#fff',
  },
  selectedSeat: {
    backgroundColor: '#4CAF50',
  },
  minimapSelectedSeat: {
    backgroundColor: '#4CAF50',
  },
  minimapContainer: {
    position: 'absolute',
    top: 65,
    left: 20,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#444',
    zIndex: 1,
  },
  minimap: {
    backgroundColor: '#555',
    overflow: 'hidden',
  },
  minimapViewport: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red',
    backgroundColor: 'transparent',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColorSelected: {
    width: 15,
    height: 15,
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  legendColorReserved: {
    width: 15,
    height: 15,
    backgroundColor: '#D32F2F',
    marginRight: 5,
  },
  legendColorStandard: {
    width: 15,
    height: 15,
    backgroundColor: '#888',
    marginRight: 5,
  },
  legendColorVIP: {
    width: 15,
    height: 15,
    backgroundColor: '#E91E63',
    marginRight: 5,
  },
  legendColorSweetBox: {
    width: 15,
    height: 15,
    backgroundColor: '#FF4081',
    marginRight: 5,
  },
  legendText: {
    color: '#fff',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  movieTitle: {
    flex: 2,
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieDetails: {
    flex: 2,
    fontSize: 12,
    color: '#777',
  },
  price: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
  },
  seatCount: {
    fontSize: 10,
    color: '#555',
    textAlign: 'right',
    marginLeft: 5,
  },
  bookButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
});

export default SeatSelectionScreen;














