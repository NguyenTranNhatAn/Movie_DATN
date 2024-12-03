import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image,Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';

const LoginScreen = ({navigation}) => {
  const [phone, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [error, setError] = useState('');
  
  const validatePhoneNumber = (text) => {
    setPhoneNumber(text);
    // Không hiển thị lỗi khi người dùng đang nhập
    if (error) setError('');
  };
  const handleBlur = () => {
    // Regex cho số điện thoại Việt Nam (bắt đầu bằng số 0 và gồm 10 chữ số)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    
    if (phone.length === 0) {
      setError('Số điện thoại không được để trống');
    } else if (!phoneRegex.test(phone)) {
      setError('Số điện thoại không hợp lệ');
    } else {
      setError('');
    }
  };


  const handleLogin = async () => {
    try {
      const response = await axios.post('https://be-movie-sooty.vercel.app/api/login', { phone, password });
        navigation.navigate ('Tab');
      console.log('Token:', response.data.token);
        // Lưu token và id vào AsyncStorage nếu đăng nhập thành công
        const { token, _id } = response.data;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('_id', _id.toString());
       console.log(`Login successful for ${phone}: Token - ${token}, ID - ${_id}`);
        
    } catch (err) {
      Alert.alert( '','Đăng nhập thất bại!');
     
    }
  };

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
      <Image source={require('../../../image/logo.png')}/>
      </View>

      {/* Title */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to your account using email</Text>

      {/* Login with Apple */}
      <TouchableOpacity style={styles.socialButtonApple}>
      <Image source={require('../../../image/iconAP.png')}/>
        <Text style={styles.socialButtonText}>Login with Apple</Text>
      </TouchableOpacity>

      {/* Login with Google */}
      <TouchableOpacity style={styles.socialButtonGoogle}>
      <Image source={require('../../../image/iconGG.png')}/>
        <Text style={styles.socialButtonText}>Login with Google</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or continue with social account</Text>
        <View style={styles.divider} />
      </View>

      {/* Mobile Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        maxLength={10}
        value={phone}
        onChangeText={validatePhoneNumber}
        onBlur={handleBlur} 
        keyboardType="phone-pad"
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
        <Image source={require('../../../image/Union.png')}/>
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      
      {/* Register Link */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Didn't have an account?</Text>

        <TouchableOpacity
         onPress={() => navigation.navigate('Signup')}>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color:'black'
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
   marginBottom:10
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
    marginBottom: 20,
    fontSize: 16,
  },
  inputP: {
    width:'95%',
    borderRadius: 8,
    fontSize: 16,
    color :'black'
  },
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3D3D',
    borderRadius: 8,
    marginBottom: 20,
    height:56,
    paddingRight:10,
    paddingLeft:5
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