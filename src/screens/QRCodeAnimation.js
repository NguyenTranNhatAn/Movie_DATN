import React, { useRef } from 'react';
import { View, Image, Animated, Text } from 'react-native';

const QRCodeAnimation = () => {
    const animatedHeight = useRef(new Animated.Value(20)).current; // Khởi tạo giá trị chiều cao

    // Hàm để thực hiện animation
    const animateLine = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedHeight, {
                    toValue: 380, // Chiều cao tối đa
                    duration: 1000, // Thời gian tăng
                    useNativeDriver: false,
                }),
                Animated.timing(animatedHeight, {
                    toValue: 20, // Trả về chiều cao ban đầu
                    duration: 1000, // Thời gian giảm
                    useNativeDriver: false,
                }),
            ])
        ).start();
    };

    React.useEffect(() => {
        animateLine();
    }, []);

    return (
        <View style={{ position: 'relative', width: '100%', height: 400 }}>
            <Image
                source={require('../assets/image/QR_Code02.png')}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                }}
            />
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: animatedHeight, // Chiều cao động
                    backgroundColor: 'transparent',
                }}
            />
            <Text style={{ position: 'absolute', bottom: 10, alignSelf: 'center' }}>
                Đang tải QR Code...
            </Text>
        </View>
    );
};

export default QRCodeAnimation;
