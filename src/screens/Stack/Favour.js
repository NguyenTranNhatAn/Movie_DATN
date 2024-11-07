import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Favour = ({ navigation }) => {
    const [favouriteMovies, setFavouriteMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // Thêm trạng thái để xử lý lỗi

    useEffect(() => {
        // Lấy token từ AsyncStorage hoặc nơi bạn lưu trữ
        const getToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token'); // Thay thế bằng cách bạn lưu token
                if (token) {
                    fetchFavourMovies(token);
                } else {
                    setError("Token không hợp lệ.");
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setError("Lỗi khi lấy token.");
                setLoading(false);
            }
        };

        const fetchFavourMovies = async (token) => {
            try {
                const response = await axios.get('https://be-movie-sooty.vercel.app/user/getWishList', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data && response.data.length > 0) {
                    setFavouriteMovies(response.data);
                } else {
                    setError("Không có dữ liệu yêu thích.");
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError("Lỗi khi lấy dữ liệu.");
                setLoading(false);
            }
        };

        getToken();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.container_flat}>
            <TouchableOpacity onPress={() => navigation.navigate('Detail', { item })}>
                <Image source={{ uri: item.images[0] }} style={styles.image_flat} />
                <Text style={styles.text1}>{item.name}</Text>
                <Text style={styles.text1}>{item.duration}</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container_Tong}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container_Tong}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container_Tong}>
            <View style={styles.head}>
                <View></View>
                <Text style={styles.text}>Favourite Movies</Text>
                <View></View>
            </View>

            <FlatList
                data={favouriteMovies}
                keyExtractor={(item) => item._id}
                numColumns={2}
                renderItem={renderItem}
            />
        </View>
    );
};

export default Favour;

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
        height: '60%',
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
    text: {
        fontSize: 20,
        color: '#000',
        fontWeight: '400',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});
