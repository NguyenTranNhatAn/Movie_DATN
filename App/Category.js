import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';

const Category = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming');

  // Dummy data for tickets in different categories
  const upcomingTickets = [
    { title: 'Fast & Furious 7', language: 'English, Hindi', status: 'Paid' },
    { title: 'Spider Man', language: 'English, Hindi', status: 'Paid' },
    { title: 'Sultan', language: 'Hindi', status: 'Paid' },
  ];

  const pastTickets = [
    { title: 'Inception', language: 'English', status: 'Viewed' },
    { title: 'The Dark Knight', language: 'English', status: 'Viewed' },
  ];

  const cancelledTickets = [
    { title: 'Titanic', language: 'English', status: 'Cancelled' },
    { title: 'Avatar', language: 'English', status: 'Cancelled' },
  ];

  // Function to render tickets based on the selected tab
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
      <View key={index} style={styles.ticketContainer}>
        <Image source={require('../Img/anhspidermen.png')} style={styles.image} />
        <View style={styles.ticketInfo}>
          <Text style={styles.title}>{ticket.title}</Text>
          <Text style={styles.subtitle}>Bollywood Movie</Text>
          <Text style={styles.subtitle}>Language: {ticket.language}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{ticket.status}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View Ticket</Text>
          </TouchableOpacity>
          {selectedTab === 'Upcoming' && (
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel Booking</Text>
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
      <ScrollView>
        {renderTickets()}
      </ScrollView>
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
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#ccc',
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
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  ticketInfo: {
    flex: 1,
    justifyContent: 'center',
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Category;
