import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

const SeatBooking = () => {
    const [userId, setUserId] = useState('');
    const [seatMap, setSeatMap] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    //const socket = io('http://10.0.2.2:3006'); // Kết nối tới server qua IP Android AVD
    const socket = io('http://192.168.1.28:3006')
    const showtimeId = '671f9fc341ad0fbcaddb1af3'; // Suất chiếu mẫu
    const userID = 'tự thêm';
    useEffect(() => {
        // Lắng nghe sự kiện cập nhật sơ đồ ghế từ server
        socket.on('seat_map_updated', () => {
            loadSeatMap(); // Tự động tải lại sơ đồ ghế khi có sự thay đổi
        });

        // Lắng nghe khi ghế được chọn
        socket.on('seat_selected', ({ row, col, userId: selectedUserId }) => {
            if (userId !== selectedUserId) {
                const updatedSeatMap = seatMap.map((rowSeats, rowIndex) =>
                    rowSeats.map((seat, colIndex) => {
                        if (rowIndex === row && colIndex === col) return 'P'; // Đánh dấu ghế đang chờ thanh toán
                        return seat;
                    })
                );
                setSeatMap(updatedSeatMap);
            }
        });

        // Lắng nghe khi ghế bị hoàn lại
        socket.on('seat_reverted', ({ row, col }) => {
            const updatedSeatMap = seatMap.map((rowSeats, rowIndex) =>
                rowSeats.map((seat, colIndex) => {
                    if (rowIndex === row && colIndex === col) return 'T'; // Đổi trạng thái thành trống
                    return seat;
                })
            );
            setSeatMap(updatedSeatMap);
        });

        // Lắng nghe khi ghế được đặt
        socket.on('seat_booked', ({ row, col }) => {
            const updatedSeatMap = seatMap.map((rowSeats, rowIndex) =>
                rowSeats.map((seat, colIndex) => {
                    if (rowIndex === row && colIndex === col) return 'U'; // Đổi trạng thái thành đã đặt
                    return seat;
                })
            );
            setSeatMap(updatedSeatMap);
        });

        // Xử lý khi có lỗi
        socket.on('error', ({ message }) => {
            Alert.alert('Error', message);
        });

        return () => {
            socket.disconnect();
        };
    }, [seatMap, userId]);

    const loadSeatMap = async () => {
        if (!userId) {
            Alert.alert('Error', 'Vui lòng nhập User ID');
            return;
        }

        try {
            // 192.168.1.28
            // const response = await fetch(`http://10.0.2.2:3000/showtimes/${showtimeId}`);
            const response = await fetch(`http://192.168.1.28:3000/showtimes/${showtimeId}`);
            const data = await response.json();
            if (data.Room_Shape) {
                const rows = data.Room_Shape.split('/').map(row => row.split(''));
                setSeatMap(rows);
            } else {
                Alert.alert('Error', 'Không tìm thấy layout ghế');
            }
        } catch (error) {
            Alert.alert('Error', 'Lỗi khi lấy dữ liệu ghế');
        }
    };

    const selectSeat = (rowIndex, colIndex, seatType) => {
        if (seatType === 'U' || seatType === '_') {
            Alert.alert('Error', 'Ghế này đã được đặt hoặc không thể chọn.');
            return;
        }

        // Cập nhật giao diện ngay lập tức mà không cần nhấn nút load seat
        let updatedSeatMap = seatMap.map((rowSeats, rIndex) =>
            rowSeats.map((seat, cIndex) => {
                if (rIndex === rowIndex && cIndex === colIndex) {
                    return seatType === 'P' ? 'T' : 'P'; // Đổi trạng thái giữa 'pending' và 'trống'
                }
                return seat;
            })
        );
        setSeatMap(updatedSeatMap);  // Cập nhật UI ngay lập tức

        if (selectedSeats.find(seat => seat.row === rowIndex && seat.col === colIndex)) {
            setSelectedSeats(selectedSeats.filter(seat => seat.row !== rowIndex || seat.col !== colIndex));
            socket.emit('deselect_seat', { showtimeId, row: rowIndex, col: colIndex, userId });
        } else {
            setSelectedSeats([...selectedSeats, { row: rowIndex, col: colIndex }]);
            socket.emit('select_seat', { showtimeId, row: rowIndex, col: colIndex, userId });
        }
    };

    const handlePayment = () => {
        if (selectedSeats.length === 0) {
            Alert.alert('Error', 'Vui lòng chọn ít nhất một ghế.');
            return;
        }
        socket.emit('pay_for_seats', { showtimeId, seats: selectedSeats, userId });
    };

    return (
        <SafeAreaView style={ styles.container }>
            <Text style={ styles.title }>Sơ đồ ghế</Text>
            <TextInput
                style={ styles.input }
                placeholder="Nhập User ID"
                value={ userId }
                onChangeText={ setUserId }
            />
            <Button title="Load Seats" onPress={ loadSeatMap } />

            <ScrollView horizontal>
                <View style={ styles.seatMap }>
                    { seatMap.map((row, rowIndex) => (
                        <ScrollView key={ rowIndex } horizontal contentContainerStyle={ styles.row }>
                            <Text style={ styles.rowLabel }>Hàng { String.fromCharCode(65 + rowIndex) }</Text>
                            { row.map((seatType, colIndex) => (
                                <TouchableOpacity
                                    key={ colIndex }
                                    style={ [
                                        styles.seat,
                                        seatType === 'T' && styles.seatThuong,
                                        seatType === 'V' && styles.seatVip,
                                        seatType === 'D' && styles.seatDoi,
                                        seatType === 'U' && styles.seatBooked,
                                        seatType === 'P' && styles.seatPending,
                                    ] }
                                    onPress={ () => selectSeat(rowIndex, colIndex, seatType) }
                                >
                                    <Text>{ `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}` }</Text>
                                </TouchableOpacity>
                            )) }
                        </ScrollView>
                    )) }
                </View>
            </ScrollView>

            <Button title="Thanh toán" onPress={ handlePayment } />

            <View style={ styles.legend }>
                <Text>Legend:</Text>
                <View style={ styles.legendItem }>
                    <View style={ [styles.seat, styles.seatThuong] } />
                    <Text>Thường</Text>
                </View>
                <View style={ styles.legendItem }>
                    <View style={ [styles.seat, styles.seatVip] } />
                    <Text>VIP</Text>
                </View>
                <View style={ styles.legendItem }>
                    <View style={ [styles.seat, styles.seatDoi] } />
                    <Text>Ghế đôi</Text>
                </View>
                <View style={ styles.legendItem }>
                    <View style={ [styles.seat, styles.seatBooked] } />
                    <Text>Đã đặt</Text>
                </View>
                <View style={ styles.legendItem }>
                    <View style={ [styles.seat, styles.seatPending] } />
                    <Text>Đang chọn</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
    seatMap: { flexDirection: 'column', alignItems: 'center' },
    row: { flexDirection: 'row', marginVertical: 5 },
    rowLabel: { marginRight: 10, fontWeight: 'bold' },
    seat: { width: 40, height: 40, borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
    seatThuong: { backgroundColor: 'green', borderColor: 'green' },
    seatVip: { backgroundColor: 'red', borderColor: 'red' },
    seatDoi: { backgroundColor: 'pink', borderColor: 'pink' },
    seatBooked: { backgroundColor: 'gray', borderColor: 'gray' },
    seatPending: { backgroundColor: 'yellow', borderColor: 'yellow' },
    legend: { marginTop: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
});

export default SeatBooking;



