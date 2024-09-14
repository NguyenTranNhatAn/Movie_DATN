import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';  // Ensure you have installed vector-icons

const Category = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const [showReviewModal, setShowReviewModal] = useState(false); // State to control modal visibility
  const [selectedTicket, setSelectedTicket] = useState(null); // State to keep track of selected ticket for review
  const [rating, setRating] = useState(0); // State to handle the rating

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
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setSelectedTicket(ticket); // Set the selected ticket
                setShowReviewModal(true); // Show the modal
              }}
            >
              <Text style={styles.buttonText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ));
  };

  // Render Modal for Review
  const renderReviewModal = () => {
    return (
      <Modal
        transparent={true}
        visible={showReviewModal}
        animationType="slide"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Leave a Review</Text>
            <Text style={styles.modalSubtitle}>Please share your valuable review</Text>

            {/* Selected Ticket Information */}
            {selectedTicket && (
              <View style={styles.selectedTicket}>
                <Image source={require('../Img/anhspidermen.png')} style={styles.image} />
                <View style={styles.ticketInfo}>
                  <Text style={styles.title}>{selectedTicket.title}</Text>
                  <Text style={styles.subtitle}>Bollywood Movie</Text>
                  <Text style={styles.subtitle}>Language: {selectedTicket.language}</Text>
                </View>
              </View>
            )}

            {/* Rating Section */}
            <Text style={styles.modalSubtitle}>Please give your rating with us</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Icon
                    name={star <= rating ? 'star' : 'star-o'}
                    size={30}
                    color={star <= rating ? '#ff3366' : '#ccc'}
                    style={styles.star}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Comment Section */}
            <TextInput
              style={styles.input}
              placeholder="Add a Comment"
              placeholderTextColor="#aaa"
              multiline={true}
            />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButtonModal} onPress={() => setShowReviewModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
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

      {/* Review Modal */}
      {renderReviewModal()}
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  selectedTicket: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  star: {
    marginHorizontal: 5,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButtonModal: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#ff3366',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Category;
