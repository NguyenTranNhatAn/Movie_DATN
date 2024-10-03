import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { color } from '../../constants/color'

import Animated, {

    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import Carousel from 'react-native-reanimated-carousel';
const HomeScreen = () => {
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

    const list = [
        {
            id: '1',
            title: 'First Item',
            color: '#26292E',
            img: require('../../../assets/image/avenger.png')
        },
        {
            id: '2',
            title: 'Second Item',
            color: '#899F9C',
            color: '#899F9C',
            img: require('../../../assets/image/avenger.png')
        },
        {
            id: '3',
            title: 'Third Item',
            color: '#B3C680',
            img: require('../../../assets/image/avenger.png')
        },
        {
            id: '4',
            title: 'Fourth Item',
            color: '#5C6265',
            img: require('../../../assets/image/avenger.png')
        },
        {
            id: '5',
            title: 'Fifth Item',
            color: '#F5D399',
            img: require('../../../assets/image/avenger.png')
        }
    ];


    return (
        <View style={styles.container}>
            <ScrollView>
                {/* header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Welcome NhatAn</Text>
                        <Text style={styles.desc}>Book your favorite movie</Text>
                    </View>
                    <View>
                        <Image style={styles.avataImg} source={require('../../../assets/image/avataa.png')} />
                    </View>
                </View>
                {/* search bar */}
                <View style={styles.searchBar}>
                    <View style={styles.leftSearch}>
                        <TouchableOpacity>
                            <Image style={{ height: 24, width: 24 }} source={require('../../../assets/image/ss.png')} />
                        </TouchableOpacity>
                        <Text style={{ marginLeft: 12, fontSize: 18, fontWeight: 'regular' }}>Search</Text>
                    </View>
                    <View style={styles.rightSearch}>
                        <Image style={{ height: 24, width: 24 }} source={require('../../../assets/image/adj.png')} />
                    </View>
                </View>
                {/* service */}
                <View style={{ marginTop: 20, marginHorizontal: 23 }}>
                    <Text style={[styles.title, {}]}>Service</Text>
                    <View style={styles.menuList}>
                        <View style={styles.itemMenu}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/cinema.png')} />
                            <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'medium', color: color.black }}>Retal</Text>
                        </View>
                        <View style={styles.itemMenu}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/cinema.png')} />
                            <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'medium', color: color.black }}>Retal</Text>
                        </View>
                        <View style={styles.itemMenu}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/cinema.png')} />
                            <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'medium', color: color.black }}>Retal</Text>
                        </View>
                        <View style={styles.itemMenu}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/cinema.png')} />
                            <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'medium', color: color.black }}>Retal</Text>
                        </View>

                    </View>
                    <View style={styles.menuList}>
                        <View style={styles.itemMenu}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/cinema.png')} />
                            <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'medium', color: color.black }}>Retal</Text>
                        </View>
                        <View style={styles.itemMenu}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/cinema.png')} />
                            <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'medium', color: color.black }}>Retal</Text>
                        </View>
                        <View style={styles.itemMenu}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/cinema.png')} />
                            <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'medium', color: color.black }}>Retal</Text>
                        </View>
                        <View style={styles.itemMenu}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/cinema.png')} />
                            <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'medium', color: color.black }}>Retal</Text>
                        </View>

                    </View>
                </View>
                {/*  */}
                <View style={{flexDirection:'row',alignItems:'center', justifyContent:'space-between',paddingHorizontal:23,marginTop:20}}>
                    <Text style={styles.title}>Now Playing</Text>
                    <Text >See All</Text>
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

                    data={list}
                    scrollAnimationDuration={1000}
                    renderItem={({ item }) => (
                        <View
                            style={{

                              
                                
                                flex: 1,
                                width: 350,
                                alignSelf: "center",
                                backgroundColor: item?.color
                            }}
                        >
                            <Image style={styles.img} source={item.img} />
                            <View  >
                               <Text style={styles.title}>Avenger Infinity War</Text> 
                               <Text style={styles.title}>2h29m • Action, adventure, sci-fi</Text> 
                            </View>
                        </View>
                    )}
                />
                 <View style={{flexDirection:'row',alignItems:'center', justifyContent:'space-between',paddingHorizontal:23,marginTop:20}}>
                    <Text style={styles.title}>Now Playing</Text>
                    <Text >See All</Text>
                </View>
            </ScrollView>

        </View>
    )
}

export default HomeScreen
const styles = StyleSheet.create({
    img: {
       resizeMode:'contain',
       height:500,
       width:'100%'
        

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

    }
})
