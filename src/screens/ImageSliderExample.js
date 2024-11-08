import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';

const ImageSliderExample = () => {
  const images = [
    'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/10/20/1410385/Trieu-Le-Dinh---Gio--01.jpg',
    'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/10/20/1410385/Trieu-Le-Dinh-Thi-Ha-01.jpg',
    'https://bazaarvietnam.vn/wp-content/uploads/2024/10/trieu-le-dinh-tro-thanh-thi-hau-kim-ung-lan-thu-hai.jpg',
    'https://bazaarvietnam.vn/wp-content/uploads/2024/10/trieu-le-dinh-tro-thanh-thi-hau-kim-ung-lan-thu-hai-3.jpg',
  ];

  return (
    <SafeAreaView style={ styles.container }>
      <SliderBox
        images={ images }
        sliderBoxHeight={ 400 }
        onCurrentImagePressed={ index => console.log(`Image ${index} pressed`) }
        dotColor="#FFEE58"
        inactiveDotColor="#90A4AE"
        autoplay
        circleLoop
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default ImageSliderExample;
