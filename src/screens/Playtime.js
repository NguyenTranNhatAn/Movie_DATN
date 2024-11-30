// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
// import Icon from 'react-native-vector-icons/AntDesign'; // Import icon từ react-native-vector-icons

// // Hàm tạo danh sách ngày từ hôm nay đến n ngày sau
// const generateDays = (numDays) => {
//     const days = [];
//     const now = new Date();

//     for (let i = 0; i < numDays; i++) {
//         const date = new Date();
//         date.setDate(now.getDate() + i);

//         const dayOfWeek = date.toLocaleDateString('vi-VN', { weekday: 'short' });
//         const day = date.getDate();
//         const formattedDate = date.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD

//         days.push({ dayOfWeek, day, date: formattedDate });
//     }

//     return days;
// };

// const sampleData = [
//     {
//         cinemaName: 'CGV Vincom Thủ Đức',
//         showtimes: [
//             {
//                 format: '2D Phụ Đề Việt',
//                 times: ['17:45', '20:10']
//             },
//             {
//                 format: '2D Phụ Đề Việt | Rạp STARIUM',
//                 times: ['19:30', '21:50']
//             }
//         ]
//     },
//     {
//         cinemaName: 'CGV Aeon Bình Tân',
//         showtimes: []
//     },
//     {
//         cinemaName: 'CGV Aeon Tân Phú',
//         showtimes: []
//     },
//     {
//         cinemaName: 'CGV Crescent Mall',
//         showtimes: []
//     }
//     // Thêm dữ liệu các rạp khác nếu cần
// ];

// const Playtime = () => {
//     const [expandedCinema, setExpandedCinema] = useState(null);
//     const [selectedDate, setSelectedDate] = useState(generateDays(1)[0].date); // Mặc định là ngày hôm nay

//     // Danh sách ngày trong 7 ngày tiếp theo
//     const days = generateDays(7);

//     // Fetch data from the API
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('http://10.0.2.2:3000/api/playtimes/670ad1a7320f37a6308bc5a2');
//                 const result = await response.json();
//                 console.log(result)
//                 setCinemaData(result);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching playtime data:', error);
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     const toggleExpand = (cinemaIndex) => {
//         setExpandedCinema(expandedCinema === cinemaIndex ? null : cinemaIndex);
//     };

//     const renderDayItem = ({ item }) => {
//         const isSelected = item.date === selectedDate;
//         return (
//             <TouchableOpacity onPress={ () => setSelectedDate(item.date) }>
//                 <View style={ [styles.dayContainer, isSelected && styles.selectedDay] }>
//                     <Text style={ [styles.dayOfWeek, isSelected && styles.selectedText] }>{ item.dayOfWeek }</Text>
//                     <Text style={ [styles.day, isSelected && styles.selectedText] }>{ item.day }</Text>
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <ScrollView style={ styles.container }>
//             <View style={ styles.header }>
//                 <Text style={ styles.movieTitle }>VENOM: KEO CUỐI</Text>
//             </View>
//             <FlatList
//                 horizontal
//                 data={ days }
//                 keyExtractor={ (item) => item.date }
//                 renderItem={ renderDayItem }
//                 style={ styles.datePicker }
//                 showsHorizontalScrollIndicator={ false }
//             />
//             <Text style={ styles.selectedDate }>Ngày chọn: { selectedDate }</Text>
//             { sampleData.map((cinema, index) => (
//                 <View key={ index } style={ styles.cinemaContainer }>
//                     <TouchableOpacity style={ styles.cinemaHeader } onPress={ () => toggleExpand(index) }>
//                         <Text style={ styles.cinemaName }>{ cinema.cinemaName }</Text>
//                         <Icon name={ expandedCinema === index ? 'up' : 'down' } size={ 24 } color="#c4001d" />
//                     </TouchableOpacity>
//                     { expandedCinema === index && (
//                         cinema.showtimes.length > 0 ? (
//                             cinema.showtimes.map((showtime, showtimeIndex) => (
//                                 <View key={ showtimeIndex } style={ styles.showtimeContainer }>
//                                     <Text style={ styles.format }>
//                                         • { showtime.format }
//                                     </Text>
//                                     <View style={ styles.timeRow }>
//                                         { showtime.times.map((time, timeIndex) => (
//                                             <TouchableOpacity key={ timeIndex } style={ styles.timeButton }>
//                                                 <Text style={ styles.timeText }>{ time }</Text>
//                                             </TouchableOpacity>
//                                         )) }
//                                     </View>
//                                 </View>
//                             ))
//                         ) : (
//                             <Text style={ styles.noShowtime }>Không có suất chiếu</Text>
//                         )
//                     ) }
//                 </View>
//             )) }
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f9f9f9',
//         padding: 10
//     },
//     header: {
//         alignItems: 'center',
//         marginBottom: 10
//     },
//     movieTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#c4001d'
//     },
//     datePicker: {
//         marginBottom: 10,
//         paddingHorizontal: 5
//     },
//     dayContainer: {
//         alignItems: 'center',
//         marginHorizontal: 5,
//         padding: 10,
//         borderRadius: 10,
//         backgroundColor: '#e0e0e0'
//     },
//     selectedDay: {
//         backgroundColor: '#c4001d'
//     },
//     dayOfWeek: {
//         fontSize: 14,
//         color: '#555'
//     },
//     day: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#555'
//     },
//     selectedText: {
//         color: '#fff'
//     },
//     selectedDate: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginBottom: 15
//     },
//     cinemaContainer: {
//         marginBottom: 20,
//         backgroundColor: '#fff',
//         padding: 15,
//         borderRadius: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         elevation: 3
//     },
//     cinemaHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//     },
//     cinemaName: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#e74c3c'
//     },
//     showtimeContainer: {
//         marginTop: 10,
//         marginBottom: 10
//     },
//     format: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 5,
//         color: '#f39c12'
//     },
//     timeRow: {
//         flexDirection: 'row',
//         flexWrap: 'wrap'
//     },
//     timeButton: {
//         backgroundColor: '#ecf0f1',
//         padding: 8,
//         marginRight: 8,
//         marginBottom: 8,
//         borderRadius: 5,
//         borderWidth: 1,
//         borderColor: '#bdc3c7'
//     },
//     timeText: {
//         color: '#2c3e50',
//         fontWeight: '600'
//     },
//     noShowtime: {
//         fontSize: 14,
//         color: '#7f8c8d',
//         fontStyle: 'italic'
//     }
// });

// export default Playtime;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

// Hàm tạo danh sách ngày từ hôm nay đến n ngày sau
const generateDays = (numDays) => {
    const days = [];
    const now = new Date();

    for (let i = 0; i < numDays; i++) {
        const date = new Date();
        date.setDate(now.getDate() + i);

        const dayOfWeek = date.toLocaleDateString('vi-VN', { weekday: 'short' });
        const day = date.getDate();
        const formattedDate = date.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD

        days.push({ dayOfWeek, day, date: formattedDate });
    }

    return days;
};

const Playtime = () => {
    const [expandedCinema, setExpandedCinema] = useState(null);
    const [selectedDate, setSelectedDate] = useState(generateDays(1)[0].date); // Mặc định là ngày hôm nay
    const [cinemaData, setCinemaData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Danh sách ngày trong 7 ngày tiếp theo
    const days = generateDays(7);

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                //192.168.1.28
                //const response = await fetch('http://10.0.2.2:3000/api/playtimes/670ad1a7320f37a6308bc5a2');
                const response = await fetch('http://http://103.130.213.92:3006/api/playtimes/670ad1a7320f37a6308bc5a2');
                const result = await response.json();
                console.log(result);
                setCinemaData(result);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching playtime data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleExpand = (cinemaIndex) => {
        setExpandedCinema(expandedCinema === cinemaIndex ? null : cinemaIndex);
    };

    const renderDayItem = ({ item }) => {
        const isSelected = item.date === selectedDate;
        return (
            <TouchableOpacity onPress={() => setSelectedDate(item.date)}>
                <View style={[styles.dayContainer, isSelected && styles.selectedDay]}>
                    <Text style={[styles.dayOfWeek, isSelected && styles.selectedText]}>{item.dayOfWeek}</Text>
                    <Text style={[styles.day, isSelected && styles.selectedText]}>{item.day}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.movieTitle}>Nhà tù Shawshank 4</Text>
            </View>
            <FlatList
                horizontal
                data={days}
                keyExtractor={(item) => item.date}
                renderItem={renderDayItem}
                style={styles.datePicker}
                showsHorizontalScrollIndicator={false}
            />
            <Text style={styles.selectedDate}>Ngày chọn: {selectedDate}</Text>
            {cinemaData.map((cinema, index) => (
                <View key={index} style={styles.cinemaContainer}>
                    <TouchableOpacity style={styles.cinemaHeader} onPress={() => toggleExpand(index)}>
                        <Text style={styles.cinemaName}>{cinema.cinema_id.name}</Text>
                        <Icon name={expandedCinema === index ? 'up' : 'down'} size={24} color="#c4001d" />
                    </TouchableOpacity>
                    {expandedCinema === index && (
                        cinema.dates.map((dateEntry, dateIndex) => (
                            dateEntry.date.split('T')[0] === selectedDate && (
                                <View key={dateIndex} style={styles.showtimeContainer}>
                                    <Text style={styles.format}>
                                        • {cinema.format}
                                    </Text>
                                    <View style={styles.timeRow}>
                                        {dateEntry.times.map((time, timeIndex) => (
                                            <TouchableOpacity key={timeIndex} style={styles.timeButton}>
                                                <Text style={styles.timeText}>{time}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )
                        ))
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 10
    },
    header: {
        alignItems: 'center',
        marginBottom: 10
    },
    movieTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#c4001d'
    },
    datePicker: {
        marginBottom: 10,
        paddingHorizontal: 5
    },
    dayContainer: {
        alignItems: 'center',
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#e0e0e0'
    },
    selectedDay: {
        backgroundColor: '#c4001d'
    },
    dayOfWeek: {
        fontSize: 14,
        color: '#555'
    },
    day: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555'
    },
    selectedText: {
        color: '#fff'
    },
    selectedDate: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15
    },
    cinemaContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3
    },
    cinemaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cinemaName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e74c3c'
    },
    showtimeContainer: {
        marginTop: 10,
        marginBottom: 10
    },
    format: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#f39c12'
    },
    timeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    timeButton: {
        backgroundColor: '#ecf0f1',
        padding: 8,
        marginRight: 8,
        marginBottom: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#bdc3c7'
    },
    timeText: {
        color: '#2c3e50',
        fontWeight: '600'
    },
    noShowtime: {
        fontSize: 14,
        color: '#7f8c8d',
        fontStyle: 'italic'
    }
});

export default Playtime;

