import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Text, Image } from 'react-native';
import { WebView } from 'react-native-webview';

const ZaloPayPaymentScreen = ({ route }) => {
    const { amount, userId, ticketId } = route.params; // Nhận số tiền và userId từ route params
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [ticketInfo, setTicketInfo] = useState(null);

    const handleCreatePayment = async () => {
        try {
            const response = await fetch('https://d4dd-171-252-189-233.ngrok-free.app/order/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Number(amount), ticketId }),
            });

            const data = await response.json();

            if (data.return_code === 1) {
                setPaymentUrl(data.order_url); // URL thanh toán từ ZaloPay
            } else {
                Alert.alert('Lỗi', 'Không thể tạo đơn hàng.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi tạo đơn hàng.');
        }
    };

    const fetchTicketDetailsByUserId = async () => {
        try {
            const response = await fetch(`http://192.168.1.28:3000/ticket/user/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setTicketInfo(data);
            } else {
                Alert.alert('Lỗi', 'Không thể tải thông tin vé');
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin vé:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi lấy thông tin vé');
        }
    };

    useEffect(() => {
        if (ticketInfo) {
            Alert.alert('Thông báo', 'Thanh toán thành công!');
        }
    }, [ticketInfo]);

    return (
        <View style={ { flex: 1 } }>
            { paymentUrl ? (
                <WebView
                    source={ { uri: paymentUrl } }
                    onNavigationStateChange={ (navState) => {
                        if (navState.url.includes('redirect-url')) {
                            fetchTicketDetailsByUserId();
                            setPaymentUrl(null); // Đóng WebView sau khi hoàn tất thanh toán
                        }
                    } }
                />
            ) : (
                <>
                    <Text>Số tiền: { amount }</Text>
                    <Button title="Tạo thanh toán ZaloPay" onPress={ handleCreatePayment } />
                </>
            ) }

            { ticketInfo && (
                <View>
                    <Text>Thông tin vé:</Text>
                    <Text>Rạp: { ticketInfo.cinemaName }</Text>
                    <Text>Phòng: { ticketInfo.roomName }</Text>
                    <Text>Phim: { ticketInfo.movieName }</Text>
<Text>Thời gian: { ticketInfo.showTime } - { new Date(ticketInfo.showDate).toLocaleDateString() }</Text>
                    <Text>Tổng tiền: { ticketInfo.totalPrice.toLocaleString() }₫</Text>
                    { ticketInfo.qrCode && (
                        <Image source={ { uri: ticketInfo.qrCode } } style={ { width: 200, height: 200 } } />
                    ) }
                </View>
            ) }
        </View>
    );
};

export default ZaloPayPaymentScreen;