import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePhoneNumber = () => {
    if (!phone) {
      setPhoneError('Điện Thoại không được để trống');
      return false;
    } 
    setPhoneError('');
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Mật khẩu không được để trống');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    const isPhoneValid = validatePhoneNumber();
    const isPasswordValid = validatePassword();

    if (!isPhoneValid || !isPasswordValid) return;

    try {
      const response = await axios.post('http://103.130.213.92:3006/api/login', { phone, password });
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Tab' }],
      });
      console.log('Token:', response.data.token);
    } catch (err) {
      Alert.alert('', 'Login failed!');
      console.log(err);
    }
  };

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../image/Logo1.png')} />
      </View>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to your account using email</Text>

      {/* <TouchableOpacity style={styles.socialButtonApple}>
        <Image source={require('../../../image/iconAP.png')} />
        <Text style={styles.socialButtonText}>Login with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButtonGoogle}>
        <Image source={require('../../../image/iconGG.png')} />
        <Text style={styles.socialButtonText}>Login with Google</Text>
      </TouchableOpacity> */}

      {/* <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or continue with social account</Text>
        <View style={styles.divider} />
      </View> */}

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={phone}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        onBlur={validatePhoneNumber}
      />
      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputP}
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
          onBlur={validatePassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Image source={require('../../../image/Union.png')} />
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      {/* <TouchableOpacity style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity> */}
    

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Didn't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.registerLink}> Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent:'center'
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
    marginBottom:'20%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
    marginBottom: 30,
  },
  socialButtonApple: {
    backgroundColor: '#FFF',
    height: 60,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  socialButtonGoogle: {
    height: 60,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EDEDED',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#888',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF3D3D',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#FF3D3D',
    fontSize: 12,
    marginBottom: 15,
  },
  inputP: {
    width: '95%',
    borderRadius: 8,
    fontSize: 16,
    color: 'black',
  },
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3D3D',
    borderRadius: 8,
    marginBottom: 5,
    height: 56,
    paddingRight: 10,
    paddingLeft: 5,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#FF3D3D',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#FF3D3D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    marginTop:'20%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#888',
    fontSize: 14,
  },
  registerLink: {
    color: '#FF3D3D',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
