import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from './config';
const Component = ({ route }) => {
  // Lấy dữ liệu bookingData từ route
  const { bookingData } = route.params;
  console.log(bookingData);
  const [combos, setCombos] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // /https://c24f-171-252-189-233.ngrok-free.app
  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      setIsLoading(true); // Bắt đầu loading
      const response = await fetch(`${API_BASE_URL}/combo/getAll`);
      const data = await response.json();
      setCombos(data);

      const initialQuantities = data.reduce((acc, combo) => {
        acc[combo._id] = combo.quantity;
        return acc;
      }, {});
      setQuantities(initialQuantities);
      calculateTotalPrice(initialQuantities, data);
    } catch (error) {
      console.error('Error fetching combos:', error);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };


  const calculateTotalPrice = (updatedQuantities, comboData = combos) => {
    let total = 0;
    comboData.forEach((combo) => {
      const quantity = updatedQuantities[combo._id] || 0;
      const price = parseFloat(combo.price); // No need to use replace here
      total += price * quantity;
    });
    setTotalPrice(total.toFixed(3) + ' đ');
  };


  const increaseQuantity = (id) => {
    const updatedQuantities = {
      ...quantities,
      [id]: (quantities[id] || 0) + 1,
    };
    setQuantities(updatedQuantities);
    calculateTotalPrice(updatedQuantities);
  };

  const decreaseQuantity = (id) => {
    const updatedQuantities = {
      ...quantities,
      [id]: quantities[id] > 0 ? quantities[id] - 1 : 0,
    };
    setQuantities(updatedQuantities);
    calculateTotalPrice(updatedQuantities);
  };
  const navigation = useNavigation();
  const handlePay = () => {
    // Chuẩn bị thông tin combo được chọn để truyền
    const selectedCombos = combos
      .filter(combo => quantities[combo._id] > 0)
      .map(combo => ({
        comboId: combo._id,
        comboName: combo.name,
        quantity: quantities[combo._id],
        price: parseFloat(combo.price), // No need to use replace here
      }));


    // Loại bỏ "đ" khỏi `totalPrice` và chuyển đổi thành số
    const numericTotalPrice = parseFloat(totalPrice.replace(/[^\d.-]/g, ''));

    // Tính tổng amount mới
    const totalAmount = parseFloat(bookingData.amount) + numericTotalPrice;

    // Tạo paymentData để truyền sang màn hình tiếp theo
    const paymentData = {
      ...bookingData,
      combos: selectedCombos,
      amount: totalAmount,
    };

    // Điều hướng sang màn hình thanh toán và truyền dữ liệu
    navigation.navigate('Pay_Screen', { paymentData });
  };



  return (
    <SafeAreaView style={ styles.container }>
      {/* Header */ }
      <View style={ styles.header }>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={ 24 } color="red" style={ styles.backButton } />
        </TouchableOpacity>
        <View style={ styles.headerCenter }>
          <Text style={ styles.headerTitle }>CGV Vincom Thủ Đức</Text>
          <Text style={ styles.headerSubtitle }>STARIUM, 10/11/24, 19:30~21:58</Text>
        </View>
      </View>

      {/* Hiển thị Loading */ }
      { isLoading ? (
        <View style={ styles.loadingContainer }>
          <Text style={ styles.loadingText }>Đang tải dữ liệu...</Text>
          <Image
            style={ styles.loadingImage }
            source={ require('../assets/image/loading.gif') } // Thay bằng hình GIF loading của bạn
          />
        </View>
      ) : (
        <>
          {/* Banner */ }
          <View style={ styles.banner }>
            <Text style={ styles.bannerText }>
              Áp dụng giá Lễ, Tết cho một số sản phẩm bắp nước đối với các giao dịch có suất chiếu vào ngày Lễ, Tết
            </Text>
          </View>

          {/* Combo List */ }
          <ScrollView style={ styles.content } showsVerticalScrollIndicator={ false }>
            { combos.map((combo) => (
              <View key={ combo._id } style={ styles.comboItem }>
                <View style={ styles.comboContent }>
                  <Image
                    source={ { uri: combo.image } }
                    style={ styles.comboImage }
                  />
                  <View style={ styles.comboInfo }>
                    <Text style={ styles.comboName }>{ combo.name }</Text>
                    <Text style={ styles.comboPrice }>{ combo.price }</Text>
                    <Text style={ styles.comboDescription }>{ combo.description }</Text>
                    <Text style={ styles.comboNote }>{ combo.note }</Text>
                  </View>
                </View>
                <View style={ styles.quantityControl }>
                  <TouchableOpacity
                    style={ styles.quantityButton }
                    onPress={ () => decreaseQuantity(combo._id) }
                  >
                    <Text style={ styles.quantityButtonText }>-</Text>
                  </TouchableOpacity>
                  <Text style={ styles.quantityText }>
                    { quantities[combo._id] || 0 }
                  </Text>
                  <TouchableOpacity
                    style={ styles.quantityButton }
                    onPress={ () => increaseQuantity(combo._id) }
                  >
                    <Text style={ styles.quantityButtonText }>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )) }
          </ScrollView>
        </>
      ) }

      {/* Footer */ }
      <View style={ styles.footer }>
        <View style={ styles.ticketInfo }>
          <Text style={ styles.ticketTitle }>MẬT MÃ ĐỎ</Text>
          <Text style={ styles.ticketSubtitle }>2D Phụ Đề Việt | Rạp STARIUM</Text>
          <Text style={ styles.ticketPrice }>{ totalPrice }+{ bookingData.amount }đ+{ bookingData.seats.length }ghế</Text>
        </View>
        <TouchableOpacity style={ styles.checkoutButton } onPress={ handlePay }>
          <Text style={ styles.checkoutButtonText }>THANH TOÁN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  loadingImage: {
    width: 50,
    height: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  banner: {
    backgroundColor: '#ff5b6a',
    padding: 12,
  },
  bannerText: {
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  comboItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  comboContent: {
    flexDirection: 'row',
  },
  comboImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  comboInfo: {
    flex: 1,
  },
  comboName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  comboPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  comboDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  comboNote: {
    fontSize: 12,
    color: '#999',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#000',
  },
  quantityText: {
    width: 50,
    textAlign: 'center',
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketInfo: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  ticketPrice: {
    fontSize: 14,
    color: '#000',
  },
  checkoutButton: {
    backgroundColor: '#e71a0f',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default Component;