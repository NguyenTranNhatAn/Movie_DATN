import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet,Alert } from 'react-native';

const EditProfile = () => {
  // State cho các trường thông tin của người dùng
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setgmail] = useState('');
  const [userId, setUserId] = useState('670b8e69631b560566ccd009'); // _id của người dùng

   // Hàm xử lý khi nhấn nút "Update"
   const commit = () => {
    // Gửi dữ liệu form bao gồm cả _id
    let formdata = {
      _id: userId,    // _id của người dùng
      name: name,
      phone: phone,
      address: address,
      email: email
    };

    axios
      .post('https://be-movie-sooty.vercel.app/user/updateUser', formdata)
      .then((response) => {
        if (response.data.status === 'true') {
          console.log('Cập nhật thành công:', response.data); // Xử lý phản hồi thành công từ API
        } else {
          Alert.alert('Lỗi cập nhật', response.data.error); // Hiển thị lỗi từ API nếu có
        }
      })
      .catch((error) => {
        // Xử lý lỗi trả về từ API
        if (error.response && error.response.data && error.response.data.error) {
          const errorMsg = error.response.data.error;

          // Kiểm tra lỗi email đã tồn tại
          if (errorMsg.includes('Email đã được đăng kí')) {
            Alert.alert('Lỗi', 'Email đã tồn tại.');
          }

          // Kiểm tra lỗi số điện thoại đã tồn tại
          if (errorMsg.includes('Số điện thoại đã được đăng kí')) {
            Alert.alert('Lỗi', 'Số điện thoại đã tồn tại.');
          }
        } else {
          // Hiển thị thông báo lỗi chung nếu không có thông tin chi tiết từ API
          Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại.');
        }
        console.error('Error:', error.response ? error.response.data : error.message); // Ghi lại lỗi chi tiết trong console
      });
  };

  return (
    <View style={styles.container}>
      {/* Profile picture */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} // Thay thế bằng URL ảnh của bạn
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIconContainer}>
          <Text style={styles.editIconText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setgmail}
        />
      </View>

      {/* Update Button */}
      <TouchableOpacity style={styles.button} onPress={commit}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#f55',
    borderRadius: 50,
    padding: 5,
  },
  editIconText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#f55',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#f55',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#f55',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;
