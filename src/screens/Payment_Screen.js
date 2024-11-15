import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from '../screens/config';
const PaymentScreen = ({ route }) => {
  const { paymentData } = route.params;
  const [image, setImage] = useState('');
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const movieId = paymentData.movieId;
        console.log("movieID:", movieId);
        const response = await fetch(`${API_BASE_URL}/movie/${movieId}`);

        if (!response.ok) {
          throw new Error("Lỗi khi lấy hình ảnh");
        }
        const data = await response.json();
        console.log("API response data:", data);
        setImage(data.image);
        console.log("image:", image)
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchImage();
  }, []);
  console.log("paymentData", paymentData);

  const [selectedMethod, setSelectedMethod] = useState('ATM');
  const [isConfirming, setIsConfirming] = useState(false);
  const paymentMethods = [
    {
      name: 'ATM card (Thẻ nội địa)',
      icon: 'https://w7.pngwing.com/pngs/726/177/png-transparent-payment-card-debit-card-credit-card-bank-card-credit-card-logo-internet-bank.png',
      method: 'ATM',
      api: `${API_BASE_URL}/order/create`
    },
    {
      name: 'Thẻ quốc tế (Visa, Master, Amex, JCB)',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png',
      method: 'Visa',
    },
    {
      name: 'Momo',
      icon: 'https://img.mservice.com.vn/app/img/portal_documents/mini-app_design-guideline_branding-guide-2-2.png',
      method: 'MoMo',
    },
    {
      name: 'Zalopay',
      icon: 'https://simg.zalopay.com.vn/zlp-website/assets/icon_hd_export_svg_ee6dd1e844.png',
      method: 'Zalopay',
    },
  ];

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
  };
  const navigation = useNavigation();
  const handleConfirm = async () => {
    setIsConfirming(true);
    const selectedPaymentMethod = paymentMethods.find(m => m.method === selectedMethod);
    // const bookingData = {
    //   showtimeId: showtimeId,
    //   seats: seatsData,
    //   cinemaName: cinemaName,
    //   roomName: roomName,
    //   showTime: formattedStartTime,
    //   showDate: formattedDay,
    //   movieName: movieName,
    //   userId: userId,
    //   movieId: movieId,
    //   amount: totalPrice,
    //   // amount: 5000,
    //   description: `Thanh toán vé phim`,
    //   returnUrl: 'myapp://home', // URL để trở về sau khi thanh toán thành công
    //   cancelUrl: 'myapp://Seat'  // URL khi người dùng hủy thanh toán
    // };
    try {
      const response = await fetch(selectedPaymentMethod.api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify(paymentData),
        body: JSON.stringify({
          ...paymentData,
          amount: 5000, // Ghi đè giá trị amount ở đây
        }),
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
  const seatTotal = paymentData.seats.reduce((total, seat) => total + seat.price, 0);
  const comboTotal = paymentData.combos.reduce((total, combo) => total + combo.price * combo.quantity, 0);
  const grandTotal = paymentData.amount;

  return (
    <SafeAreaView style={ styles.container }>
      {/* Header */ }
      <View style={ styles.header }>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={ 24 } color="red" style={ styles.backButton } />
        </TouchableOpacity>
        <Text style={ styles.headerTitle }>Thanh toán</Text>
        <TouchableOpacity>
          <Ionicons name="menu" size={ 24 } color="red" />
        </TouchableOpacity>
      </View>

      {/* Movie Info */ }
      <View style={ styles.movieInfo }>
        <Image
          source={ image ? { uri: image } : 'null' }
          style={ styles.movieImage }
        />
        <View style={ styles.movieDetails }>
          <Text style={ styles.movieTitle }>{ paymentData.movieName }</Text>
          <Text style={ styles.movieSubTitle }>Thanh toán vé phim</Text>
          <Text style={ styles.movieInfoText }>{ paymentData.showDate } { paymentData.showTime }</Text>
          <Text style={ styles.movieInfoText }>{ paymentData.cinemaName }</Text>
          <Text style={ styles.movieInfoText }>{ paymentData.roomName } - Ghế: { paymentData.seats.map(seat => seat.seatName).join(', ') }</Text>
        </View>
      </View>

      {/* Total Payment */ }
      <View style={ styles.totalContainer }>
        <Text style={ styles.totalLabel }>Tổng thanh toán:</Text>
        <Text style={ styles.totalAmount }>{ grandTotal.toLocaleString('vi-VN') } đ</Text>
      </View>

      {/* Scrollable Section */ }
      <ScrollView style={ styles.scrollContainer }>
        {/* Ticket Information */ }
        <View style={ styles.sectionContainer }>
          <Text style={ styles.sectionTitle }>THÔNG TIN VÉ</Text>
          <View style={ styles.row }>
            <Text style={ styles.label }>Số lượng ghế</Text>
            <Text style={ styles.value }>{ paymentData.seats.length }</Text>
          </View>
          <View style={ styles.row }>
            <Text style={ styles.label }>Tổng</Text>
            <Text style={ styles.value }>{ seatTotal.toLocaleString('vi-VN') } đ</Text>
          </View>
        </View>

        {/* Combo Information */ }
        <View style={ styles.sectionContainer }>
          <Text style={ styles.sectionTitle }>THÔNG TIN BẮP NƯỚC</Text>
          { paymentData.combos.map((combo, index) => (
            <View style={ styles.row } key={ index }>
              <Text style={ styles.comboLabel }>🍿 { combo.comboName }</Text>
              <Text style={ styles.value }>{ combo.quantity }</Text>
            </View>
          )) }
          <View style={ styles.row }>
            <Text style={ styles.label }>Tổng</Text>
            <Text style={ styles.value }>{ comboTotal.toLocaleString('vi-VN') } đ</Text>
          </View>
        </View>

        {/* Summary Section */ }
        <View style={ styles.summaryContainer }>
          <Text style={ styles.summaryTitle }>TỔNG KẾT</Text>
          <View style={ styles.row }>
            <Text style={ styles.label }>Tổng cộng bao gồm VAT</Text>
            <Text style={ styles.value }>{ grandTotal.toLocaleString('vi-VN') } đ</Text>
          </View>
          <View style={ styles.row }>
            <Text style={ styles.label }>Giảm giá</Text>
            <Text style={ styles.value }>0 đ</Text>
          </View>
          <View style={ styles.row }>
            <Text style={ styles.label }>Thẻ quà tặng/ eGift</Text>
            <Text style={ styles.value }>0 đ</Text>
          </View>
          <View style={ styles.row }>
            <Text style={ styles.label }>Còn lại</Text>
            <Text style={ styles.value }>{ grandTotal.toLocaleString('vi-VN') } đ</Text>
          </View>
        </View>

        {/* Payment Methods */ }
        <View style={ styles.sectionContainer }>
          <Text style={ styles.sectionTitle }>PHƯƠNG THỨC THANH TOÁN</Text>
          { paymentMethods.map((method) => (
            <TouchableOpacity
              key={ method.method }
              style={ styles.paymentOption }
              onPress={ () => handleSelectMethod(method.method) }
            >
              <Image source={ { uri: method.icon } } style={ styles.paymentIcon } />
              <Text style={ styles.paymentText }>{ method.name }</Text>
              { selectedMethod === method.method && (
                <Ionicons name="checkmark-circle" size={ 24 } color="red" style={ styles.checkmarkIcon } />
              ) }
            </TouchableOpacity>
          )) }
        </View>

        {/* Agreement */ }
        <View style={ styles.agreementContainer }>
          <Ionicons name="checkbox-outline" size={ 24 } color="red" />
          <Text style={ styles.agreementText }>
            Tôi đồng ý với Điều Khoản Sử Dụng và đang mua vé cho người có độ tuổi phù hợp với từng loại vé. Chi tiết xem tại đây!
          </Text>
        </View>

        {/* Confirm Button */ }
        <TouchableOpacity style={ styles.confirmButton } onPress={ handleConfirm }>
          <Text style={ styles.confirmButtonText }>TÔI ĐỒNG Ý VÀ TIẾP TỤC</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  movieInfo: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  movieImage: {
    width: 80,
    height: 120,
    marginRight: 16,
    borderRadius: 8,
  },
  movieDetails: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  movieSubTitle: {
    fontSize: 12,
    color: 'red',
    marginBottom: 4,
  },
  movieInfoText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  comboLabel: {
    fontSize: 14,
    color: '#333',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#f4f4f4',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginVertical: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  paymentIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  paymentText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  checkmarkIcon: {
    marginRight: 8,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  agreementText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  confirmButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;