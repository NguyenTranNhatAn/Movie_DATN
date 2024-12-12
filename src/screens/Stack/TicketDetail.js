import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import API_BASE_URL from '../config';

const TicketDetail = ({ route }) => {
    const { ticketId } = route.params;
    console.log(ticketId)
    const [ticketData, setTicketData] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/ticket/${ticketId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error === 0) {
                    setTicketData(data.data);
                } else {
                    console.error('Failed to fetch ticket data:', data.message);
                }
            })
            .catch(error => console.error('Error fetching ticket data:', error));
    }, []);

    if (!ticketData) {
        return <Text>Loading...</Text>;
    }

    return (
        <SafeAreaView style={ styles.container }>
            {/* Header */ }
            <View style={ styles.header }>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={ 24 } color="red" style={ styles.backButton } />
                </TouchableOpacity>
                <Text style={ styles.headerTitle }>Thanh toán</Text>
                <TouchableOpacity>
                    <Ionicons name="menu" size={ 24 } color="red" />
                </TouchableOpacity>
            </View>

            {/* Movie Info */ }
            <View style={ styles.movieInfo }>
                <Image
                    source={ { uri: ticketData.movieImage } }
                    style={ styles.movieImage }
                />
                <View style={ styles.movieDetails }>
                    <Text style={ styles.movieTitle }>{ ticketData.movieName }</Text>
                    <Text style={ styles.movieSubTitle }>Thanh toán vé phim</Text>
                    <Text style={ styles.movieInfoText }>
                        { new Date(ticketData.showDate).toLocaleDateString() } - { ticketData.showTime }
                    </Text>
                    <Text style={ styles.movieInfoText }>{ ticketData.cinemaName }</Text>
                    <Text style={ styles.movieInfoText }>{ ticketData.roomName } - Ghế: { ticketData.seatsDetails.map(seat => seat.seatName).join(', ') }</Text>
                </View>
            </View>

            {/* Total Payment */ }
            <View style={ styles.totalContainer }>
                <Text style={ styles.totalLabel }>Tổng thanh toán:</Text>
                <Text style={ styles.totalAmount }>{ ticketData.totalPrice } đ</Text>
            </View>

            {/* Scrollable Section */ }
            <ScrollView style={ styles.scrollContainer }>
                {/* Ticket Information */ }
                <View style={ styles.sectionContainer }>
                    <Text style={ styles.sectionTitle }>THÔNG TIN VÉ</Text>
                    <View style={ styles.row }>
                        <Text style={ styles.label }>Số lượng ghế</Text>
                        <Text style={ styles.value }>{ ticketData.seatsDetails.length }</Text>
                    </View>
                    { ticketData.seatsDetails.map(seat => (
                        <View style={ styles.row } key={ seat._id }>
                            <Text style={ styles.label }>{ seat.seatName }</Text>
                            <Text style={ styles.value }>{ seat.price } đ</Text>
                        </View>
                    )) }
                    <View style={ styles.row }>
                        <Text style={ styles.label }>Tổng</Text>
                        <Text style={ styles.value }>{ ticketData.totalPrice } đ</Text>
                    </View>
                </View>

                {/* Combo Information */ }
                <View style={ styles.sectionContainer }>
                    <Text style={ styles.sectionTitle }>THÔNG TIN BẮP NƯỚC</Text>
                    { ticketData.combos.map(combo => (
                        <View style={ styles.row } key={ combo.comboName }>
                            <Image source={ { uri: combo.image } } style={ { width: 50, height: 50, marginRight: 8 } } />
                            <Text style={ styles.comboLabel }>{ combo.comboName }</Text>
                            <Text style={ styles.value }>x{ combo.quantity }</Text>
                            <Text style={ styles.value }>{ combo.totalComboPrice } đ</Text>
                        </View>
                    )) }
                </View>

                {/* Summary Section */ }
                <View style={ styles.summaryContainer }>
                    <Text style={ styles.summaryTitle }>TỔNG KẾT</Text>
                    <View style={ styles.row }>
                        <Text style={ styles.label }>Tổng cộng bao gồm VAT</Text>
                        <Text style={ styles.value }>{ ticketData.totalPrice } đ</Text>
                    </View>
                </View>

                {/* QR Code */ }
                <View style={ styles.sectionContainer }>
                    <Text style={ styles.sectionTitle }>QR CODE</Text>
                    <QRCode value={ ticketData.qrCode } size={ 150 } />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#f8f8f8',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    movieInfo: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    movieImage: {
        width: 80,
        height: 120,
        marginRight: 16,
        borderRadius: 8,
    },
    movieDetails: {
        flex: 1,
    },
    movieTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    movieSubTitle: {
        fontSize: 12,
        color: 'red',
        marginBottom: 4,
    },
    movieInfoText: {
        fontSize: 14,
        color: '#555',
        marginVertical: 2,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#f9f9f9',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    sectionContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#666',
    },
    value: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    comboLabel: {
        fontSize: 14,
        color: '#333',
    },
    summaryContainer: {
        padding: 16,
        backgroundColor: '#f4f4f4',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        marginVertical: 8,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    paymentIcon: {
        width: 32,
        height: 32,
        marginRight: 8,
    },
    paymentText: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    checkmarkIcon: {
        marginRight: 8,
    },
    agreementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    agreementText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
    confirmButton: {
        backgroundColor: 'red',
        paddingVertical: 12,
        alignItems: 'center',
        marginHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TicketDetail;
