import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';

const Category = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming');

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
      <View>
        <View key={index} style={styles.ticketContainer}>
        <Image source={require('../Img/anhspidermen.png')} style={styles.image} />
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
  <TouchableOpacity style={styles.viewButton}>
    <Text style={styles.buttonText}>View Details</Text>
  </TouchableOpacity>
  {selectedTab === 'Upcoming' && (
    <TouchableOpacity style={styles.cancelButton}>
      <Text style={styles.cancelButtonText}>Cancel Booking</Text>
    </TouchableOpacity>
  )}
  {selectedTab === 'Past' && (
    <TouchableOpacity style={styles.reviewButton}>
      <Text style={styles.buttonText}>Write a Review</Text>
    </TouchableOpacity>
  )}
</View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.headerText}>My Tickets</Text>

      {/* Tab Navigation */}
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

      {/* Ticket List */}
      <ScrollView>{renderTickets()}</ScrollView>
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
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff3366',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFF',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row', // Đặt các nút thành hàng ngang
    justifyContent: 'space-between', // Tạo khoảng cách giữa các nút
    paddingTop: 10, // Khoảng cách bên trên giữa các nút và nội dung khác
  },
  viewButton: {
    backgroundColor: '#fff', // Màu nền trắng
    borderColor: '#ff3366', // Viền màu hồng
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1, // Để các nút cùng kích thước
    marginRight: 10, // Khoảng cách giữa hai nút
  },
  cancelButton: {
    backgroundColor: '#ff3366', // Màu nền hồng cho nút Cancel
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  reviewButton: {
    backgroundColor: '#ff3366', // Màu nền hồng cho nút Review
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText1: {
    color: '#ff3366', // Màu chữ hồng cho nút View Details
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
});

export default Category;
