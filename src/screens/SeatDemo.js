
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons'; // Nhớ cài đặt thư viện này
import { COLORS } from '../theme/theme'; // Đường dẫn tới tệp chứa các màu của bạn

const generateSeats = () => {
    const numRow = 3; // Số hàng ghế
    const numColumnLeft = 3; // Số ghế bên trái lối đi
    const numColumnRight = 3; // Số ghế bên phải lối đi
    const rowArray = [];
    const rows = ['A', 'B', 'C']; // Các hàng
    let start;
    for (let i = 0; i < numRow; i++) {
        const columnArray = [];
        // let start = i * (numColumnLeft + numColumnRight + 1) + 1; // Tính số ghế bắt đầu cho hàng hiện tại
        start = 1;
        // Thêm ghế bên trái lối đi
        for (let j = 0; j < numColumnLeft; j++) {
            const seatObject = {
                number: start,
                row: rows[i],
                taken: Boolean(Math.round(Math.random())), // Ghế có thể đã được đặt
                selected: false,
            };
            columnArray.push(seatObject);
            start++;
        }

        // Thêm khoảng trống cho lối đi
        columnArray.push({ number: '', row: rows[i], taken: false, selected: false }); // Khoảng trống cho lối đi

        // Thêm ghế bên phải lối đi
        for (let j = 0; j < numColumnRight; j++) {

            const seatObject = {
                number: start,
                row: rows[i],
                taken: Boolean(Math.round(Math.random())), // Ghế có thể đã được đặt
                selected: false,
            };

            columnArray.push(seatObject);
            start++;
        }

        rowArray.push(columnArray);
    }
    return rowArray;
};

const ExampleComponent = () => {
    const [seats, setSeats] = useState(generateSeats()); // Khởi tạo ghế

    const selectSeat = (rowIndex, seatIndex) => {
        const updatedSeats = [...seats]; // Sao chép mảng ghế hiện tại
        const selectedSeat = updatedSeats[rowIndex][seatIndex];

        // Nếu ghế chưa được đặt, thay đổi trạng thái chọn
        if (!selectedSeat.taken) {
            selectedSeat.selected = !selectedSeat.selected; // Chọn hoặc bỏ chọn ghế
            setSeats(updatedSeats); // Cập nhật trạng thái ghế
        }
    };

    const renderSeats = () => {
        return seats.map((row, rowIndex) => (
            <View style={ styles.containerGap20 } key={ rowIndex }>
                { row.map((item, index) => (
                    <TouchableOpacity
                        key={ item.number }
                        onPress={ () => selectSeat(rowIndex, index) }
                        disabled={ item.taken } // Không cho phép nhấn nếu ghế đã được đặt
                        style={ styles.seatContainer1 }
                    >
                        <View style={ styles.seatContainer1 }>
                            { item && item.number ? ( // Kiểm tra item có hợp lệ không
                                <>
                                    <Icon1
                                        name="sofa-single"
                                        style={ [
                                            styles.seatIcon,
                                            item.taken ? { color: COLORS.Grey } : {},
                                            item.selected ? { color: COLORS.Orange } : {},
                                        ] }
                                    />
                                    <Text style={ styles.seatLabel }>
                                        { `${item.row || 'undefined'}${item.number || 'undefined'}` }
                                    </Text>
                                </>
                            ) : (
                                <View style={ styles.emptySeat } /> // Khoảng trống cho lối đi
                            ) }
                        </View>
                    </TouchableOpacity>
                )) }
            </View>
        ));
    };

    return (
        <View style={ styles.container }>
            { renderSeats() }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerGap20: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 35,
    },
    seatContainer1: {
        alignItems: 'center',
        marginHorizontal: 5,
    },
    seatIcon: {
        fontSize: 30,
    },
    seatLabel: {
        textAlign: 'center',
    },
    emptySeat: {
        width: 50, // Chiều rộng khoảng trống lối đi
        height: 30, // Chiều cao khoảng trống lối đi
        backgroundColor: 'transparent', // Màu nền trong suốt
    },
});

export default ExampleComponent;
