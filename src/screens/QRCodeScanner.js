import React from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

const QRCodeScanner = () => {
    const animatedHeight = new Animated.Value(20);
    const animatedLineTop = new Animated.Value(20);

    // Animation for the QR code scanning effect
    const animateHeight = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedHeight, {
                    toValue: 400 - 20,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedHeight, {
                    toValue: 20,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ]),
        ).start();
    };

    // Animation for the line movement
    const animateLine = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedLineTop, {
                    toValue: 400 - 20,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedLineTop, {
                    toValue: 20,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ]),
        ).start();
    };

    React.useEffect(() => {
        animateHeight();
        animateLine();
    }, []);

    return (
        <View style={ styles.container }>
            <View style={ styles.scan }>
                <View style={ styles.qrcode }>
                    <Image
                        source={ require('../assets/image/QR_Code01.png') }
                        style={ styles.qrImage }
                    />
                    <Animated.View
                        style={ [
                            styles.qrOverlay,
                            { height: animatedHeight }
                        ] }
                    >
                        <Image
                            source={ require('../assets/image/QR_Code02.png') }
                            style={ styles.qrImage }
                        />
                    </Animated.View>

                    <Animated.View
                        style={ [
                            styles.line,
                            { top: animatedLineTop }
                        ] }
                    />
                    <Image
                        source={ require('../assets/image/border.png') }
                        style={ styles.border }
                    />
                </View>
                <Animated.Text style={ styles.text }>
                    QR code Scanning...
                </Animated.Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
    },
    scan: {
        alignItems: 'center',
        flexDirection: 'column',
    },
    qrcode: {
        position: 'relative',
        width: 400,
        height: 400,
        overflow: 'hidden',
    },
    qrImage: {
        width: 400,
        height: 400,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    qrOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 20,
    },
    line: {
        position: 'absolute',
        left: 20,
        right: 20,
        height: 2,
        backgroundColor: '#35fd5c',
        shadowColor: '#35fd5c',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5,
    },
    border: {
        position: 'absolute',
        inset: 0,
        width: 400,
        height: 400,
    },
    text: {
        textTransform: 'uppercase',
        fontSize: 32,
        marginTop: 20,
        color: '#fff',
        letterSpacing: 2,
        textShadowColor: '#fff',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
});

export default QRCodeScanner;

