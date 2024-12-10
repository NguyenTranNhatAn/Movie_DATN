import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, ToastAndroid } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


const SplashScreen = ({ navigation }) => {
  const [token, setToken] = React.useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          const response = await fetch('http://103.130.213.92:8866/api/protect', {
            method: 'GET',
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          console.log(response)
          if (response.ok) {
            setToken(storedToken); // Token hợp lệ
          } else {
            await AsyncStorage.removeItem('token'); // Token hết hạn
            setToken(null);

            ToastAndroid.show("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", ToastAndroid.SHORT);
          }
        }
      } catch (error) {
        console.error('Lỗi kiểm tra token:', error);
      }
    };

    checkToken();
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tab' }], // Thay 'Tab' bằng màn hình chính của bạn
        });
      } else {
        navigation.navigate('Login'); // Điều hướng tới màn hình đăng nhập nếu không có token
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation, token]);


  return (
    <View style={styles.container}>
      <Image
        source={require('../../../image/logo.png')} // Đường dẫn tới logo của bạn
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Màu nền màn hình splash
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default SplashScreen;
