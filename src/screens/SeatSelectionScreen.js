
import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import io from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
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


const SeatSelectionScreen = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatMap, setSeatMap] = useState([]);
  const [seatPrices, setSeatPrices] = useState({});
  const [originalSeatMap, setOriginalSeatMap] = useState([]);
  // const socket = io('http://192.168.1.28:3006');
  const socket = io('https://f1e5-171-252-189-233.ngrok-free.app');
  const showtimeId = '6731b6574d9a252f21fc014f'; // Suất chiếu mẫu
  const userId = 'RE123';
  const navigation = useNavigation();
  ////mở đầu
  useEffect(() => {
    // Lắng nghe sự kiện cập nhật sơ đồ ghế từ server
    socket.on('seat_map_updated', () => {
      loadSeatMap(); // Tự động tải lại sơ đồ ghế khi có sự thay đổi
    });

    // Lắng nghe khi ghế được chọn
    socket.on('seat_selected', ({ row, col, userId: selectedUserId }) => {
      if (userId !== selectedUserId) {
        const updatedSeatMap = seatMap.map((rowSeats, rowIndex) =>
          rowSeats.map((seat, colIndex) => {
            if (rowIndex === row && colIndex === col) return 'P'; // Đánh dấu ghế đang chờ thanh toán
            return seat;
          })
        );
        setSeatMap(updatedSeatMap);
      }
    });


    // Lắng nghe khi ghế được đặt
    socket.on('seat_booked', ({ row, col }) => {
      const updatedSeatMap = seatMap.map((rowSeats, rowIndex) =>
        rowSeats.map((seat, colIndex) => {
          if (rowIndex === row && colIndex === col) return 'U'; // Đổi trạng thái thành đã đặt
          return seat;
        })
      );
      setSeatMap(updatedSeatMap);
    });

    // Xử lý khi có lỗi
    socket.on('error', ({ message }) => {
      Alert.alert('Error', message);
    });

    return () => {
      socket.disconnect();
    };
  }, [seatMap, userId]);


  useEffect(() => {
    loadSeatMap(); // Chỉ gọi một lần khi component được mount
  }, []); // Truyền mảng rỗng để đảm bảo chỉ gọi một lần

  const loadSeatMap = async () => {
    if (!userId) {
      Alert.alert('Error', 'Vui lòng truyền userId vô');
      return;
    }

    try {
      //const response = await fetch(`http://192.168.1.28:3000/showtimes/${showtimeId}`);
      const response = await fetch(`https://be-movie-sooty.vercel.app/showtimes/${showtimeId}`);
      const data = await response.json();
      console.log('Dữ liệu từ API:', data); // In ra dữ liệu gốc từ API
      console.log('dữ liệu API moive nam:', data.movieId.name);
      // Lưu trữ giá ghế từ API vào state
      const prices = {};
      data.seatTypes.forEach(type => {
        prices[type.typeSeatName] = type.typeSeatPrice;
      });
      setSeatPrices(prices);
      if (data.Room_Shape) {
        const rows = data.Room_Shape.split('/').map(row => row.split(''));
        //const rows = data.Room_Shape;
        setSeatMap(rows);
        setOriginalSeatMap(_.cloneDeep(rows)); // Lưu bản sao ban đầu
        console.log('Dữ liệu sau khi xử lý:', rows); // In ra dữ liệu sau khi xử lý thành mảng
      } else {
        Alert.alert('Error', 'Không tìm thấy layout ghế');
      }
    } catch (error) {
      Alert.alert('Error', 'Lỗi khi lấy dữ liệu ghế');
      console.error('Chi tiết lỗi:', error);
    }
  };

  // In ra `seatMap` mỗi khi nó thay đổi để kiểm tra
  useEffect(() => {
    console.log('seatMap hiện tại:', seatMap);
  }, [seatMap]);



  ////cuối cùng

  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const zoomableViewRef = useRef(null);


  //chọn ghế
  const handleSeatPress = useCallback((seatId, rowIndex, colIndex, seatType) => {
    socket.on('error', ({ message }) => {
      console.log('Nhận thông báo lỗi:', message);
      Alert.alert('Thông báo', message);
    });
    if (seatType === 'U' || seatType === '_') {
      Alert.alert('Thông báo', 'Ghế này đã được đặt hoặc không thể chọn.');
      return;
    }

    // Kiểm tra nếu ghế đang được chọn bởi người dùng khác
    if (seatType === 'P') {
      // Giả sử bạn có lưu `userId` của người dùng đã chọn ghế trong `originalSeatMap`n 
      const currentSeatUser = originalSeatMap[rowIndex][colIndex]?.userId;
      if (currentSeatUser && currentSeatUser !== userId) {
        //Alert.alert('Thông báo', 'Ghế này đang được chọn bởi người dùng khác.');
        return;
      }
    }

    const seatPrice = seatPrices[seatType] || 0;

    setSelectedSeats(prevSeats => {
      const isSeatSelected = prevSeats.some(seat => seat.seatId === seatId);
      let updatedSeats;
      if (isSeatSelected) {
        // Bỏ chọn ghế
        updatedSeats = prevSeats.filter(seat => seat.seatId !== seatId);
        socket.emit('deselect_seat', { showtimeId, row: rowIndex, col: colIndex, userId });

        // Khôi phục trạng thái ghế ban đầu từ originalSeatMap
        const originalType = originalSeatMap[rowIndex][colIndex];
        setSeatMap(prevMap => prevMap.map((rowSeats, rIndex) =>
          rIndex === rowIndex
            ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? originalType : seat))
            : rowSeats
        ));
      } else {
        // Chọn ghế và thêm thông tin rowIndex và colIndex
        updatedSeats = [
          ...prevSeats,
          { seatId, rowIndex, colIndex, price: seatPrice }
        ];
        socket.emit('select_seat', { showtimeId, row: rowIndex, col: colIndex, userId });

        setSeatMap(prevMap => prevMap.map((rowSeats, rIndex) =>
          rIndex === rowIndex
            ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? 'P' : seat))
            : rowSeats
        ));
      }

      console.log('Updated selectedSeats:', updatedSeats);
      return updatedSeats;
    });


  }, [seatMap, originalSeatMap, seatPrices, showtimeId, userId, socket]);
  ///kết thúc chọn ghế



  //đặt vé mở đầu

  // Hàm xử lý khi đặt vé và chuyển sang trang thanh toán
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
      cinemaName: 'CGV Thủ Đức',
      roomName: 'Phòng 1',
      showTime: '14:50',
      showDate: '2024-11-01',
      movieName: 'Venom',
      userId: userId,
      movieId: '670ad1a7320f37a6308bc5a2',
      //amount: totalPrice,
      amount: 5000,
      description: `Thanh toán vé phim`,
      returnUrl: 'myapp://home', // URL để trở về sau khi thanh toán thành công
      cancelUrl: 'myapp://Seat'  // URL khi người dùng hủy thanh toán
    };
    //
    try {
      const response = await fetch('https://be-movie-sooty.vercel.app/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result)
        if (result.error === 0) {
          Alert.alert('Thành công', 'Vé đã được tạo, chuyển đến trang thanh toán.');
          // Linking.openURL(result.data.checkoutUrl);
          // Thay vì mở URL, điều hướng đến PaymentWebView và truyền URL thanh toán qua params
          navigation.navigate('PaymentWebView', {
            checkoutUrl: result.data.checkoutUrl,
            orderCode: result.data.orderCode, // Truyền orderCode

          });
          // Optional: Thực hiện các hành động khác nếu cần, như cập nhật trạng thái ghế
        } else {
          Alert.alert('Lỗi', 'Không thể tạo liên kết thanh toán.');
        }
      } else {
        const error = await response.json();
        Alert.alert('Lỗi', error.message || 'Đặt vé thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu đặt vé:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server.');
    }
  };
  /*
    // Hàm xử lý khi người dùng quay lại từ trang thanh toán
    const handleOpenURL = (event) => {
      if (event.url === 'myapp://home') {
        Alert.alert('Thanh toán thành công', 'Bạn sẽ được chuyển đến trang xác nhận.');
        navigation.navigate('PaySuccess'); // Điều hướng về màn hình PaySuccess
      }
    };
  
    useEffect(() => {
      // Đăng ký sự kiện khi ứng dụng mở một URL
      Linking.addEventListener('url', handleOpenURL);
      return () => {
        // Gỡ bỏ sự kiện khi component bị hủy
        Linking.removeEventListener('url', handleOpenURL);
      };
    }, []);
  */
  //đặt vé kết thúc


  // Tính tổng giá tiền và số lượng ghế đã chọn
  const totalPrice = Array.isArray(selectedSeats) ? selectedSeats.reduce((sum, seat) => sum + seat.price, 0) : 0;
  const seatCount = Array.isArray(selectedSeats) ? selectedSeats.length : 0;


  //render ghế 
  const renderSeats = useCallback(
    (isMinimap = false) => {
      if (!Array.isArray(seatMap) || seatMap.length === 0) {
        console.log('Không có dữ liệu trong seatMap');
        return <Text style={ { color: 'white' } }>Đang tải dữ liệu ghế...</Text>;
      }
      console.log("seatMap hiện tại:", seatMap);

      const seats = seatMap.map((row, rowIndex) => {
        // Kiểm tra nếu row không rỗng
        if (row.length > 0) {
          const seatRow = row.map((char, colIndex) => {
            if (char !== '_') {
              const seatId = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`; // Ký hiệu A1, B2, ...
              // const isSelected = selectedSeats.includes(seatId);
              const isSelected = Array.isArray(selectedSeats) && selectedSeats.includes(seatId);

              return (
                <Seat
                  key={ seatId }
                  seatId={ seatId }
                  isSelected={ isSelected }
                  onSeatPress={ () => handleSeatPress(seatId, rowIndex, colIndex, char) }
                  isMinimap={ isMinimap }
                  seatType={ char } // Truyền ký tự để xác định màu sắc ghế
                />
              );
            }
            return null; // Không render nếu là '_'
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



  // Throttle việc cập nhật minimap để giảm độ trễ
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
          <Ionicons name="arrow-back" size={ 24 } color="red" style={ styles.backButton } />
        </TouchableOpacity>
        <View style={ styles.headerTitleContainer }>
          <Text style={ styles.headerText }>CGV Vincom Thủ Đức</Text>
          <Text style={ styles.showTimeTextHeader }>STARIUM, 01/11/24, 14:50~17:05</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="menu" size={ 24 } color="red" style={ styles.menuButton } />
        </TouchableOpacity>
      </View>

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
        <Text style={ styles.movieTitle }>VENOM: KÈO CUỐI</Text>
        <Text style={ styles.movieDetails }>2D Phụ Đề Việt | Rạp STARIUM</Text>
        <Text style={ styles.price }>{ `${totalPrice.toLocaleString()} ₫` }</Text>
        <Text style={ styles.seatCount }>{ seatCount > 0 ? `${seatCount} ghế` : '0 ghế' }</Text>
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
});

export default SeatSelectionScreen;



