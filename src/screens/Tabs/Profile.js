import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { UploadUsers } from '../../reducers/UploadUserslide';

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  handleTicket = () => {
    //chuyển sang màn hình mytickets
    navigation.navigate('Ticket');
  }

  // Lấy dữ liệu người dùng từ Redux store
  const { UploadUsersData, UploadUsersStatus } = useSelector((state) => state.UploadUsers);

  // Gọi API khi component được render
  useEffect(() => {
    if (UploadUsersStatus === 'idle') {
      dispatch(UploadUsers());
    }
  }, [UploadUsersStatus, dispatch]);
  const handleLogout = () => {
    // Thêm logic logout ở đây nếu cần, ví dụ: xóa token hoặc reset trạng thái
    navigation.navigate('Login'); // Chuyển hướng đến màn hình 'Login'
  };

  return (
    <ScrollView style={ styles.container }>
      <Text style={ styles.profileName1 }>Profile</Text>
      <View style={ styles.profileSection }>
        <Image
          source={ require('../../../Img/anhspidermen.png') }
          style={ styles.profileImage }
        />
        <Text style={ styles.profileName }>
          { UploadUsersData.name || 'N/A' }
        </Text>
        <Text style={ styles.profilePhone }>
          { UploadUsersData.phone || 'N/A' }
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        
      <TouchableOpacity style={styles.optionRow}
        onPress={() => navigation.navigate('EditProfile')}
        >
          
          <View style={styles.editicon}>
            
            <Image style={{width:25,height:25}} source={require('../../../editpencil.png')} />
            <Text style={styles.optionText}> Edit Profile</Text>
          </View>
          <Image source={ require('../../../Img/Vector.png') } />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}
        onPress={() => navigation.navigate('TicketDetails')} 
        >
          
          <View style={styles.editicon}>
            
            <Image source={require('../../../Img/ticket.png')} />
            <Text style={styles.optionText}> My tickets</Text>
          </View>
          <Image source={require('../../../Img/Vector.png')} />
        </TouchableOpacity>

     {/* {   <TouchableOpacity style={styles.optionRow}
        
        >
          
          <View style={styles.editicon}>
            
            <Image style={{width:25,height:28}}  source={require('../../../Img/lock.png')} />
            <Text style={styles.optionText}> Change Password</Text>
          </View>
          <Image source={require('../../../Img/Vector.png')} />
        </TouchableOpacity>} */}

        <TouchableOpacity style={styles.optionRow}
        onPress={() => navigation.navigate('Policy')}  
        >
          
          <View style={styles.editicon}>
            
            <Image style={{width:25,height:28}}  source={require('../../../Img/check.png')} />
            <Text style={styles.optionText}> Privacy Policy</Text>
          </View>
          <Image source={require('../../../Img/Vector.png')} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}
      onPress={() => navigation.navigate('Terns')}     
        >
          
          <View style={styles.editicon}>
            
            <Image style={{width:25,height:28}}  source={require('../../../Img/board.png')} />
            <Text style={styles.optionText}> Terms & Conditions</Text>
          </View>
          <Image source={require('../../../Img/Vector.png')} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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

    alignSelf: 'center'

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
    marginTop: 120,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editicon: {
    flexDirection: 'row'
  }
});

export default Profile;
