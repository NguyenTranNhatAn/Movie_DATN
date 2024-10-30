import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { WebView } from 'react-native-webview'; // Thêm import WebView
import { converTime } from '../../utils/convertTime';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../reducers/WishlistSlice'; // Đường dẫn tới slice của wishlist

const Details = ({ route, navigation }) => {
  const { item } = route.params;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.wishlist.user);
  const wishlist = user ? user.wishlist : [];

  // Kiểm tra xem phim đã nằm trong wishlist chưa
  const [isFavorite, setIsFavorite] = useState(wishlist.includes(item.id));

  const handleFavoriteToggle = () => {
    if (user) {
      if (isFavorite) {
        // Bỏ yêu thích
        dispatch(removeFromWishlist({ userId: user._id, movieId: item.id }))
          .then(() => {
            Alert.alert("Xóa thành công khỏi danh sách yêu thích");
            setIsFavorite(false);
          })
          .catch((error) => {
            console.error(error);
            Alert.alert("Có lỗi xảy ra, vui lòng thử lại.");
          });
      } else {
        // Thêm vào yêu thích
        dispatch(addToWishlist({ userId: user._id, movieId: item.id }))
          .then(() => {
            Alert.alert("Thêm vào danh sách yêu thích thành công");
            setIsFavorite(true);
          })
          .catch((error) => {
            console.error(error);
            Alert.alert("Có lỗi xảy ra, vui lòng thử lại.");
          });
      }
    } else {
      Alert.alert("Vui lòng đăng nhập để thêm vào danh sách yêu thích");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/image/arrow-left.png')} // Đường dẫn icon mũi tên quay lại
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Movie Details</Text>
        <TouchableOpacity onPress={handleFavoriteToggle}>
          <Image
            source={isFavorite 
              ? require('../../../image/iconAP.png') // Icon yêu thích đầy
              : require('../../../image/iconGG.png') // Icon yêu thích rỗng
            }
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
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
              <Image source={require('../../../assets/icon/videocam.png')} style={styles.arrowIcon} />
              <Text style={styles.infoLabel}>Type </Text>
              <Text style={styles.infoValue}>{item.genreName}</Text>
            </View>
            <View style={styles.infoBox}>
              <Image source={require('../../../assets/icon/clock.png')} style={styles.arrowIcon} />
              <Text style={styles.infoLabel}>Duration </Text>
              <Text style={styles.infoValue}>{converTime(item.duration)}</Text>
            </View>
            <View style={styles.infoBox}>
              <Image source={require('../../../assets/icon/star.png')} style={styles.arrowIcon} />
              <Text style={styles.infoLabel}>Rating</Text>
              <Text style={styles.infoValue}>{item.rating}</Text>
            </View>
          </View>
        </View>

        {/* Movie Title and Description */}
        <View style={styles.movieDetails}>
          <Text style={styles.movieTitle}>{item.name}</Text>
          <Text style={styles.descriptionTitle}>Descriptions</Text>
          <Text numberOfLines={7} style={styles.descriptionText}>{item.description}</Text>
        </View>

        {/* Trailer Video */}
        <Text style={styles.trailerTitle}>Trailer</Text>
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: item.trailer }} // Trailer video URL
            style={styles.webview}
            allowsFullscreenVideo={true} // Cho phép fullscreen
          />
        </View>
      </ScrollView>

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
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  posterInfoContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  moviePoster: {
    width: 240,
    height: 300,
    borderRadius: 15,
    marginRight: 20,
  },
  infoContainer: {
    justifyContent: 'space-around',
  },
  infoBox: {
    backgroundColor: '#F5EFF7',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    width: 80,
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
  trailerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#000',
  },
  videoContainer: {
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden', // Để tránh video ra ngoài đường biên
  },
  webview: {
    flex: 1,
  },
  selectButton: {
    backgroundColor: '#FF515A',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
