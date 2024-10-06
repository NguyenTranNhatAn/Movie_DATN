import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const Details = () => {
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
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
          source={require('../../assets/image/Anhmau.png')} // Đường dẫn ảnh của bộ phim
          style={styles.moviePoster}
        />
        
        {/* Movie Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>Comedy</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>2h 30m</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Rating</Text>
            <Text style={styles.infoValue}>9.0/10</Text>
          </View>
        </View>
      </View>

      {/* Movie Title and Description */}
      <View style={styles.movieDetails}>
        <Text style={styles.movieTitle}>Avengers: Infinity War</Text>
        <Text style={styles.movieType}>Hollywood Movie</Text>

        <Text style={styles.descriptionTitle}>Descriptions</Text>
        <Text style={styles.descriptionText}>
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here.
        </Text>
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
    marginLeft: 20,
  },
  posterInfoContainer: {
    flexDirection: 'row', // Hiển thị movie poster và info theo hàng ngang
    marginTop: 20,
  },
  moviePoster: {
    width: 220,  // Đặt lại chiều rộng của poster
    height: 270, // Đặt lại chiều cao của poster
    borderRadius: 15,
    marginRight: 20, // Khoảng cách giữa poster và info
  },
  infoContainer: {
    justifyContent: 'space-around',
  },
  infoBox: {
    backgroundColor: '#FEEAEA',
    padding: 10,
    borderRadius: 10,
    width: 100,  // Chiều rộng cố định cho mỗi box
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  movieDetails: {
    marginTop: 20,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',

  },
  movieType: {
    fontSize: 16,
    color: '#999',
    marginTop: 5,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
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
