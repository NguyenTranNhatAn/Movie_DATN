import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import axios from 'axios';


const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Thời gian chờ 5 giây (5000ms) trước khi chuyển màn hình
    const timer = setTimeout(() => {
      navigation.navigate('Login'); // Điều hướng tới màn hình chính (Home)
    }, 5000); // 5000ms = 5 giây

    // Hủy bộ đếm thời gian khi component bị hủy
    return () => clearTimeout(timer);
  }, [navigation]);

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
