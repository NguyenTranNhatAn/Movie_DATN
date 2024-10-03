import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';

const Search = ({ navigation }) => {
    const productData = [
        {
            _id: '1',
            name: 'Sultan',
            originer: 'Bollywood Movie',
            language: 'Language: Hindi',
            images: require('../accsets/Anhmau.png'),
        },
        {
            _id: '2',
            name: 'Doctor Strange',
            originer: 'Hollywood Movie',
            language: 'Language: English, Hindi',
            images: require('../accsets/Anhmau.png'),
        },
        {
            _id: '3',
            name: 'Fast & Furious 7',
            originer: 'Hollywood Movie',
            language: 'Language: English, Hindi',
            images: require('../accsets/Anhmau.png'),
        },
        {
            _id: '4',
            name: 'Spider Man',
            originer: 'Hollywood Movie',
            language: 'Language: English, Hindi',
            images: require('../accsets/Anhmau.png'),
        },
        {
            _id: '5',
            name: '3 Idiots',
            originer: 'Bollywood Movie',
            language: 'Language: English, Hindi',
            images: require('../accsets/Anhmau.png'),
        },
    ];

    const renderItem = ({ item }) => (
        <View style={styles.productContainer}>
            <Image source={item.images} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productOrigin}>{item.originer}</Text>
                <Text style={styles.productLanguage}>{item.language}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Thanh tìm kiếm */}
            <View style={styles.searchContainer}>
                <Image source={require('../accsets/arrow-left.png')} style={styles.searchIcon} />
                <TextInput style={styles.searchInput} placeholder="Search" />
            </View>

            {/* Danh sách sản phẩm */}
            <FlatList
                data={productData}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
            />

            {/* Thanh điều hướng dưới cùng */}
          
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
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
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
        color: '#333',
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
        width: 60,
        height: 60,
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
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    footerButton: {
        backgroundColor: '#ff5757',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    footerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
