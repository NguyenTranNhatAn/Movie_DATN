import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetMovieList } from '../../reducers/MovieSlice';
import { GenreList } from '../../reducers/Genre/GenreListSlice';

const Latest = ({ navigation }) => {
    // Dữ liệu mẫu cho sản phẩm (products)
    const dispatch = useDispatch();
    const { genreData, genreStatus } = useSelector((state) => state.genreList);
    const { movieData, movieStatus } = useSelector((state) => state.movieList);
    const [listMovie, setListMovie] = useState([]);
    useEffect(()=>{
        if (movieData.length === 0) {
            dispatch(GetMovieList());
        }

        if (genreData.length === 0) {
            dispatch(GenreList());
        }

        if (movieData.length > 0 && genreData.length > 0) {
            const updatedMovies = movieData.map(movie => {
                const genre = genreData.find(genre => genre._id === movie.genreId);
                return {
                    ...movie,
                    genreName: genre ? genre.name : "Unknown"
                };
            });

            setListMovie(updatedMovies);
        }
    },[dispatch,movieData,genreData])

    const renderItem = ({ item }) => (
        <View style={styles.container_flat}>
            <TouchableOpacity onPress={() => navigation.navigate('Detail', { item })}>
                <Image source={{uri:item.images[0]}} style={styles.image_flat} />
                <Text style={styles.text1}>{item.name}</Text>
               
                <Text style={styles.text1}>{item.genreName}  </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container_Tong}>
            <View style={styles.head}>
               <TouchableOpacity onPress={()=>navigation.goBack()}>
               <Image style={styles.img}  source={require('../../../assets/image/arrow-left.png')} />
               </TouchableOpacity>
                <Text style={styles.text}>Latest Movies</Text>
                <View></View>
            </View>

            <FlatList
             showsVerticalScrollIndicator={false}
                data={listMovie}
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
