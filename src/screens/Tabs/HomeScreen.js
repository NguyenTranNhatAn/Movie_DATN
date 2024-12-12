import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState, } from 'react'
import { color } from '../../constants/color'

import Animated, {
    configureReanimatedLogger,
    ReanimatedLogLevel,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import Carousel from 'react-native-reanimated-carousel'
import { useDispatch, useSelector } from 'react-redux';
import { GetMovieList } from '../../reducers/MovieSlice';
import { converTime } from '../../utils/convertTime';
import { GetMovieDeatil } from '../../reducers/Genre/GenreDetailSlice';
import { GenreList } from '../../reducers/Genre/GenreListSlice';
import { UploadUsers } from '../../reducers/UploadUserslide';




configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
});
const HomeScreen = (props) => {
    const dispatch = useDispatch();
    const { genreData, genreStatus } = useSelector((state) => state.genreList);
    const { movieData, movieStatus } = useSelector((state) => state.movieList);
    const [listMovie, setListMovie] = useState([]);
    

    const { navigation } = props;
    const PAGE_WIDTH = Dimensions.get('window').width;
    const [isVertical, setIsVertical] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);
    const [pagingEnabled, setPagingEnabled] = useState(true);
    const [snapEnabled, setSnapEnabled] = useState(true);
    const progressValue = useSharedValue(0);
    const baseOptions = isVertical
        ? {
            vertical: true,
        }
        :
        {
            vertical: false,
            width: PAGE_WIDTH,
            height: PAGE_WIDTH * 0.6,
        };

        const { UploadUsersData, UploadUsersStatus } = useSelector((state) => state.UploadUsers);

        // Gọi API khi component được render
        useEffect(() => {
          if (UploadUsersStatus === 'idle') {
            dispatch(UploadUsers());
          }
        }, [UploadUsersStatus, dispatch]);
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
    const renderComingSoon = ({ item }) => {
        return (
            <TouchableOpacity  onPress={()=> navigation.navigate('Detail', { item, viewOnly: true })} style={{ width: 173, paddingHorizontal: 10, alignItems: 'flex-start' }}>
                <Image style={{ width: '100%',height:244,  borderRadius: 16 }} source={{ uri: item.images[0] }} />
            <Text  style={[styles.nameMovie,{textAlign:'left'}]}>
                {item.name}
               </Text>
               <Text  style={[styles.desc,{textAlign:'left'}]}>
                {item.genreName}
               </Text>
               <Text  style={[styles.desc,{textAlign:'left'}]}>
                {item.duration}
               </Text>



            </TouchableOpacity>
        )

    }



    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, }}>

                {/* header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Welcome {UploadUsersData.name}</Text>
                        <Text style={styles.desc}>Book your favorite movie</Text>
                    </View>
                    <View>
                        <Image style={styles.avataImg} source={require('../../../Img/anhspidermen.png')} />
                    </View>
                </View>
                {/* search bar */}
                <View style={styles.searchBar}>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.leftSearch}>
                        <TouchableOpacity>
                            <Image style={{ height: 24, width: 24 }} source={require('../../../assets/image/ss.png')} />
                        </TouchableOpacity>
                        <Text style={{ marginLeft: 12, fontSize: 18, fontWeight: 'regular' }}>Search</Text>
                    </TouchableOpacity>
            {/* {<View style={styles.rightSearch}>
                <Image style={{ height: 24, width: 24 }} source={require('../../../assets/image/adj.png')} />
            </View>} */}
                </View>
                {/* service */}
           {/* { <View style={{ marginTop: 20, marginHorizontal: 23 }}>
                <Text style={[styles.title, {}]}>Service</Text>
                <View style={styles.menuList}>
                    <View style={styles.itemMenu}>
                        <Image style={styles.menuImg} source={require('../../../assets/image/cinema.png')} />
                        <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'medium', color: color.black }}>Retal</Text>
                    </View>
                    <View style={styles.itemMenu}>
                        <Image style={styles.menuImg} source={require('../../../assets/image/imax.png')} />
                        <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'medium', color: color.black }}>Imax</Text>
                    </View>
                    <View style={styles.itemMenu}>
                        <Image style={styles.menuImg} source={require('../../../assets/image/4d.png')} />
                        <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'medium', color: color.black }}>4kxmax</Text>
                    </View>
                    <View style={styles.itemMenu}>
                        <Image style={styles.menuImg} source={require('../../../assets/image/sweet.png')} />
                        <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'medium', color: color.black }}>Sweet Box</Text>
                    </View>

                </View>

            </View>} */}
               
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 23, marginTop: 20 }}>
                    <Text style={styles.title}>Now Playing</Text>
                    <Text onPress={() => navigation.navigate('Lastest')}  >See All</Text>
                </View>

                <Carousel
                    loop
                    width={PAGE_WIDTH}
                    height={PAGE_WIDTH * 1.5}
                    vertical={false}
                    pagingEnabled={pagingEnabled}
                    snapEnabled={snapEnabled}
                    autoPlay={autoPlay}
                    autoPlayInterval={1500}
                    onProgressChange={(_, absoluteProgress) =>
                        (progressValue.value = absoluteProgress)
                    }
                    mode="parallax"
                    modeConfig={{
                        parallaxScrollingScale: 0.9,
                        parallaxScrollingOffset: 70,
                    }}

                    data={listMovie}
                    scrollAnimationDuration={1000}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                        onPress={()=> navigation.navigate('Detail', { item })}
                            style={{

                                flex: 1,
                                width: 350,
                                alignSelf: "center",
                                backgroundColor: "white"
                            }}
                        >
                            <Image style={styles.imgMovie} source={{ uri: item.images[0] }} />
                            <View  >
                                <Text style={styles.nameMovie}>{item.name}</Text>
                                <Text style={styles.des}>{converTime(item.duration)} • <Text>{item.genreName}</Text></Text>
                                <View style={styles.ratingCon}>
                                    <Image style={{ width: 20, height: 20 }} source={require('../../../assets/image/star.png')} />
                                    <Text style={{ fontSize: 20, color: 'black', marginRight: 5 }}>
                                        {item.rating}
                                    </Text>
                                    <Text style={{ fontSize: 16, color: 'gray', }}>
                                        (1,222)
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />


                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 23, marginTop: 20, marginBottom: 24 }}>
                    <Text style={styles.title}>Coming Soon</Text>
                    <Text>See All</Text>
                </View>
                <FlatList
                    data={listMovie}
                    style={{ marginLeft: 13, paddingRight: 23, flex: 1}}

                    renderItem={renderComingSoon}
                    horizontal={true}
                    keyExtractor={item => item._id}
                />


            </ScrollView>
        </View>
    )
}

export default HomeScreen
const styles = StyleSheet.create({
    ratingCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
    },
    des: {
        fontSize: 16,
        fontWeight: 'regular',
        color: "#615D5E",
        textAlign: 'center'

    },
    nameMovie: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 5,
    },
    imgMovie: {
        resizeMode: 'contain',
        height: 500,
        width: '100%',
        borderRadius: 30,


    },
    menuImg: {
        height: 60,
        width: 60,
        borderRadius: 30
    },
    itemMenu: {
        alignItems: 'center'

    },
    menuList: {
        marginTop: 15,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    rightSearch: {
        backgroundColor: color.pinkRed,
        marginLeft: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: 48,
        height: 48

    },
    leftSearch: {
        backgroundColor: color.haftWhite,
        paddingVertical: 12,
        paddingLeft: 20,
        alignItems: 'center',
        borderRadius: 8,
        flex: 1,
        flexDirection: 'row'
    },
    searchBar: {

        marginTop: 23,
        flexDirection: 'row',
        marginHorizontal: 23,
        justifyContent: 'space-between',
        borderRadius: 8,
    },
    avaCon: {
        backgroundColor: color.gray,

        alignItems: 'center',
        justifyContent: 'center',

    },
    avataImg: {
        borderRadius: 24,
        height: 55,
        width: 55,
        backgroundColor: color.gray,
        resizeMode: 'contain'
    }
    ,
    desc: {
        fontSize: 16,
        color: color.boldGray,
        letterSpacing: 1.6
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: color.black

    },
    header: {
        marginHorizontal: 23,
        justifyContent: 'space-between',
        flexDirection: 'row',

    },
    container: {
        paddingTop: 40,
        backgroundColor: 'white',
        flex: 1,
        paddingBottom:60


    }
})
