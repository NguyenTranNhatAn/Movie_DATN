  /* 
  /// gốc
    const handleSeatPress = useCallback((seatId, rowIndex, colIndex, seatType) => {
      if (seatType === 'U' || seatType === '_') {
        Alert.alert('Thông báo', 'Ghế này đã được đặt hoặc không thể chọn.');
        return;
      }
  
  
      if (seatType === 'P') {
        const currentSeatUser = seatMapId[rowIndex][colIndex]?.userId; // Lấy userId từ seatMapId
        console.log('User giữ ghế:', currentSeatUser);
  
        if (currentSeatUser && currentSeatUser !== userId) {
          Alert.alert('Thông báo', 'Ghế này đã được chọn bởi người dùng khác.');
          return;
        }
      }
  
  
  
  
  
  
      const seatPrice = seatPrices[seatType] || 0;
  
      setSelectedSeats((prevSeats) => {
        const isSeatSelected = prevSeats.some(seat => seat.seatId === seatId);
        let updatedSeats;
  
        if (isSeatSelected) {
          updatedSeats = prevSeats.filter(seat => seat.seatId !== seatId);
          socket.emit('deselect_seat', { showtimeId, row: rowIndex, col: colIndex, userId });
          const originalType = originalSeatMap[rowIndex][colIndex];
          setSeatMap((prevMap) =>
            prevMap.map((rowSeats, rIndex) =>
              rIndex === rowIndex
                ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? originalType : seat))
                : rowSeats
            )
          );
        } else {
          updatedSeats = [...prevSeats, { seatId, rowIndex, colIndex, price: seatPrice }];
          socket.emit('select_seat', { showtimeId, row: rowIndex, col: colIndex, userId });
          setSeatMap((prevMap) =>
            prevMap.map((rowSeats, rIndex) =>
              rIndex === rowIndex
                ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? 'P' : seat))
                : rowSeats
            )
          );
        }
  
        return updatedSeats;
      });
    }, [seatMap, originalSeatMap, seatPrices, showtimeId, userId, debouncedSeatPress]);
  ///
  */

  /*
  /// sửa theo lỗi mới
    useEffect(() => {
      socket.on('seat_locked', ({ seatId }) => {
        Alert.alert('Thông báo', `Ghế ${seatId} đã được giữ thành công.`);
        // Cập nhật trạng thái ghế trên UI
        setSeatMap((prevMap) =>
          prevMap.map((rowSeats) =>
            rowSeats.map((seat) => (seat.seatId === seatId ? { ...seat, type: 'P' } : seat))
          )
        );
      });
  
      socket.on('seat_unlocked', ({ row, col }) => {
        Alert.alert('Thông báo', `Ghế tại hàng ${row}, cột ${col} đã được giải phóng.`);
        // Cập nhật trạng thái ghế trên UI
        setSeatMap((prevMap) =>
          prevMap.map((rowSeats, rIndex) =>
            rIndex === row
              ? rowSeats.map((seat, cIndex) =>
                cIndex === col ? { ...seat, type: 'T' } : seat
              )
              : rowSeats
          )
        );
      });
  
      return () => {
        socket.off('seat_locked');
        socket.off('seat_unlocked');
      };
    }, []);
  
    const handleSeatPress = useCallback((seatId, rowIndex, colIndex, seatType) => {
      // Kiểm tra nếu ghế đã bị khóa
      const lockedSeat = lockedSeats[`${showtimeId}-${rowIndex}-${colIndex}`];
      if (lockedSeat && lockedSeat !== userId) {
        Alert.alert('Thông báo', 'Ghế này đã bị khóa bởi người dùng khác.');
        return;
      }
  
  
      if (seatType === 'U' || seatType === '_') {
        Alert.alert('Thông báo', 'Ghế này đã được đặt hoặc không thể chọn.');
        return;
      }
  
      if (seatType === 'P') {
        const currentSeatUser = seatMapId[rowIndex][colIndex]?.userId; // Lấy userId từ seatMapId
        console.log('User giữ ghế:', currentSeatUser);
  
        if (currentSeatUser && currentSeatUser !== userId) {
          Alert.alert('Thông báo', 'Ghế này đã được chọn bởi người dùng khác.');
          return;
        }
      }
      if (selectedSeats.length >= 5 && !selectedSeats.some(seat => seat.seatId === seatId)) {
        Alert.alert('Thông báo', 'Bạn không thể chọn quá 5 ghế cùng lúc.');
        return;
      }
      const seatPrice = seatPrices[seatType] || 0;
  
      setSelectedSeats((prevSeats) => {
        const isSeatSelected = prevSeats.some(seat => seat.seatId === seatId);
        let updatedSeats;
  
        if (isSeatSelected) {
          updatedSeats = prevSeats.filter(seat => seat.seatId !== seatId);
          socket.emit('deselect_seat', { showtimeId, row: rowIndex, col: colIndex, userId });
          const originalType = originalSeatMap[rowIndex][colIndex];
          setSeatMap((prevMap) =>
            prevMap.map((rowSeats, rIndex) =>
              rIndex === rowIndex
                ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? originalType : seat))
                : rowSeats
            )
          );
        } else {
          updatedSeats = [...prevSeats, { seatId, rowIndex, colIndex, price: seatPrice }];
          socket.emit('select_seat', { showtimeId, row: rowIndex, col: colIndex, userId });
          setSeatMap((prevMap) =>
            prevMap.map((rowSeats, rIndex) =>
              rIndex === rowIndex
                ? rowSeats.map((seat, cIndex) => (cIndex === colIndex ? 'P' : seat))
                : rowSeats
            )
          );
        }
  
        return updatedSeats;
      });
    }, [seatMap, originalSeatMap, seatPrices, showtimeId, userId, debouncedSeatPress, lockedSeats]);
  */

