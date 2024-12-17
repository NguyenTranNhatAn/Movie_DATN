import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { converTime } from '../../utils/convertTime';
import Toast from 'react-native-toast-message';
import { resetCache } from '../../../metro.config';

const Details = ({ route, navigation }) => {
  const { item, viewOnly } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [token, setToken] = useState(null);
  const [showVideo, setShowVideo] = useState(true); // Trạng thái hiển thị video
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    };

    const getUserInfo = async () => {
      if (token) {
        try {
          const response = await axios.get('http://103.130.213.92:3006/api/user-info', {
            headers: { Authorization: `Bearer ${token}` },
          });

          setIsFavorite(response.data.wishlist.includes(item._id));
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    getToken();
    if (token) getUserInfo();
  }, [token, item._id]);

  const handleAddToWishlist = async () => {
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Bạn cần đăng nhập trước khi thêm vào danh sách yêu thích.'
      });
      return;
    }

    try {

      const response = await axios.get(
        `http://103.130.213.92:3006/movie/addWishList?movieId=${item._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'true') {
        setIsFavorite(!isFavorite);
        Toast.show({
          type: 'success',
          text1: 'Yêu thích',
          text2: response.data.message
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Có lỗi khi thực hiện hành động này.'
        });
      }
    } catch (error) {
      console.error('Error adding/removing from wishlist:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Có lỗi khi xử lý yêu cầu.'
      });
    }
  };
  const handleSelectSeat = () => {
    navigation.navigate('Cinema', { id: item._id, image: item.images, resetData: true });
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../assets/image/arrow-left.png')} style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Movie Details</Text>
        <TouchableOpacity onPress={handleAddToWishlist} style={styles.wishlistCircle}>
          <Text style={styles.wishlistButtonText}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: viewOnly ? 20 : 0 }}
      showsVerticalScrollIndicator={false}

      >
        {/* Movie Poster and Info */}
        <View style={styles.posterInfoContainer}>
          <Image source={{ uri: item.images[0] }} style={styles.moviePoster} />
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Image source={require('../../../assets/icon/videocam.png')} style={styles.arrowIcon} />
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{item.genreName}</Text>
            </View>
            <View style={styles.infoBox}>
              <Image source={require('../../../assets/icon/clock.png')} style={styles.arrowIcon} />
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{converTime(item.duration)}</Text>
            </View>
            <View style={styles.infoBox}>
              <Image source={require('../../../assets/icon/star.png')} style={styles.arrowIcon} />
              <Text style={styles.infoLabel}>Rating</Text>
              <Text style={styles.infoValue}>{item.rating}</Text>
            </View>
          </View>
        </View>


        <View style={styles.movieDetails}>
          <Text style={styles.movieTitle}>{item.name}</Text>
          <View style={styles.descriptionRow}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Descriptions</Text>
              <Text numberOfLines={7} style={styles.descriptionText}>{item.description}</Text>
            </View>
          </View>
        </View>


        <Text style={styles.trailerTitle}>Trailer</Text>
        <View style={[styles.videoContainer, viewOnly && { marginBottom: 30 }]}>
          <WebView
            source={{ uri: item.trailer }}
            style={styles.webview}
            allowsFullscreenVideo={true}
          />
        </View>
      </ScrollView>


      {!viewOnly && (
        <TouchableOpacity onPress={handleSelectSeat} style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Select Seat</Text>
        </TouchableOpacity>
      )}

      <Toast />
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
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  descriptionContainer: {
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
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
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  wishlistCircle: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 1,
    borderWidth: 2,
    borderColor: '#FF515A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    height: 40,
    width: 40,
  },
  wishlistButtonText: {
    fontSize: 20,
    color: '#FF515A',
  },
  selectButton: {
    backgroundColor: '#FF515A',
    paddingVertical: 12,
    marginVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
