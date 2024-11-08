import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Alert } from 'react-native';

const QRScreen = ({ route }) => {
    const { ticketId } = route.params; // Nhận ticketId từ route params
    const [ticketDetails, setTicketDetails] = useState(null);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const response = await fetch(`http://192.168.1.28:3000/ticket/ticket-details/${ticketId}`);
                const data = await response.json();

                if (response.ok) {
                    setTicketDetails(data);
                } else {
                    Alert.alert('Lỗi', 'Không thể tải thông tin vé');
                }
            } catch (error) {
                console.error('Lỗi khi tải thông tin vé:', error);
                Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải thông tin vé');
            }
        };

        fetchTicketDetails();
    }, [ticketId]);

    if (!ticketDetails) {
        return <Text>Đang tải thông tin vé...</Text>;
    }

    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>Thanh toán thành công!</Text>
            <Text style={ styles.details }>Mã vé: { ticketDetails.ticketId }</Text>
            <Text style={ styles.details }>Người dùng: { ticketDetails.userId }</Text>
            <Text style={ styles.details }>Phim: { ticketDetails.movieName }</Text>
            <Text style={ styles.details }>Ghế: { ticketDetails.seatDetails.join(', ') }</Text>
            <Text style={ styles.details }>Tổng tiền: { ticketDetails.totalPrice.toLocaleString() }₫</Text>
            { ticketDetails.qrCode && (
                <Image
                    source={ { uri: ticketDetails.qrCode } }
                    style={ styles.qrCode }
                    resizeMode="contain"
                />
            ) }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 16,
        marginBottom: 10,
    },
    qrCode: {
        width: 250,
        height: 250,
        marginTop: 20,
    },
});

export default QRScreen;
