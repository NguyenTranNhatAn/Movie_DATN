import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import API_BASE_URL from '../screens/config';
const PaymentSuccess = ({ route }) => {
    const { orderCode } = route.params;

    useEffect(() => {
        const updatePaymentStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/order/update-payment-status`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ orderCode }),
                });

                // Kiểm tra xem server có trả về JSON hay không
                const text = await response.text();
                console.log("Server response:", text); // Log phản hồi để kiểm tra nội dung

                const result = JSON.parse(text); // Parse JSON nếu phản hồi là JSON hợp lệ
                if (result.error === 0) {
                    Alert.alert("Thành công", "Trạng thái vé đã được cập nhật thành công!");
                } else {
                    Alert.alert("Lỗi", "Không thể cập nhật trạng thái vé.");
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
            }
        };

        // Gọi hàm cập nhật trạng thái sau khi màn hình load
        updatePaymentStatus();
    }, [orderCode]);

    return (
        <View style={ styles.container }>
            <Text style={ styles.successText }>Thanh toán thành công rồi nha!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successText: {
        fontSize: 18,
        color: 'green',
    },
});

export default PaymentSuccess;
