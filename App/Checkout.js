import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import WebView from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { createPayment } from './Reducer/PaymentSlide';

const Checkout = () => {
  const dispatch = useDispatch();
  const [orderUrl, setOrderUrl] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handlePayment = async () => {
    try {
      const paymentData = {
        amount: parseInt(amount, 10),
        description,
      };

      const response = await dispatch(createPayment(paymentData)).unwrap();

      console.log('Phản hồi API:', response);

      // Kiểm tra nếu dữ liệu API hợp lệ
      if (response && response.data && response.data.order_url) {
        setOrderUrl(response.data.order_url); // Lưu order_url để hiển thị
      } else {
        throw new Error('Dữ liệu phản hồi không hợp lệ từ API');
      }
    } catch (error) {
      console.error('Lỗi chi tiết:', error);
      Alert.alert('Lỗi thanh toán', error.message || 'Thanh toán thất bại');
    }
  };

  if (orderUrl) {
    return (
      <WebView
        source={{ uri: orderUrl }}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes('success')) {
            Alert.alert('Thành công', 'Thanh toán thành công!');
            setOrderUrl(null);
          } else if (navState.url.includes('cancel')) {
            Alert.alert('Đã hủy', 'Giao dịch đã bị hủy.');
            setOrderUrl(null);
          }
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Số tiền"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả thanh toán"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Thanh Toán" onPress={handlePayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default Checkout;
