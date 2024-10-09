import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const Latest = ({ navigation }) => {
    // Dữ liệu mẫu cho sản phẩm (products)
    const productData = [
        {
            _id: '1',
            name: 'Avengers: Infinity War',
            price: '$12.99',
            originer: 'Hollywood',
            images: require('../../assets/image/Anhmau.png'), // Thay đổi cách lấy ảnh bằng require
        },
        {
            _id: '2',
            name: 'Doctor Strange',
            price: '$11.99',
            originer: 'Hollywood',
            images: require('../../assets/image/Anhmau.png'),
        },
        {
            _id: '3',
            name: 'Jumanji',
            price: '$9.99',
            originer: 'Hollywood',
            images: require('../../assets/image/Anhmau.png'),
        },
        {
            _id: '4',
            name: 'Pathaan',
            price: '$8.99',
            originer: 'Bollywood',
            images: require('../../assets/image/Anhmau.png'),
        },
        {
            _id: '5',
            name: '3 Idiots',
            price: '$7.99',
            originer: 'Bollywood',
            images: require('../../assets/image/Anhmau.png'),
        },
        {
            _id: '6',
            name: 'Pyaar Ka Punchnama',
            price: '$6.99',
            originer: 'Bollywood',
            images: require('../../assets/image/Anhmau.png'),
        },
    ];

    const renderItem = ({ item }) => (
        <View style={styles.container_flat}>
            <TouchableOpacity onPress={() => navigation.navigate('Detail', { item })}>
                <Image source={item.images} style={styles.image_flat} />
                <Text style={styles.text1}>{item.name}</Text>
               
                <Text style={styles.text1}>{item.originer}  </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container_Tong}>
            <View style={styles.head}>
                <Image style={styles.img} source={require('../../assets/image/arrow-left.png')} />
                <Text style={styles.text}>Latest Movies</Text>
                <Image style={styles.img} source={require('../../assets/image/arrow-left.png')} />
            </View>

            <FlatList
                data={productData}
                keyExtractor={(item) => item._id}
                numColumns={2}
                renderItem={renderItem}
            />
        </View>
    );
};

export default Latest;

const styles = StyleSheet.create({
    container_Tong: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    head: {
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container_flat: {
        padding: 10,
        margin: 5,
        backgroundColor: '#fff',
      height:'60%',
        borderRadius: 20,
        width: '48%', // Đảm bảo mỗi mục chiếm 1 nửa chiều rộng màn hình để tạo dạng lưới
    },
    image_flat: {
        width: '100%', // Đảm bảo ảnh bao phủ toàn bộ chiều rộng của container
        height: 160, // Chiều cao ảnh phù hợp
        borderRadius: 10,
    },
    text1: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
        marginTop: 5,
    },
    img: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    text: {
        fontSize: 20,
        color: '#000',
        fontWeight: '400',
    },
});
