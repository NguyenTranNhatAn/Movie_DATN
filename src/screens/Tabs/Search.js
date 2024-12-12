import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchMovie, clearSearchResults } from '../../reducers/SearchSlice';

const Search = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch();
    const { searchData, searchStatus } = useSelector((state) => state.search);
    const [searchTerm, setSearchTerm] = useState(''); // Biến lưu từ khóa tìm kiếm

    useEffect(() => {
        if (searchTerm) {
            dispatch(SearchMovie(searchTerm)); // Gọi API khi có từ khóa tìm kiếm
        } else {
            dispatch(clearSearchResults()); // Xóa kết quả tìm kiếm khi từ khóa trống
        }
    }, [dispatch, searchTerm]);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Detail', { item })}>
            <View style={styles.productContainer}>
                <Image source={{ uri: item.images[0] }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productOrigin}>Rating: {item.rating}</Text>
                    <Text style={styles.productLanguage}>Language : English </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Thanh tìm kiếm */}
            <View style={styles.searchContainer}>
                <Image source={require('../../../assets/icon/search.png')} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    value={searchTerm} // Giá trị từ state searchTerm
                    onChangeText={(text) => setSearchTerm(text)} // Cập nhật state khi người dùng nhập
                />
            </View>

            {/* Kiểm tra trạng thái và hiển thị dữ liệu */}
            {searchStatus === 'loading' ? (
                <Text>Loading...</Text>
            ) : searchData.length > 0 ? (
                <FlatList
                    data={searchData}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                />
            ) : (
                <Text>No movies found</Text>
            )}
        </View>
    );
};

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 50,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F2FA',
        borderRadius: 40,
        padding: 10,
        marginBottom: 20,
    },
    searchIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    productContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 5 },
        elevation: 2,
    },
    productImage: {
        width: 90,
        height: 90,
        borderRadius: 10,
        marginRight: 10,
    },
    productInfo: {
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    productOrigin: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    productLanguage: {
        fontSize: 16,
        color: '#000',
        marginTop: 2,
    },
});
