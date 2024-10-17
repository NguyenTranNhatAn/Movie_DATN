import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const Category = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const sheetRef = useRef(null); // Tham chiếu đến BottomSheet
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Kiểm soát trạng thái BottomSheet
  const [selectedReason, setSelectedReason] = useState(''); // Kiểm soát lý do hủy chọn
  const [additionalReason, setAdditionalReason] = useState(''); // Lưu lý do nhập thêm

  const upcomingTickets = [
    { title: 'Fast & Furious 7', language: 'English, Hindi', status: 'Paid' },
    { title: 'Spider Man', language: 'English, Hindi', status: 'Paid' },
    { title: 'Sultan', language: 'Hindi', status: 'Paid' },
  ];

  const pastTickets = [
    { title: 'Fast & Furious 7', language: 'English, Hindi', status: 'Paid' },
    { title: 'Spider Man', language: 'English, Hindi', status: 'Paid' },
    { title: 'Sultan', language: 'Hindi', status: 'Paid' },
  ];

  const cancelledTickets = [
    { title: 'Sultan', language: 'Hindi', status: 'Paid' },
    { title: 'Fast & Furious 7', language: 'English, Hindi', status: 'Paid' },
    { title: 'Spider Man', language: 'English, Hindi', status: 'Paid' },
  ];

  // Nội dung của BottomSheet
  const renderBottomSheetContent = () => (
    <View style={styles.bottomSheet}>
      <Text style={styles.sheetTitle}>Cancel Booking</Text>
      <Text style={styles.sheetSubtitle}>Please select the reason for cancellation</Text>

      {/* Các lý do hủy */}
      <TouchableOpacity style={styles.radioContainer} onPress={() => setSelectedReason('I have better deal')}>
        <View style={[styles.radioButton, selectedReason === 'I have better deal' && styles.radioButtonSelected]}>
          {selectedReason === 'I have better deal' && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioText}>I have better deal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.radioContainer} onPress={() => setSelectedReason('Some other work, can’t come')}>
        <View style={[styles.radioButton, selectedReason === 'Some other work, can’t come' && styles.radioButtonSelected]}>
          {selectedReason === 'Some other work, can’t come' && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioText}>Some other work, can’t come</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.radioContainer} onPress={() => setSelectedReason('I want to book another movie')}>
        <View style={[styles.radioButton, selectedReason === 'I want to book another movie' && styles.radioButtonSelected]}>
          {selectedReason === 'I want to book another movie' && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioText}>I want to book another movie</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.radioContainer} onPress={() => setSelectedReason('Location is too far from my location')}>
        <View style={[styles.radioButton, selectedReason === 'Location is too far from my location' && styles.radioButtonSelected]}>
          {selectedReason === 'Location is too far from my location' && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioText}>Location is too far from my location</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.radioContainer} onPress={() => setSelectedReason('Another reason')}>
        <View style={[styles.radioButton, selectedReason === 'Another reason' && styles.radioButtonSelected]}>
          {selectedReason === 'Another reason' && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioText}>Another reason</Text>
      </TouchableOpacity>

      {/* Hiển thị hộp nhập lý do nếu chọn "Another reason" */}
      {selectedReason === 'Another reason' && (
        <TextInput
          style={styles.input}
          placeholder="Tell us reason"
          value={additionalReason}
          onChangeText={setAdditionalReason}
        />
      )}

      {/* Nút Submit */}
      <TouchableOpacity style={styles.submitButton} onPress={() => sheetRef.current?.close()}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );

  // Tạo backdrop để nhấn ra ngoài đóng BottomSheet
  const renderBackdrop = (props) => (
    <BottomSheetBackdrop
      {...props}
      opacity={0.5}  // Độ mờ của nền
      disappearsOnIndex={-1}  // Đóng khi nhấn ra ngoài
      appearsOnIndex={0}  // Hiển thị backdrop khi mở BottomSheet
    />
  );

  const renderTickets = () => {
    let ticketsToRender = [];

    if (selectedTab === 'Upcoming') {
      ticketsToRender = upcomingTickets;
    } else if (selectedTab === 'Past') {
      ticketsToRender = pastTickets;
    } else if (selectedTab === 'Cancelled') {
      ticketsToRender = cancelledTickets;
    }

    return ticketsToRender.map((ticket, index) => (
      <View key={index}>
        <View style={styles.ticketContainer}>
          <Image source={require('../../../Img/anhspidermen.png')} style={styles.image} />
          <View style={styles.ticketInfo}>
            <Text style={styles.title}>{ticket.title}</Text>
            <Text style={styles.subtitle}>Bollywood Movie</Text>
            <Text style={styles.subtitle}>Language: {ticket.language}</Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{ticket.status}</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
        {selectedTab === 'Upcoming' && (
            <TouchableOpacity
            style={styles.viewButton}
              onPress={() => {
                setIsSheetOpen(true);  // Mở BottomSheet
                sheetRef.current.expand();  // Mở BottomSheet tại vị trí đầu tiên
              }}
            >
              <Text style={styles.buttonText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}
          {selectedTab === 'Upcoming' && (
            <TouchableOpacity
            style={styles.cancelButton}
              
            >
              <Text style={styles.cancelButtonText}>View Details</Text>
            </TouchableOpacity>
          )}
          {selectedTab === 'Past' && (
            
            <TouchableOpacity  style={styles.viewButton}>
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
            
          )}
          
          {selectedTab === 'Past' && (
            
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.buttonText1}>Write a Review</Text>
            </TouchableOpacity>
            
          )}
          {selectedTab === 'Cancelled' && (
            <TouchableOpacity
            style={styles.viewButton}
              
            >
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          )}
          
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>My Tickets</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Upcoming' && styles.activeTab]}
          onPress={() => setSelectedTab('Upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'Upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Past' && styles.activeTab]}
          onPress={() => setSelectedTab('Past')}
        >
          <Text style={[styles.tabText, selectedTab === 'Past' && styles.activeTabText]}>Past</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Cancelled' && styles.activeTab]}
          onPress={() => setSelectedTab('Cancelled')}
        >
          <Text style={[styles.tabText, selectedTab === 'Cancelled' && styles.activeTabText]}>Cancelled</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>{renderTickets()}</ScrollView>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={sheetRef}
        snapPoints={['60%']} // Đặt các điểm snap
        index={-1} // Ẩn BottomSheet khi khởi động
        onClose={() => setIsSheetOpen(false)}
        backdropComponent={renderBackdrop} // Nền để nhấn ra ngoài đóng BottomSheet
      >
        {renderBottomSheetContent()}
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
  ticketContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom:10,
    marginLeft:10,
    marginRight:10
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
  buttonText:{
    
    color:'#000000',
    textAlign: 'center',
  },
  buttonText1:{
    
    color:'#FFFFFF',
    textAlign: 'center',
  }
});

export default Category;
