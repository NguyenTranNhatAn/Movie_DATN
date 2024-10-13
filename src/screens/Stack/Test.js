import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

// Chuỗi chỗ ngồi ban đầu
const initialSeats = 
  "_UUUUUUAAAAARRRR_/"+
  "_________________/"+
  "UU__AAAARRRRR__RR/"+
  "UU__UUUAAAAAA__AA/"+
  "AA__AAAAAAAAA__AA/"+
  "AA__AARUUUURR__AA/"+
  "UU__UUUA_RRRR__AA/"+
  "AA__AAAA_RRAA__UU/"+
  "AA__AARR_UUUU__RR/"+
  "AA__UUAA_UURR__RR/"+
  "_________________/"+
  "UU_AAAAAAAUUUU_RR/"+
  "RR_AAAAAAAAAAA_AA/"+
  "AA_UUAAAAAUUUU_AA/"+
  "AA_AAAAAAUUUUU_AA/"+
  "_________________/";

const SeatSelection = () => {
  const [seats, setSeats] = useState(initialSeats.split('/').filter(row => row.trim() !== ''));
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    // Log trạng thái ghế mỗi khi nó thay đổi
   seats.forEach(item=>console.log(item+'\n'))
  }, [seats]);

  const handleSeatSelect = (rowIndex, seatIndex) => {
    const seat = seats[rowIndex][seatIndex];
    const seatId = rowIndex * 10 + seatIndex; 

    if (seat === 'A') {
      const newSelectedIds = selectedIds.includes(seatId) 
        ? selectedIds.filter(id => id !== seatId)
        : [...selectedIds, seatId];

      setSelectedIds(newSelectedIds);
      
      // Cập nhật trạng thái ghế
      const newSeats = [...seats];
      newSeats[rowIndex] = newSeats[rowIndex].substring(0, seatIndex) + 
        (newSelectedIds.includes(seatId) ? 'U' : 'A') + 
        newSeats[rowIndex].substring(seatIndex + 1);
      setSeats(newSeats);
    } else {
      const message = seat === 'U' ? `Seat ${seatId + 1} is Booked` : `Seat ${seatId + 1} is Reserved`;
      Alert.alert("Seat Status", message);
    }
  };

  const renderSeatRow = ({ item, index }) => (
    <View style={styles.row}>
      {item.split('').map((seat, seatIndex) => {
        const seatId = index * 10 + seatIndex; // Tạo ID duy nhất cho ghế
        const isSelected = selectedIds.includes(seatId);
        
        return (
          <TouchableOpacity key={seatIndex} onPress={() => handleSeatSelect(index, seatIndex)}>
            <Text style={getSeatStyle(seat, isSelected)}>
              {seatId + 1} {/* Hiển thị ID ghế bắt đầu từ 1 */}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const getSeatStyle = (seat, isSelected) => {
    switch (seat) {
      case 'U':
        return styles.booked; // Ghế đã đặt
      case 'A':
        return isSelected ? styles.selected : styles.available; // Ghế có sẵn hoặc đã chọn
      case 'R':
        return styles.reserved; // Ghế đã đặt
      case '_':
        return styles.empty; // Vị trí trống
      default:
        return styles.empty; // Mặc định
    }
  };

  return (
    <FlatList
      data={seats}
      renderItem={renderSeatRow}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  available: {
    backgroundColor: 'green',
    borderRadius: 5,
    color: 'white',
    padding: 10,
  },
  selected: {
    backgroundColor: 'blue',
    borderRadius: 5,
    color: 'white',
    padding: 10,
  },
  booked: {
    backgroundColor: 'red',
    borderRadius: 5,
    color: 'white',
    padding: 10,
  },
  reserved: {
    backgroundColor: 'orange',
    borderRadius: 5,
    color: 'white',
    padding: 10,
  },
  empty: {
    padding: 10,
    margin: 5,
  },
});

export default SeatSelection;