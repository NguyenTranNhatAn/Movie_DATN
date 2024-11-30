import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Import thư viện
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [name, setUsername] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);


  const handleSignUp = async () => {
    if (password === confirmPassword) {
      try {
        // "raw": "{\n  \"name\": \"hao\",\n  \"phone\": 12,\n  \"email\": \"nhatan\",\n  \"password\": \"gg\",\n  \"address\":\"Lamdong\"\n}\n"
        const response = await axios.post('http://103.130.213.92:3006/user/register', { name, phone, email, password, address });
        Alert.alert('', 'Đăng kí thanh cong!');
        console.log('Token:', response.data.token);
      } catch (err) {
        Alert.alert('', 'Đăng kí thất bại!');
      }
    } else {
      Alert.alert('', 'Mật khẩu không trùng khớp hãy nhập lại!'); // Hiển thị thông báo khi mật khẩu không khớp
    }


  };

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const toggleConfirmPasswordVisibility = () => {
    setSecureConfirmTextEntry(!secureConfirmTextEntry);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEnabled={true}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../../../image/logo.png')} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Create New Account</Text>
      <Text style={styles.subtitle}>Set up your username and password. You can always change it later</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Mark Willions"
        value={name}
        onChangeText={setUsername}
      />

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder="(+84) 999-999-999"
        value={phone}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputP}
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Image source={require('../../../image/Union.png')} />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputP}
          placeholder="Confirm Password"
          secureTextEntry={secureConfirmTextEntry}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
          <Image source={require('../../../image/Union.png')} />
        </TouchableOpacity>
      </View>

      {/* Signup Button */}
      <TouchableOpacity style={styles.signupButton} onPress={() => handleSignUp()}>
        <Text style={styles.signupButtonText}>Signup</Text>
      </TouchableOpacity>

      {/* Modal Dialog */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styless.centeredView}>
          <View style={styless.modalView}>
            <Text style={styless.titleText}>Verify Your Email Address</Text>
            <Text style={styless.phoneNumberText}>(405) 555-0128</Text>
            <Text style={styless.bodyText}>
              We will send the authentication code to this mobile number you entered. Do you want to continue?
            </Text>

            <View style={styless.buttonContainer}>
              <TouchableOpacity
                style={[styless.button, styless.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styless.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styless.button, styless.nextButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styless.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Login Link */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} >
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAwareScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
    marginTop: -5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: 'black'
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: 'black',
    marginBottom: 30,

  },
  input: {
    borderWidth: 1,
    borderColor: '#FF3D3D',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    color: 'black'
  },
  inputP: {
    width: '95%',
    borderRadius: 8,
    fontSize: 16,
    color: 'black'
  },
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3D3D',
    borderRadius: 8,
    marginBottom: 20,
    height: 56,
    paddingRight: 10,
    paddingLeft: 5
  },
  signupButton: {
    backgroundColor: '#FF3D3D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#888',
    fontSize: 14,
  },
  loginLink: {
    color: '#FF3D3D',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
const styless = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  phoneNumberText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  bodyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  nextButton: {
    backgroundColor: '#FF4B5C',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SignupScreen;