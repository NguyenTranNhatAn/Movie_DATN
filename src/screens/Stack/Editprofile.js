import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { EditProfile } from '../../reducers/EditProfileSlide';
import { UploadUsers } from '../../reducers/UploadUserslide';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const EditProfileComponent = () => {
  const { UploadUsersData, UploadUsersStatus, error: uploadError } = useSelector((state) => state.UploadUsers);
  const { editprofileStatus, error: editError } = useSelector((state) => state.editProfile);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Gọi API lấy thông tin người dùng khi component mount và cập nhật form
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setLoading(true);
        console.log('Gọi API UploadUsers');
        await dispatch(UploadUsers());
      
      } catch (error) {
        console.error('Lỗi khi gọi API UploadUsers:', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng.');
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, [dispatch]);

  // Cập nhật form với dữ liệu người dùng sau khi API trả về thành công
  useEffect(() => {
    if (UploadUsersData) {
      console.log('Dữ liệu người dùng:', UploadUsersData);
      setName(UploadUsersData.name || '');
      setPhone(UploadUsersData.phone || '');
      setAddress(UploadUsersData.address || '');
      setEmail(UploadUsersData.email || '');
    }

    if (uploadError) {
      Alert.alert('Lỗi', uploadError);
    }
  }, [UploadUsersData, uploadError]);

  const commit = async () => {
    try {
      const result = await dispatch(EditProfile({ name, phone, address, email })).unwrap();
      console.log('Kết quả cập nhật:', result);
  
      // Hiển thị thông báo thành công
      Alert.alert('Thành công', 'Cập nhật thông tin thành công', [
        {
          text: 'OK',
          onPress: async () => {
            await dispatch(UploadUsers()); // Gọi lại API để lấy dữ liệu mới
            navigation.goBack(); // Quay lại màn hình trước đó
          },
        },
      ]);
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
  
      // Hiển thị thông báo lỗi cụ thể
      Alert.alert('Lỗi', error || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f55" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Ảnh đại diện với icon chỉnh sửa */}
      <View style={styles.profileContainer}>
        <Image
             source={ require('../../../Img/anhspidermen.png') }
             
          style={styles.profileImage}
        />
        
      </View>

      {/* Các trường nhập liệu */}
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
          keyboardType="phone-pad"
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
          onChangeText={setEmail} 
          keyboardType="email-address"
        />
      </View>

      {/* Nút cập nhật */}
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
    position: 'relative', // Cho phép icon nằm chồng lên ảnh đại diện
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 25, // Bo góc nhẹ cho ảnh
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,  // Chỉnh gần sát đáy ảnh
    right: 5,   // Chỉnh gần sát bên phải ảnh
    backgroundColor: '#f55',
    borderRadius: 20,
    padding: 8,
    elevation: 5, // Tạo bóng cho icon để nổi bật
  },
  editIconImage: {
    width: 18,
    height: 18,
    tintColor: '#fff', // Icon có màu trắng
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