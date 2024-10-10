import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const LoginScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
      <Image source={require('../image/logo.png')}/>
      </View>

      {/* Title */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to your account using email</Text>

      {/* Login with Apple */}
      <TouchableOpacity style={styles.socialButtonApple}>
      <Image source={require('../image/iconAP.png')}/>
        <Text style={styles.socialButtonText}>Login with Apple</Text>
      </TouchableOpacity>

      {/* Login with Google */}
      <TouchableOpacity style={styles.socialButtonGoogle}>
      <Image source={require('../image/iconGG.png')}/>
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
        value={phoneNumber}
        onChangeText={setPhoneNumber}
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
        <Image source={require('../image/Union.png')}/>
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Register Link */}
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