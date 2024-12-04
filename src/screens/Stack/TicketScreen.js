import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../../theme/theme';
import LinearGradient from 'react-native-linear-gradient';

const TicketScreen = ({ route, navigation }) => {
  // const { ticketId } = route.params;
  const { ticketId } = route.params;
  console.log(ticketId)
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    fetch(`https://be-movie-sooty.vercel.app/ticket/${ticketId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setTicketData(data.data);
        } else {
          console.error('Error fetching ticket:', data.message);
        }
      })
      .catch((error) => console.error('Fetch error:', error));
  }, [ticketId]);

  const formatShowDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('vi-VN', options);

    // Split the formatted date into weekday and date parts
    const [weekday, datePart] = formattedDate.split(', ');
    return { weekday, datePart };
  };


  return (
    <View style={ styles.container }>
      <StatusBar hidden />
      <View style={ styles.appHeaderContainer }>
        <AppHeader
          name="close"
          header="My Tickets"
          action={ () => navigation.goBack() }
        />
      </View>
      { ticketData && (
        <View style={ styles.ticketContainer }>
          <ImageBackground
            source={ { uri: ticketData.movieImage || 'https://i.ytimg.com/vi/jBpUvgVFuXE/hqdefault.jpg' } }
            style={ styles.ticketBGImage }>
            <LinearGradient
              colors={ [COLORS.OrangeRGBA0, COLORS.Orange] }
              style={ styles.linearGradient }>
              <View style={ [styles.blackCircle, { position: 'absolute', bottom: -40, left: -40 }] } />
              <View style={ [styles.blackCircle, { position: 'absolute', bottom: -40, right: -40 }] } />
            </LinearGradient>
          </ImageBackground>
          <View style={ styles.linear } />

          <View style={ styles.ticketFooter }>
            <View style={ [styles.blackCircle, { position: 'absolute', top: -40, left: -40 }] } />
            <View style={ [styles.blackCircle, { position: 'absolute', top: -40, right: -40 }] } />

            {/* Dữ liệu hiển thị */ }
            <View style={ styles.ticketDateContainer }>
              <View style={ styles.ticketDateContainer }>
                { ticketData && (
                  <>
                    <Text style={ styles.dateTitle }>{ formatShowDate(ticketData.showDate).weekday }</Text>
                    <Text style={ styles.dateTitle }>{ formatShowDate(ticketData.showDate).datePart }</Text>
                  </>
                ) }
              </View>

              <Text style={ styles.subtitle }>Cinema: { ticketData.cinemaName }</Text>
              <Text style={ styles.subtitle }>Room: { ticketData.roomName }</Text>
            </View>
            <View style={ styles.ticketSeatContainer }>
              <Text style={ styles.subtitle }>Seats: { ticketData.seatsDetails.map(seat => seat.seatName).join(', ') }</Text>
              <Text style={ styles.subtitle }>Total Price: { ticketData.totalPrice }₫</Text>
            </View>
            <Image
              source={ {
                uri: ticketData.qrCode ? ticketData.qrCode : 'https://example.com/default-image.png',
              } }
              style={ styles.barcodeImage }
            />
          </View>
        </View>
      ) }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: 0,
  },
  ticketContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ticketBGImage: {
    alignSelf: 'center',
    width: 300,
    aspectRatio: 200 / 300,
    borderTopLeftRadius: BORDERRADIUS.radius_25,
    borderTopRightRadius: BORDERRADIUS.radius_25,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  linearGradient: {
    height: '70%',
  },
  linear: {
    borderTopColor: COLORS.Black,
    borderTopWidth: 3,
    width: 300,
    alignSelf: 'center',
    backgroundColor: COLORS.Orange,
    borderStyle: 'dashed',
  },
  ticketFooter: {
    backgroundColor: COLORS.Orange,
    width: 300,
    alignItems: 'center',
    paddingBottom: SPACING.space_36,
    alignSelf: 'center',
    borderBottomLeftRadius: BORDERRADIUS.radius_25,
    borderBottomRightRadius: BORDERRADIUS.radius_25,
  },
  ticketDateContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: SPACING.space_10,
  },
  ticketSeatContainer: {
    alignItems: 'center',
    marginVertical: SPACING.space_10,
  },
  dateTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  subtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  barcodeImage: {
    height: 100,
    width: 100,
    marginTop: SPACING.space_10,
  },
  blackCircle: {
    height: 80,
    width: 80,
    borderRadius: 80,
    backgroundColor: COLORS.Black,
  },
});

export default TicketScreen;


// import React, { useState, useEffect } from 'react';
// import {
//   Text,
//   View,
//   StyleSheet,
//   StatusBar,
//   ImageBackground,
//   Image,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import AppHeader from '../../components/AppHeader';
// import {
//   BORDERRADIUS,
//   COLORS,
//   FONTFAMILY,
//   FONTSIZE,
//   SPACING,
// } from '../../theme/theme';
// import LinearGradient from 'react-native-linear-gradient';

// const TicketScreen = ({ route, navigation }) => {
//   const ticketId = '6734578118b5df1cd0970d2f';
//   const [ticketData, setTicketData] = useState(null);
//   const [tickets, setTickets] = useState([]);
//   /*
//   useEffect(() => {
//     fetch(`https://be-movie-sooty.vercel.app/ticket/${ticketId}`)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.error === 0) {
//           setTicketData(data.data);
//         } else {
//           console.error('Error fetching ticket:', data.message);
//         }
//       })
//       .catch((error) => console.error('Fetch error:', error));
//   }, [ticketId]);
// */
//   useEffect(() => {
//     fetch(`https://be-movie-sooty.vercel.app/ticket/all/RE123`)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.error === 0) {
//           setTickets(data.data); // Save all ticket data to the state
//         } else {
//           console.error('Error fetching tickets:', data.message);
//         }
//       })
//       .catch((error) => console.error('Fetch error:', error));
//   }, []);
//   const formatShowDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//     const formattedDate = date.toLocaleDateString('vi-VN', options);

//     const [weekday, datePart] = formattedDate.split(', ');
//     return { weekday, datePart };
//   };

//   return (
//     <View style={ styles.container }>
//       <StatusBar hidden />
//       <View style={ styles.appHeaderContainer }>
//         <AppHeader
//           name="close"
//           header="My Tickets"
//           action={ () => navigation.goBack() }
//         />
//       </View>
//       <ScrollView horizontal pagingEnabled style={styles.scrollView}>
//         {tickets.map((ticket) => (
//           <View key={ticket.ticketId} style={styles.ticketContainer}>
//             <ImageBackground
//               source={{ uri: ticket.movieImage || 'https://i.ytimg.com/vi/jBpUvgVFuXE/hqdefault.jpg' }}
//               style={styles.ticketBGImage}>
//               <LinearGradient
//                 colors={[COLORS.OrangeRGBA0, COLORS.Orange]}
//                 style={styles.linearGradient}>
//                 <View style={[styles.blackCircle, { position: 'absolute', bottom: -40, left: -40 }]} />
//                 <View style={[styles.blackCircle, { position: 'absolute', bottom: -40, right: -40 }]} />
//               </LinearGradient>
//             </ImageBackground>
//             <View style={styles.linear} />
//             <View style={styles.ticketFooter}>
//               <View style={[styles.blackCircle, { position: 'absolute', top: -40, left: -40 }]} />
//               <View style={[styles.blackCircle, { position: 'absolute', top: -40, right: -40 }]} />
//               <View style={styles.ticketDateContainer}>
//                 <Text style={styles.dateTitle}>{formatShowDate(ticket.showDate).weekday}</Text>
//                 <Text style={styles.dateTitle}>{formatShowDate(ticket.showDate).datePart}</Text>
//                 <Text style={styles.subtitle}>Cinema: {ticket.cinemaName}</Text>
//                 <Text style={styles.subtitle}>Room: {ticket.roomName}</Text>
//               </View>
//               <View style={styles.ticketSeatContainer}>
//                 <Text style={styles.subtitle}>Seats: {ticket.seatDetails.join(', ')}</Text>
//                 <Text style={styles.subtitle}>Total Price: {ticket.totalPrice}₫</Text>
//               </View>
//               <Image
//                 source={{
//                   uri: ticket.qrCode ? ticket.qrCode : 'https://example.com/default-image.png',
//                 }}
//                 style={styles.barcodeImage}
//               />
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.Black,
//   },
//   appHeaderContainer: {
//     marginHorizontal: SPACING.space_36,
//     marginTop: 0,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   ticketContainer: {
//     width, // Use screen width for each ticket to enable horizontal paging
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   ticketBGImage: {
//     width: 300,
//     aspectRatio: 200 / 300,
//     borderTopLeftRadius: BORDERRADIUS.radius_25,
//     borderTopRightRadius: BORDERRADIUS.radius_25,
//     overflow: 'hidden',
//     justifyContent: 'flex-end',
//   },
//   linearGradient: {
//     height: '70%',
//   },
//   linear: {
//     borderTopColor: COLORS.Black,
//     borderTopWidth: 3,
//     width: 300,
//     backgroundColor: COLORS.Orange,
//     alignSelf: 'center',
//     borderStyle: 'dashed',
//   },
//   ticketFooter: {
//     backgroundColor: COLORS.Orange,
//     width: 300,
//     alignItems: 'center',
//     paddingBottom: SPACING.space_36,
//     borderBottomLeftRadius: BORDERRADIUS.radius_25,
//     borderBottomRightRadius: BORDERRADIUS.radius_25,
//   },
//   ticketDateContainer: {
//     alignItems: 'center',
//     marginVertical: SPACING.space_10,
//   },
//   ticketSeatContainer: {
//     alignItems: 'center',
//     marginVertical: SPACING.space_10,
//   },
//   dateTitle: {
//     fontFamily: FONTFAMILY.poppins_medium,
//     fontSize: FONTSIZE.size_24,
//     color: COLORS.White,
//   },
//   subtitle: {
//     fontFamily: FONTFAMILY.poppins_regular,
//     fontSize: FONTSIZE.size_14,
//     color: COLORS.White,
//   },
//   barcodeImage: {
//     height: 100,
//     width: 100,
//     marginTop: SPACING.space_10,
//   },
//   blackCircle: {
//     height: 80,
//     width: 80,
//     borderRadius: 80,
//     backgroundColor: COLORS.Black,
//   },
// });

// export default TicketScreen;
