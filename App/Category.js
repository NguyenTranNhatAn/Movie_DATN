import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Modal, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';  // Install react-native-paper if needed

const Category = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false); // State to control modal visibility
  const [selectedTicket, setSelectedTicket] = useState(null); // State to keep track of selected ticket for cancellation
  const [cancelReason, setCancelReason] = useState(''); // State to track selected reason
  const [otherReason, setOtherReason] = useState(''); // State for custom reason

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
                setShowCancelModal(true); // Show the modal
              }}
            >
              <Text style={styles.buttonText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ));
  };

  // Render Modal for Cancel Booking
  const renderCancelModal = () => {
    return (
      <Modal
        transparent={true}
        visible={showCancelModal}
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cancel Booking</Text>
            <Text style={styles.modalSubtitle}>Please select the reason for cancellation</Text>

            {/* Reason for cancellation */}
            <View>
              <TouchableOpacity onPress={() => setCancelReason('I have better deal')}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton
                    value="I have better deal"
                    status={cancelReason === 'I have better deal' ? 'checked' : 'unchecked'}
                    onPress={() => setCancelReason('I have better deal')}
                    color="#ff3366"
                  />
                  <Text style={styles.radioButtonText}>I have better deal</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setCancelReason('Some other work, can’t come')}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton
                    value="Some other work, can’t come"
                    status={cancelReason === 'Some other work, can’t come' ? 'checked' : 'unchecked'}
                    onPress={() => setCancelReason('Some other work, can’t come')}
                    color="#ff3366"
                  />
                  <Text style={styles.radioButtonText}>Some other work, can’t come</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setCancelReason('I want to book another movie')}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton
                    value="I want to book another movie"
                    status={cancelReason === 'I want to book another movie' ? 'checked' : 'unchecked'}
                    onPress={() => setCancelReason('I want to book another movie')}
                    color="#ff3366"
                  />
                  <Text style={styles.radioButtonText}>I want to book another movie</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setCancelReason('location is too far')}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton
                    value="location is too far"
                    status={cancelReason === 'location is too far' ? 'checked' : 'unchecked'}
                    onPress={() => setCancelReason('location is too far')}
                    color="#ff3366"
                  />
                  <Text style={styles.radioButtonText}>Location is too far from my location</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setCancelReason('Other reason')}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton
                    value="Other reason"
                    status={cancelReason === 'Other reason' ? 'checked' : 'unchecked'}
                    onPress={() => setCancelReason('Other reason')}
                    color="#ff3366"
                  />
                  <Text style={styles.radioButtonText}>Another reason</Text>
                </View>
              </TouchableOpacity>

              {cancelReason === 'Other reason' && (
                <TextInput
                  style={styles.input}
                  placeholder="Tell us reason"
                  placeholderTextColor="#aaa"
                  multiline={true}
                  value={otherReason}
                  onChangeText={(text) => setOtherReason(text)}
                />
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                // Handle cancellation here
                console.log(`Cancellation Reason: ${cancelReason}, Other Reason: ${otherReason}`);
                setShowCancelModal(false); // Close modal after submission
              }}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
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

      {/* Cancel Modal */}
      {renderCancelModal()}
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
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
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
    textAlign: 'center',
  },
});

export default Category;
