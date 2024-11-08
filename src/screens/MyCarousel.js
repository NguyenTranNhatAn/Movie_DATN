import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const { width: screenWidth } = Dimensions.get('window');

const MyCarousel = () => {
    const data = [
        { imageUrl: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/10/20/1410385/Trieu-Le-Dinh---Gio--01.jpg' },
        { imageUrl: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/10/20/1410385/Trieu-Le-Dinh-Thi-Ha-01.jpg' },
        { imageUrl: 'https://bazaarvietnam.vn/wp-content/uploads/2024/10/trieu-le-dinh-tro-thanh-thi-hau-kim-ung-lan-thu-hai.jpg' },
        { imageUrl: 'https://bazaarvietnam.vn/wp-content/uploads/2024/10/trieu-le-dinh-tro-thanh-thi-hau-kim-ung-lan-thu-hai-3.jpg' },
    ];

    const renderItem = ({ item, index }) => {
        const prevIndex = (index - 1 + data.length) % data.length;
        const nextIndex = (index + 1) % data.length;

        return (
            <View style={ styles.slide }>
                <Image
                    style={ [styles.imageSmall, styles.imageLeft] }
                    source={ { uri: data[prevIndex].imageUrl } }
                    resizeMode="cover"
                />
                <Image
                    style={ styles.imageLarge }
                    source={ { uri: item.imageUrl } }
                    resizeMode="cover"
                />
                <Image
                    style={ [styles.imageSmall, styles.imageRight] }
                    source={ { uri: data[nextIndex].imageUrl } }
                    resizeMode="cover"
                />
            </View>
        );
    };

    return (
        <Carousel
            data={ data }
            renderItem={ renderItem }
            sliderWidth={ screenWidth }
            itemWidth={ screenWidth }
            layout={ 'default' }
            layoutCardOffset={ 0 }
        />
    );
};

const styles = StyleSheet.create({
    slide: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 300, // Tăng chiều cao để hiển thị hình ảnh tốt hơn
        paddingHorizontal: 15,
    },
    imageLarge: {
        width: '55%',
        height: '100%',
        borderRadius: 0,
        zIndex: 2,
        elevation: 5,
        shadowColor: '#000', // Thêm bóng cho ảnh lớn
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    imageSmall: {
        width: '25%',
        height: '80%',
        borderRadius: 10,
        opacity: 0.9, // Tăng độ trong suốt một chút
        shadowColor: '#000', // Thêm bóng cho ảnh nhỏ
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    imageLeft: {
        transform: [{ scale: 0.9 }, { translateX: -30 }, { rotateY: '30deg' }],
    },
    imageRight: {
        transform: [{ scale: 0.9 }, { translateX: 30 }, { rotateY: '-30deg' }],
    },
});

export default MyCarousel;
