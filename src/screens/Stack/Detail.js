// Details.js
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist } from '../../reducers/WishListSlice';
import { converTime } from '../../utils/convertTime';

const Details = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { item } = route.params;
  const wishlistStatus = useSelector((state) => state.wishlist.status);
  useEffect(() => {
    const checkUserId = async () => {
      const _id = await AsyncStorage.getItem('_id');
      console.log("Retrieved User ID:", _id); // Kiểm tra `_id` trong console
    };

    checkUserId(); // Gọi hàm kiểm tra khi component được render
  }, []);
  const handleAddToWishlist = () => {
    dispatch(addToWishlist(item._id)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        console.log("Movie added to wishlist successfully:", item._id);
      } else {
        console.log("Failed to add movie to wishlist:", result.error.message);
      }
    }).catch((error) => console.error("Error dispatching addToWishlist:", error));
  };
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/image/arrow-left.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Movie Details</Text>
        <View></View>
      </View>
      
      <ScrollView>
        {/* Movie Poster and Info in one row */}
        <View style={styles.posterInfoContainer}>
          {/* Movie Poster */}
          <Image
            source={{ uri: item.images[0] }}
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
            source={{ uri: item.trailer }}
            style={styles.webview}
            allowsFullscreenVideo={true}
          />
        </View>
      </ScrollView>

      {/* Add to Wishlist Button */}
      <TouchableOpacity onPress={handleAddToWishlist} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add to Wishlist</Text>
      </TouchableOpacity>

      {/* Select Seat Button */}
      <TouchableOpacity onPress={() => navigation.navigate('Cinema', { id: item._id, image: item.images })} style={styles.selectButton}>
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
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#FF515A',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: '#FF515A',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    bottom: 5,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
