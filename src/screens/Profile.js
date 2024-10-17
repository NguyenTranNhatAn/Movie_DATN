import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const Profile = () => {
  return (
    <View style={styles.container}>
      
      {/* Nút back sử dụng hình ảnh arrow-left */}
      {/* <TouchableOpacity style={styles.backButton}>
        <Image style={styles.img} source={require('../../assets/image/arrow-left.png')} />
      </TouchableOpacity> */}
      
      {/* Phần tiêu đề Profile */}
      <Text style={styles.title}>Profile</Text>

      {/* Phần trên cùng: Thông tin Profile */}
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={require('../../assets/image/Avatar.png')} // Đường dẫn đến ảnh avatar
        />
        <Text style={styles.profileName}>Mark Willions</Text>
        <Text style={styles.profilePhone}>(405) 555-0128</Text>
      </View>

      {/* Các tùy chọn cài đặt */}
      <View style={styles.optionsContainer}>
        {[
          { label: 'Edit Profile', icon: require('../../assets/icon/edit.png') }, // Icon của Edit Profile
          { label: 'My Tickets', icon: require('../../assets/icon/ticket.png') }, // Icon của My Tickets
          { label: 'Change Password', icon: require('../../assets/icon/lock.png') }, // Icon của Change Password
          { label: 'Privacy Policy', icon: require('../../assets/icon/shield.png') }, // Icon của Privacy Policy
          { label: 'Terms & Conditions', icon: require('../../assets/icon/list.png') }, // Icon của Terms & Conditions
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.optionItem}>
            <View style={styles.optionIconText}>
              <Image source={item.icon} style={styles.optionIcon} />
              <Text style={styles.optionText}>{item.label}</Text>
            </View>
            <Image source={require('../../assets/image/arrow-left.png')} style={styles.arrowIcon} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Nút đăng xuất */}
      <TouchableOpacity style={styles.logoutButton}>
       
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Thanh điều hướng dưới cùng */}
      {/* <View style={styles.bottomNav}>
        {[
          { icon: require('../../assets/image/arrow-left.png'), label: 'Home' },
          { icon: require('../../assets/image/arrow-left.png'), label: 'Favorites' },
          { icon: require('../../assets/image/arrow-left.png'), label: 'Messages' },
          { icon: require('../../assets/image/arrow-left.png'), label: 'Profile' },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.navItem}>
            <Image source={item.icon} style={styles.navIcon} />
          </TouchableOpacity>
        ))}
      </View> */}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginTop: 20,
    marginLeft: 15,
  },
  img: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profilePhone: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  optionsContainer: {
    marginVertical: 15,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionIconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  logoutButton: {
    backgroundColor: '#0FF515A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
   
    position: 'absolute',  // Đặt nút ở vị trí tuyệt đối
    bottom: 20,            // Cách mép dưới màn hình 20 đơn vị
    left: 20,              // Căn lề trái
    right: 20,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 28,
    height: 28,
  },
});
