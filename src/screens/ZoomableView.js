import React from 'react';
import {
    Image,
    StyleSheet,
    View,
    Dimensions
} from 'react-native';
import { ReactNativeZoomableView } from '@dudigital/react-native-zoomable-view';
import SeatSelectionScreen from './SeatSelectionScreen';

const { width, height } = Dimensions.get('window');

export default function App() {
    // Dữ liệu hình ảnh
    const imageItem = {
        url: 'https://hoangphucphoto.com/wp-content/uploads/2023/08/jpeg-5.jpg'
    };

    return (
        <View style={ styles.container }>
            <ReactNativeZoomableView
                maxZoom={ 2 }
                minZoom={ 0.5 }
                zoomStep={ 0.5 }
                initialZoom={ 1 }
                bindToBorders={ false }
                style={ styles.zoomableView }
            >
                <Image
                    source={ { uri: imageItem.url } }
                    style={ styles.image }
                />

            </ReactNativeZoomableView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    zoomableView: {
        width: width,
        height: height,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});
