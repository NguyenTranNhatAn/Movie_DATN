import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import API_BASE_URL from '../config'; // make sure this is the correct path to your config
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Category = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const [tickets, setTickets] = useState([]);
  const sheetRef = useRef(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalReason, setAdditionalReason] = useState('');
  const [userId, setUserId] = useState(null); // State for userID
  const [token, setToken] = useState(null); // State for token

  const loadUserData = async () => {
    try {
      // Lấy token từ AsyncStorage
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);

      if (storedToken) {
        // Gọi API để lấy userId từ token
        const response = await fetch(`https://be-movie-sooty.vercel.app/api/user-info`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        const data = await response.json();
        console.log(data)
        // Giả sử `userId` có trong `data.userId`
        setUserId(data._id);
        console.log("UserID:", data.userId); // In ra userId để kiểm tra
      } else {
        Alert.alert("Error", "Không tìm thấy token, vui lòng đăng nhập lại.");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      Alert.alert("Error", "Không thể lấy thông tin người dùng.");
    }
  };
  useEffect(() => {
    loadUserData();
  }, []);
  // Fetch tickets based on selectedTab
  useEffect(() => {
    const fetchTickets = async () => {
      // const userId = 'RE123'; // Replace with dynamic userId if needed
      const url = `${API_BASE_URL}/ticket/${selectedTab.toLowerCase()}/${userId}`;

      try {
        const response = await fetch(url);
        const result = await response.json();
        // Log each ticket's ticketId
        result.data.forEach(ticket => {
          console.log(ticket.ticketId); // Đây là nơi bạn lấy được ticketId
        });
        if (result.error === 0) {
          setTickets(result.data);
        } else {
          console.error("Error fetching tickets:", result.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchTickets();
  }, [selectedTab]);

  const renderTickets = () => {
    return tickets.map((ticket, index) => (
      <View key={ index } style={ styles.ticketWrapper }>
        <View style={ styles.ticketContainer }>
          <Image source={ { uri: ticket.movieImage } } style={ styles.image } />
          <View style={ styles.ticketInfo }>
            <Text style={ styles.title }>{ ticket.movieName }</Text>
            <Text style={ styles.subtitle }>{ ticket.cinemaName }</Text>
            <Text style={ styles.subtitle }>Room: { ticket.roomName }</Text>
            <Text style={ styles.subtitle }>Show Date: { new Date(ticket.showDate).toLocaleDateString() }</Text>
            <Text style={ styles.subtitle }>Price: { ticket.totalPrice }₫</Text>
          </View>
          <View style={ styles.statusContainer }>
            <Text style={ styles.statusText }>{ ticket.status }</Text>
          </View>
        </View>

        <View style={ styles.ticketActions }>
          { selectedTab === 'Upcoming' && (
            <TouchableOpacity
              style={ styles.viewButton }
              onPress={ () => {
                setIsSheetOpen(true);
                sheetRef.current.expand();
              } }
            >
              <Text style={ styles.buttonText }>Cancel Booking</Text>
            </TouchableOpacity>
          ) }
          <TouchableOpacity
            style={ selectedTab === 'Past' ? styles.reviewButton : styles.cancelButton }
            onPress={ () => navigation.navigate('TicketDetails', { ticketId: ticket.ticketId }) } // Truyền ticketId

          >
            <Text style={ selectedTab === 'Past' ? styles.buttonText1 : styles.cancelButtonText }>
              { selectedTab === 'Past' ? 'Write a Review' : 'View Details' }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  const renderBottomSheetContent = () => (
    <View style={ styles.bottomSheet }>
      <Text style={ styles.sheetTitle }>Cancel Booking</Text>
      <Text style={ styles.sheetSubtitle }>Please select the reason for cancellation</Text>

      {/* Cancellation reasons */ }
      { ["I have better deal", "Some other work, can’t come", "I want to book another movie",
        "Location is too far from my location", "Another reason"].map((reason) => (
          <TouchableOpacity key={ reason } style={ styles.radioContainer } onPress={ () => setSelectedReason(reason) }>
            <View style={ [styles.radioButton, selectedReason === reason && styles.radioButtonSelected] }>
              { selectedReason === reason && <View style={ styles.radioInner } /> }
            </View>
            <Text style={ styles.radioText }>{ reason }</Text>
          </TouchableOpacity>
        )) }

      {/* Additional input for "Another reason" */ }
      { selectedReason === 'Another reason' && (
        <TextInput
          style={ styles.input }
          placeholder="Tell us reason"
          value={ additionalReason }
          onChangeText={ setAdditionalReason }
        />
      ) }

      {/* Submit button */ }
      <TouchableOpacity style={ styles.submitButton } onPress={ () => sheetRef.current?.close() }>
        <Text style={ styles.submitText }>Submit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBackdrop = (props) => (
    <BottomSheetBackdrop { ...props } opacity={ 0.5 } disappearsOnIndex={ -1 } appearsOnIndex={ 0 } />
  );

  return (
    <SafeAreaView style={ styles.container }>
      <Text style={ styles.headerText }>My Tickets</Text>

      <View style={ styles.tabContainer }>
        { ["Upcoming", "Past", "Cancelled"].map((tab) => (
          <TouchableOpacity
            key={ tab }
            style={ [styles.tabButton, selectedTab === tab && styles.activeTab] }
            onPress={ () => setSelectedTab(tab) }
          >
            <Text style={ [styles.tabText, selectedTab === tab && styles.activeTabText] }>{ tab }</Text>
          </TouchableOpacity>
        )) }
      </View>

      <ScrollView>{ renderTickets() }</ScrollView>

      {/* Bottom Sheet */ }
      <BottomSheet
        ref={ sheetRef }
        snapPoints={ ['60%'] }
        index={ -1 }
        onClose={ () => setIsSheetOpen(false) }
        backdropComponent={ renderBackdrop }
      >
        { renderBottomSheetContent() }
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    paddingVertical: 5,
    marginHorizontal: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#f1f1f1',
  },
  activeTab: {
    backgroundColor: '#ff3366',
  },
  tabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  ticketWrapper: {
    marginBottom: 15,
  },
  ticketContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  ticketActions: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    padding: 10,
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  ticketInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  viewButton: {
    backgroundColor: '#fff',
    borderColor: '#A9A2A3',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#ff3366',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  reviewButton: {
    backgroundColor: '#ff3366',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 20,
    height: '100%',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sheetSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: '#ff3366',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff3366',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginVertical: 20,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#ff3366',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#000000',
    textAlign: 'center',
  },
  buttonText1: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default Category;
