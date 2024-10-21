import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.profileName1}>Profile</Text>
      <View style={styles.profileSection}>
      
        <Image
          source={require('../Img/anhspidermen.png')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Mark Willions</Text>
        <Text style={styles.profilePhone}>(405) 555-0128</Text>
      </View>

      <View style={styles.optionsContainer}>
      <TouchableOpacity
      style={styles.optionRow}
      onPress={() => navigation.navigate('editprofile')} // Chuyển hướng đến màn hình ProfileEditScreen
    >
      <Text style={styles.optionText}> Edit Profile</Text>
      <Image source={require('../Img/Vector.png')}/>
    </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}>
        <View style={styles.editicon} >
      <Image source={require('../Img/ticket.png')}/>
      <Text style={styles.optionText}> My tickets</Text>
      </View>
          <Image source={require('../Img/Vector.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}>
          <Text style={styles.optionText}>Change Password</Text>
          <Image source={require('../Img/Vector.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}>
          <Text style={styles.optionText}>Privacy Policy</Text>
          <Image source={require('../Img/Vector.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}>
          <Text style={styles.optionText}>Terms & Conditions</Text>
          <Image source={require('../Img/Vector.png')}/>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 25,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  profileName1: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    
    alignSelf:'center'
    
  },
  profilePhone: {
    fontSize: 16,
    color: '#888',
  },
  optionsContainer: {
    marginVertical: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 18,
    color: '#000',
  },
  icon: {
    fontSize: 22,
    color: '#000',
  },
  logoutButton: {
    backgroundColor: '#ff5757',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editicon:{
    flexDirection:'row'
  }
});

export default Profile;
