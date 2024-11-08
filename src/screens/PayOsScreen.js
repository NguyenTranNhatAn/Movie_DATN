import React, { useState, useEffect } from 'react';
import { View, Text, Button, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PayOsScreen = () => {
    const [loading, setLoading] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState(null);
    const navigation = useNavigation();

    // Hàm gọi API tạo liên kết thanh toán và mở trang thanh toán
    const createPaymentLinkAndOpen = async () => {
        setLoading(true); // Hiển thị trạng thái loading khi bắt đầu
        try {
            const response = await fetch('https://55de-171-252-189-233.ngrok-free.app/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: 'Thanh toán sản phẩm 1',
                    amount: 5000, // Giá sản phẩm
                    returnUrl: 'myapp://home', //   quay lại ứng dụng sau thanh toán
                    cancelUrl: 'myapp://home', //   thanh toán bị hủy
                }),
            });

            // Kiểm tra phản hồi trước khi chuyển sang JSON
            const text = await response.text();
            console.log('Response Text:', text);

            const result = JSON.parse(text); // Parse JSON từ phản hồi

            if (result.error === 0) {
                setCheckoutUrl(result.data.checkoutUrl); // Cập nhật checkoutUrl nếu cần
                Linking.openURL(result.data.checkoutUrl); // Mở liên kết thanh toán ngay lập tức
            } else {
                Alert.alert('Error', 'Failed to create payment link');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            Alert.alert('Error', 'An error occurred while creating payment link');
        } finally {
            setLoading(false); // Tắt trạng thái loading khi hoàn tất
        }
    };

    // Xử lý khi người dùng quay lại từ trang thanh toán
    const handleOpenURL = (event) => {
        if (event.url === 'myapp://home') {
            navigation.navigate('Home'); // Điều hướng về màn hình Home khi thanh toán xong
        }
    };

    // Lắng nghe sự kiện mở URL
    useEffect(() => {
        Linking.addEventListener('url', handleOpenURL);
        return () => {
            Linking.removeEventListener('url', handleOpenURL);
        };
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Hiển thị thông tin sản phẩm */}
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Sản phẩm 1 - 5000 VND</Text>
            <Button
                title={loading ? "Đang xử lý..." : "Mua hàng"}
                onPress={createPaymentLinkAndOpen}
                disabled={loading}
            />
        </View>
    );
};

export default PayOsScreen;
