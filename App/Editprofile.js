import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { EditProfile } from './Reducer/EditProfileSlide';

const EditProfileComponent = () => {
  const { editprofileData, editprofileStatus, error } = useSelector((state) => state.EditProfile); // Lấy thêm state error từ slice
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setgmail] = useState('');
  const [_id, setUserId] = useState('670b8eff0f8b420fd4c56a6f'); // _id của người dùng
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log(editprofileStatus)

    if (error) {
      Alert.alert('Lỗi', error); // Hiển thị lỗi nếu có
    }
  }, [editprofileStatus, editprofileData, error]); // Lắng nghe thay đổi của error

  const commit = () => {
    const data = { name, phone, address, email, _id };
    console.log("Data to send:", data); // Kiểm tra dữ liệu trước khi gửi
    dispatch(EditProfile(data));
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