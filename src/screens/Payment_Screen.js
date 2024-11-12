import React from 'react';
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

export default function PaymentScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="red" style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {/* Movie Info */}
      <View style={styles.movieInfo}>
        <Image
          source={{ uri: 'https://your-image-url-here' }}
          style={styles.movieImage}
        />
        <View style={styles.movieDetails}>
          <Text style={styles.movieTitle}>MẬT MÃ ĐỎ</Text>
          <Text style={styles.movieSubTitle}>K - Phim được phổ biến đến người xem dưới 13 tuổi</Text>
          <Text style={styles.movieInfoText}>Thứ Ba 12 tháng 11, 2024 18:50 ~ 21:18</Text>
          <Text style={styles.movieInfoText}>CGV Vincom Thủ Đức</Text>
          <Text style={styles.movieInfoText}>Cinema 5 - Ghế: H3</Text>
          <Text style={styles.movieInfoText}>BT21 MININI COUPLE COMBO x1</Text>
        </View>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
        <Text style={styles.totalAmount}>603.909 đ</Text>
      </View>

      {/* Scrollable Section */}
      <ScrollView style={styles.scrollContainer}>
        {/* Ticket Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>THÔNG TIN VÉ</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Số lượng</Text>
            <Text style={styles.value}>1</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tổng</Text>
            <Text style={styles.value}>104.909 đ</Text>
          </View>
        </View>

        {/* Combo Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>THÔNG TIN BẮP NƯỚC</Text>
          <View style={styles.row}>
            <Text style={styles.comboLabel}>🍿 BT21 MININI COUPLE COMBO</Text>
            <Text style={styles.value}>1</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tổng</Text>
            <Text style={styles.value}>499.000 đ</Text>
          </View>
        </View>

        {/* Additional Combos */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Thêm combo/bắp nước:</Text>
          {/* Repeat for each combo option */}
          <View style={styles.comboOption}>
            <Image source={{ uri: 'https://your-combo-image-url' }} style={styles.comboImage} />
            <Text style={styles.comboName}>BT21 MININI SINGLE COMBO</Text>
            <Text style={styles.comboPrice}>259.000 đ</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>PHƯƠNG THỨC GIẢM GIÁ</Text>
          {/* Repeat payment method with icon and description */}
          <View style={styles.paymentOption}>
            <Ionicons name="card" size={24} color="blue" />
            <Text style={styles.paymentText}>ATM card (Thẻ nội địa)</Text>
          </View>
          {/* Additional payment methods here */}
        </View>

        {/* Agreement */}
        <View style={styles.agreementContainer}>
          <Ionicons name="checkbox-outline" size={24} color="red" />
          <Text style={styles.agreementText}>
            Tôi đồng ý với Điều Khoản Sử Dụng và đang mua vé cho người có độ tuổi phù hợp với từng loại vé. Chi tiết xem tại đây!
          </Text>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>TÔI ĐỒNG Ý VÀ TIẾP TỤC</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieInfo: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  movieImage: {
    width: 80,
    height: 120,
    marginRight: 16,
  },
  movieDetails: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  movieSubTitle: {
    fontSize: 12,
    color: 'red',
  },
  movieInfoText: {
    fontSize: 14,
    color: '#666',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    color: 'red',
  },
  scrollContainer: {
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
    color: '#000',
  },
  comboLabel: {
    fontSize: 14,
    color: '#000',
  },
  comboOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  comboImage: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  comboName: {
    fontSize: 14,
    flex: 1,
  },
  comboPrice: {
    fontSize: 14,
    color: '#000',
  },
  addButton: {
    padding: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  paymentText: {
    fontSize: 14,
    marginLeft: 8,
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
