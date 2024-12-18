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
const Seat = memo(({ seatId, isSelected, onSeatPress, isMinimap, seatType, lockedByOther }) => {
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
      // seatStyle = styles.legendColorSelected;
      seatStyle = lockedByOther
        ? styles.legendColorSelectedAnother // Màu xanh dương khi người khác chọn
        : styles.legendColorSelected;       // Màu xanh lá khi bạn chọn
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

  const { startTime, day, showtimeId, movieId, endTime, cinemaId, reset, userId123, roomId } = route.params;

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
  const [showtimeUser, setshowtimeUser] = useState(showtimeId)

  const navigation = useNavigation();
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
    loadSeatMap();
  }, []);



  // useEffect(() => {
  //   // Gọi loadSeatMap ngay khi màn hình được render
  //   loadSeatMap();

  //   // Thiết lập setInterval để gọi loadSeatMap mỗi 5 giây
  //   const interval = setInterval(() => {
  //     console.log('Đang tải lại sơ đồ ghế...');
  //     loadSeatMap();
  //   }, 5000); // 5 giây

  //   // Dọn dẹp interval khi component bị unmount
  //   return () => clearInterval(interval);
  // }, []);



  console.log("(userId:", userId123);
  console.log("roomId", roomId);
  // const socket = io(`${API_BASE_URL}`);
  const socket = io(`${API_BASE_URL}`, {
    query: {
      showTimeID: showtimeId,
      userID: userId123,
    },
  });
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
    socket.on('seat_map_updated', ({ showtimeId, seatMap }) => {
      if (showtimeId == showtimeUser) {
        const updatedSeatMap = seatMap.map((row) =>
          row.map((seat) => ({
            ...seat,
            lockedByOther: seat.userId && seat.userId !== userId123,
          }))
        );

        setSeatMap(updatedSeatMap.map(row => row.map(seat => seat.status)));
        setSeatMapId(updatedSeatMap);
      }


    });

    return () => {
      socket.off('seat_map_updated'); // Cleanup để tránh memory leak
    };
  }, [userId123, socket]);


  useEffect(() => {
    loadUserData();
    loadSeatMap();

    /* cũ đúng gốc
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
    */


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







  const loadSeatMap = async () => {
    // setIsLoading(true);
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
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    // Gọi hàm cập nhật seatMap
    console.log("Ghế hiện tại sau khi cập nhật123:", seatMap);

  }, [seatMap]); // Gây vòng lặp vô hạn vì loadSeatMap cập nhật seatMap



  //Gọi API để tải sơ đồ ghế khi màn hình được mở
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
  }, 150);


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
      socket.emit('leave_showtime', { showtimeId, userId });
    });

    // Cleanup khi component bị hủy
    return () => {

      socket.off('seat_selected');
      socket.off('seat_deselected');
      socket.off('seat_locked');
      socket.off('seat_unlocked');
      socket.off('seat_map');
      socket.off('disconnect');
    };
  }, [showtimeId, userId, socket, originalSeatMap]);





  // Phần mã Client - Xử lý việc chọn ghế trên giao diện người dùng
  const handleSeatPress = useCallback((seatId, rowIndex, colIndex, seatType) => {
    // Kiểm tra nếu ghế không thể chọn (đã đặt hoặc không khả dụng)
    if (seatType === 'U' || seatType === '_') {
      Alert.alert('Thông báo', 'Ghế này đã được đặt hoặc không thể chọn.');
      return;
    }


    /*
        // Kiểm tra nếu ghế đã được chọn và người giữ ghế không phải là người hiện tại
        if (seatType === 'P') {
          const currentSeatUser = seatMapId[rowIndex][colIndex]?.userId; // Lấy userId từ seatMapId
          console.log('User giữ ghế:', currentSeatUser);
    
          // Nếu ghế đã được chọn bởi người khác, hiển thị cảnh báo
          if (currentSeatUser && currentSeatUser !== userId) {
            Alert.alert('Thông báo', 'Ghế này đã được chọn bởi người dùng khác.');
            return;
          }
        }
    */
    if (seatType === 'P') {
      const currentSeatUser =
        seatMapId[rowIndex] && seatMapId[rowIndex][colIndex]
          ? seatMapId[rowIndex][colIndex].userId
          : null; // Đảm bảo không bị undefined

      console.log('User giữ ghế:', currentSeatUser);

      // Nếu ghế đã được chọn bởi người khác, hiển thị cảnh báo
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

      // Nếu ghế đã được chọn, hủy chọn ghế
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
        // Nếu ghế chưa được chọn, thêm ghế vào danh sách và gửi thông tin chọn ghế
        updatedSeats = [...prevSeats, { seatId, rowIndex, colIndex, price: seatPrice, time: currentTime }];
        socket.emit('select_seat', { showtimeId, row: rowIndex, col: colIndex, userId, time: currentTime });  // Gửi thời gian
        setSeatMap((prevMap) =>
          prevMap.map((rowSeats, rIndex) =>
            rIndex === rowIndex
              ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? 'P' : seat)) // Đánh dấu ghế là đang chọn
              : rowSeats
          )
        );
        // Test 2 users book seat at same time
        // await Promise.all([
        //   bookSeatOne(showtimeId, rowIndex, colIndex, 'userOne', Date.now())
        //     .then(() => console.log('User One booked successfully'))
        //     .catch((err) => console.error('User One failed:', err)),
        //   bookSeatTwo(showtimeId, rowIndex, colIndex, 'userId123', Date.now())
        //     .then(() => console.log('User Two booked successfully'))
        //     .catch((err) => console.error('User Two failed:', err)),
        // ]);
        console.log('in ra cái ghế chọn', updatedSeats);
      }

      return updatedSeats;
    });
  }, [seatMap, originalSeatMap, seatPrices, userId, debouncedSeatPress]);

  const bookSeatOne = (showtimeId, rowIndex, colIndex, userId, currentTime) => {
    console.log('bookSeatOne time: ', new Date().getTime());
    socket.emit('select_seat', {
      showtimeId,
      row: rowIndex,
      col: colIndex,
      userId,
      time: currentTime,
    }); // Gửi thời gian
  };

  const bookSeatTwo = (showtimeId, rowIndex, colIndex, userId, currentTime) => {
    console.log('bookSeatTwo time: ', new Date().getTime());
    socket.emit('select_seat', {
      showtimeId,
      row: rowIndex,
      col: colIndex,
      userId,
      time: currentTime,
    }); // Gửi thời gian
  };






  useEffect(() => {
    socket.on('seat_timeout', ({ seatId, rowIndex, colIndex }) => {
      // Khi ghế hết thời gian thanh toán và bị hoàn tác
      setSelectedSeats((prevSeats) => {
        // Loại bỏ ghế đã hết thời gian thanh toán khỏi selectedSeats
        return prevSeats.filter((seat) => seat.seatId !== seatId);
      });

      setSeatMap((prevMap) =>
        prevMap.map((rowSeats, rIndex) =>
          rIndex === rowIndex
            ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? 'T' : seat)) // Đặt lại trạng thái ghế thành 'T'
            : rowSeats
        )
      );

      console.log(`Ghế (${rowIndex}, ${colIndex}) đã hết thời gian thanh toán và bị hoàn tác.`);
    });

    return () => {
      socket.off('seat_timeout'); // Đảm bảo tắt sự kiện khi component bị unmount
    };
  }, []);

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
      roomId: roomId,
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
      returnUrl: 'myapp://Home',
      cancelUrl: 'myapp://Home'
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

  socket.on(`reset_selected_seats_${userId123}`, ({ seatId, seatType, rowIndex, colIndex }) => {
    console.log(`[Reset Ghế] Ghế được reset:`, { seatId, seatType, rowIndex, colIndex });

    const seatPrice = seatPrices[seatType] || 0; // Giá của ghế bị reset
    setSelectedSeats((prevSeats) => {
      // Loại bỏ ghế bị reset khỏi mảng `selectedSeats`
      const updatedSeats = prevSeats.filter(
        (seat) => seat.rowIndex !== rowIndex || seat.colIndex !== colIndex
      );
      return updatedSeats;
    });

    // Cập nhật lại sơ đồ ghế
    setSeatMap((prevMap) =>
      prevMap.map((rowSeats, rIndex) =>
        rIndex === rowIndex
          ? rowSeats.map((seat, cIndex) =>
            cIndex === colIndex ? originalSeatMap[rowIndex][colIndex] : seat
          )
          : rowSeats
      )
    );

    // Tính toán lại tổng giá tiền và số ghế đã chọn
    setTotalPrice((prevTotal) => prevTotal - seatPrice);
    setSeatCount((prevCount) => prevCount - 1);
  });


  /*gốc
    socket.on(`error_${userId123}`, ({ message }) => {
      Alert.alert('Error', message);
    });
  gốc */
  /* gần đúng
   socket.on(`error_${userId123}`, ({ seatId, seatType, rowIndex, colIndex, message }) => {
     console.log(`[Lỗi Ghế] Ghế lỗi:`, { seatId, seatType, rowIndex, colIndex });
  
     const seatPrice = seatPrices[seatType] || 0;
  
     // Loại bỏ ghế khỏi danh sách đã chọn
     setSelectedSeats((prevSeats) =>
       prevSeats.filter(
         (seat) => seat.rowIndex !== rowIndex || seat.colIndex !== colIndex
       )
     );
  
     // Cập nhật lại sơ đồ ghế
     setSeatMap((prevMap) =>
       prevMap.map((rowSeats, rIndex) =>
         rIndex === rowIndex
           ? rowSeats.map((seat, cIndex) =>
             cIndex === colIndex ? originalSeatMap[rowIndex][colIndex] : seat
           )
           : rowSeats
       )
     );
  
     // Giảm tổng giá tiền và số ghế đã chọn
     setTotalPrice((prevTotal) => prevTotal - seatPrice);
     setSeatCount((prevCount) => prevCount - 1);
  
     // Hiển thị thông báo lỗi
     Alert.alert('Error', message);
   });
  
  */
  socket.on(`error_${userId123}`, ({ seatId, seatType, rowIndex, colIndex, message }) => {
    console.log(`[Lỗi Ghế] Ghế lỗi:`, { seatId, seatType, rowIndex, colIndex });

    const seatPrice = seatPrices[seatType] || 0;

    // Loại bỏ ghế khỏi danh sách đã chọn
    setSelectedSeats((prevSeats) =>
      prevSeats.filter(
        (seat) => seat.rowIndex !== rowIndex || seat.colIndex !== colIndex
      )
    );
    /*
        // Cập nhật lại sơ đồ ghế: đổi màu ghế thành "được người khác chọn"
        setSeatMap((prevMap) =>
          prevMap.map((rowSeats, rIndex) =>
            rIndex === rowIndex
              ? rowSeats.map((seat, cIndex) =>
                cIndex === colIndex ? 'P' : seat // 'P' biểu thị ghế được người khác chọn
              )
              : rowSeats
          )
        );
    */
    // setSeatMap((prevMap) =>
    //   prevMap.map((rowSeats, rIndex) =>
    //     rIndex === rowIndex
    //       ? rowSeats.map((seat, cIndex) =>
    //         cIndex === colIndex
    //           ? { status: 'P', lockedByOther: true } // Ghế bị khóa bởi người khác
    //           : seat
    //       )
    //       : rowSeats
    //   )
    // );
    setSeatMapId((prevSeatMapId) =>
      prevSeatMapId.map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((seat, cIndex) =>
            cIndex === colIndex
              ? { ...seat, lockedByOther: true } // Cập nhật lockedByOther
              : seat
          )
          : row
      )
    );

    // Giảm tổng giá tiền và số ghế đã chọn
    setTotalPrice((prevTotal) => prevTotal - seatPrice);
    setSeatCount((prevCount) => prevCount - 1);


    // Hiển thị thông báo lỗi
    Alert.alert('Thông báo', message);
  });



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
              const lockedByOther = seatMapId?.[rowIndex]?.[colIndex]?.lockedByOther || false;

              return (
                <Seat
                  key={ seatId }
                  seatId={ seatId }
                  isSelected={ isSelected }
                  onSeatPress={ () => handleSeatPress(seatId, rowIndex, colIndex, char) }
                  isMinimap={ isMinimap }
                  seatType={ char }
                  lockedByOther={ lockedByOther } // Truyền lockedByOther vào component
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
        <View style={ styles.legendItem }>
          <View style={ styles.legendColorSelectedAnother } />
          <Text style={ styles.legendText }>Ng # chọn</Text>
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
  legendColorSelectedAnother: {
    width: 15,
    height: 15,
    backgroundColor: 'blue',
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














