import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert,ActivityIndicator } from 'react-native';
import { EditProfile } from './Reducer/EditProfileSlide';
import { UploadUsers } from './Reducer/UploadUserslide';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileComponent = () => {
  const { UploadUsersData, UploadUsersStatus } = useSelector((state) => state.UploadUsers); // Lấy thêm state error từ slice
  const { editprofileData, editprofileStatus, error } = useSelector((state) => state.EditProfile); // Lấy thêm state error từ slice
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setgmail] = useState('');
  
  
  const dispatch = useDispatch();
  
 // Gọi API lấy thông tin người dùng khi component mount và cập nhật form
useEffect(() => {
  const loadUserInfo = async () => {
    try {
      console.log('Gọi API UploadUsers');
      await dispatch(UploadUsers()); // Gọi API lấy thông tin người dùng
    } catch (error) {
      console.error('Lỗi khi gọi API UploadUsers:', error);
    }
  };

  loadUserInfo(); // Chạy khi component mount
}, [dispatch]);

// Cập nhật form với dữ liệu người dùng sau khi API trả về thành công
useEffect(() => {
  if (UploadUsersData) {
    console.log('Dữ liệu người dùng:', UploadUsersData); // Log dữ liệu để kiểm tra
    setName(UploadUsersData.name || '');
    setPhone(UploadUsersData.phone || '');
    setAddress(UploadUsersData.address || '');
    setgmail(UploadUsersData.email || '');
  }

  if (error) {
    Alert.alert('Lỗi', error); // Hiển thị lỗi nếu có
  }
}, [UploadUsersData, error]); // Chỉ theo dõi UploadUsersData và error

const commit = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Lỗi', 'Token không tồn tại. Vui lòng đăng nhập lại.');
      return;
    }

    const data = { name, phone, address, email };
    console.log('Data to send:', data);

    // Gọi API và nhận phản hồi từ Redux
    const result = await dispatch(EditProfile({ data, token }));
    console.log('Kết quả cập nhật:', result);

    // Kiểm tra phản hồi và lấy thông báo lỗi chính xác
    if (result.error) {
      const errorMessage =
        result.error.message || // Nếu message tồn tại
        JSON.stringify(result.error); // Nếu không, chuyển object thành chuỗi

      Alert.alert('Lỗi', errorMessage || 'Cập nhật thất bại');
    } else {
      Alert.alert('Thành công', 'Cập nhật thông tin thành công');
    }
  } catch (error) {
    console.error('Lỗi khi gửi thông tin:', error);
    Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra');
  }
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
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Address</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setgmail} />
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

export default EditProfileComponent;