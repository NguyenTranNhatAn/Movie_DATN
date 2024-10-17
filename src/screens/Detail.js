import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const Details = ({ route, navigation }) => {
  const { item } = route.params;
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity  onPress={() => navigation.goBack()} >
          <Image 
            source={require('../../assets/image/arrow-left.png')} // Đường dẫn icon mũi tên quay lại
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Movie Details</Text>
        <View></View>
      </View>
      
      {/* Movie Poster and Info in one row */}
      <View style={styles.posterInfoContainer}>
        {/* Movie Poster */}
        <Image
          source={{ uri: item.images[0] }} // Đường dẫn ảnh của bộ phim
          style={styles.moviePoster}
        />
        
        {/* Movie Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
          <Image 
            source={require('../../assets/icon/videocam.png')} 
            style={styles.arrowIcon}
          />
          
            <Text style={styles.infoLabel}>Type </Text>
            <Text style={styles.infoValue}>Comedy</Text>
          </View>
          <View style={styles.infoBox}>
          <Image 
            source={require('../../assets/icon/clock.png')} 
            style={styles.arrowIcon}
          />
            <Text style={styles.infoLabel}>Duration </Text>
            <Text style={styles.infoValue}>2h 30m</Text>
          </View>
          <View style={styles.infoBox}>
          <Image 
            source={require('../../assets/icon/star.png')} 
            style={styles.arrowIcon}
          />
            <Text style={styles.infoLabel}>Rating</Text>
            <Text style={styles.infoValue}>{item.rating}</Text>
          </View>
        </View>
      </View>

      {/* Movie Title and Description */}
      <View style={styles.movieDetails}>
        <Text style={styles.movieTitle}> {item.name}</Text>
        <Text style={styles.movieType}>Hollywood Movie</Text>

        <Text style={styles.descriptionTitle}>Descriptions</Text>
        <Text style={styles.descriptionText}>
        {item.description} </Text>
      </View>

      {/* Select Seat Button */}
      <TouchableOpacity style={styles.selectButton}>
        <Text style={styles.selectButtonText}>Select Seat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    paddingVertical: 20,
  },
  arrowIcon: {
    width: 24,
    height: 24,  // Kích thước icon mũi tên quay lại
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  
    color: '#000',
  },
  posterInfoContainer: {
    flexDirection: 'row', // Hiển thị movie poster và info theo hàng ngang
    marginTop: 20,
  },
  moviePoster: {
    width: 240,  // Đặt lại chiều rộng của poster
    height: 300, // Đặt lại chiều cao của poster
    borderRadius: 15,
    marginRight: 20, // Khoảng cách giữa poster và info
  },
  infoContainer: {
    justifyContent: 'space-around',
  },
  infoBox: {
    backgroundColor: '#F5EFF7',
    padding: 10,
    margin:10,
    borderRadius: 10,
    width: 80,  // Chiều rộng cố định cho mỗi box
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#999',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#000',
  },
  movieDetails: {
    marginTop: 20,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  movieType: {
    fontSize: 16,
    color: '#999',
    marginTop: 5,
  },
  descriptionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#000',
  },
  descriptionText: {
    fontSize: 18,
    color: '#000',
    marginTop: 10,
  },
  selectButton: {
    backgroundColor: '#FF515A',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
    position: 'absolute',  // Đặt nút ở vị trí tuyệt đối
    bottom: 20,            // Cách mép dưới màn hình 20 đơn vị
    left: 20,              // Căn lề trái
    right: 20,   
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
