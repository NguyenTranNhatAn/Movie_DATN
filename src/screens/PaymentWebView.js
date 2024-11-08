// PaymentWebView.js
import React from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator } from 'react-native';

const PaymentWebView = ({ route, navigation }) => {
    const { checkoutUrl, orderCode } = route.params;

    return (
        <WebView
            source={ { uri: checkoutUrl } }
            startInLoadingState={ true }
            renderLoading={ () => (
                <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) }
            onNavigationStateChange={ (navState) => {
                console.log("Navigated to:", navState.url); // Log URL đ
                if (navState.url.includes('success')) { // Kiểm tra nếu URL có chứa 'success'
                    navigation.navigate('PaySuccess', { orderCode }); // Điều hướng về màn hình PaySuccess
                }
            } }
        />
    );
};

export default PaymentWebView;
