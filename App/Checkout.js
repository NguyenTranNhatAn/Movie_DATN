import React, { useState, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image, TouchableOpacity, Dimensions, TextInput, Button, Modal } from 'react-native';

const Checkout = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false); // Trạng thái để điều khiển modal
  const [marginStart, setMarginStart] = useState(0);

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  const { width } = Dimensions.get('window');

  useLayoutEffect(() => {
    setMarginStart(width * 0.5);
  }, [width]);

  const handleCardSelect = (cardType) => {
    setSelectedCard(prevCard => prevCard === cardType ? null : cardType);
    setShowAddCardModal(false); // Ẩn modal khi chọn thẻ khác
  };
  const FloatingLabelInput = ({ label, value, onChangeText, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
  
    return (
      <View style={styles.inputContainer}>
        <Text style={[styles.floatingLabel, isFocused || value ? styles.floatingLabelFocused : {}]}>
          {label}
        </Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
    );
  };

  const handleAddNewCard = () => {
    setShowAddCardModal(true); // Hiển thị modal khi nhấn vào "Add New Card"
  };

  const handleSaveCardDetails = () => {
    // Xử lý lưu thông tin thẻ ở đây
    console.log('Card Number:', cardNumber);
    console.log('Expiry Date:', expiryDate);
    console.log('CVV:', cvv);
    console.log('Card Holder Name:', cardHolderName);

    // Sau khi lưu thông tin, có thể ẩn modal và làm sạch các trường
    setShowAddCardModal(false);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardHolderName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../Img/vectorphai.png')} // Đảm bảo đường dẫn chính xác
          style={styles.arrow}
        />
        <Text style={styles.headerText}>Checkout</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Image
          source={require('../Img/anhspidermen.png')} // Đảm bảo đường dẫn chính xác
          style={styles.movieImage}
        />
        <View style={styles.textDetails}>
          <Text style={styles.title}>Spiderman</Text>
          <Text style={styles.subtitle}>Hollywood Movie</Text>
          <Text style={styles.language}>Language: English, Hindi</Text>
        </View>
      </View>
      <View>
        <Text style={styles.styletextpayment}>Payment method</Text>
      </View>
      <View style={styles.paymentContainer}>
        <Image source={require('../Img/mastercard.png')} />
        <View style={styles.stylemaster}>
          <Text>Master Card</Text>
          <Text>5689 4700 2589 9658</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleCardSelect('MasterCard')}
          style={styles.checkboxContainer}
        >
          <View style={[styles.customCheckbox, selectedCard === 'MasterCard' && styles.checked]}>
            {selectedCard === 'MasterCard' && <View style={styles.checkmark} />}
          </View>
        </TouchableOpacity>
      </View>
      {selectedCard === 'MasterCard' && (
        <TouchableOpacity
          style={styles.addNewCardContainer}
          onPress={handleAddNewCard}
        >
          <Text style={styles.addNewCardText}>+ Add New Card</Text>
        </TouchableOpacity>
      )}
      <View style={styles.paymentContainer}>
        <Image source={require('../Img/paypal.png')} />
        <View style={styles.stylemaster1}>
          <Text>PayPal</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleCardSelect('PayPal')}
          style={styles.checkboxContainer}
        >
          <View style={[styles.customCheckbox1, selectedCard === 'PayPal' && styles.checked]}>
            {selectedCard === 'PayPal' && <View style={styles.checkmark} />}
          </View>
        </TouchableOpacity>
      </View>
      {selectedCard === 'PayPal' && (
        <TouchableOpacity
          style={styles.addNewCardContainer}
          onPress={handleAddNewCard}
        >
          <Text style={styles.addNewCardText}>+ Add New Card</Text>
        </TouchableOpacity>
      )}
      <View>
        <Image style={styles.stylegachchan} source={require('../Img/gachchan.png')} />
      </View>
      <View style={styles.containerstyletotal}>
        <Text style={styles.styleitemtotal}>Item Total</Text>
        <Text style={[styles.styleitemtotal, { marginStart: marginStart }]}>$310.70</Text>
      </View>
      <View style={styles.containerstyletotal}>
        <Text style={styles.styleitemtotal}>Discount</Text>
        <Text style={[styles.styleitemtotal, { marginStart: marginStart }]}>$5.00</Text>
      </View>
      <View>
        <Image style={styles.stylegachchan} source={require('../Img/gachchan.png')} />
      </View>
      <View style={styles.containerstyletotal1}>
        <Text style={styles.styleitemtotal1}>Grand Total</Text>
        <Text style={[styles.styleitemtotal1, { marginStart: marginStart }]}>$310.70</Text>
      </View>
      <TouchableOpacity style={styles.payNowButton}>
        <Text style={styles.payNowText}>Pay Now</Text>
      </TouchableOpacity>

      {/* Modal để nhập thông tin thẻ */}
      <Modal
        transparent={true}
        visible={showAddCardModal}
        onRequestClose={() => setShowAddCardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Add New Card</Text>
            <Text style={styles.subtitle}>Add your card details here</Text>
            
            {/* Card Number */}
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              
            />

            {/* Card Holder Name */}
            <Text style={styles.inputLabel}>Card Holder Name</Text>
            <TextInput
              style={styles.input}
              value={cardHolderName}
              onChangeText={setCardHolderName}
              placeholder=""
            />

            <View style={{ flexDirection: 'row',justifyContent:'space-between' }}>
              {/* Expiry Date */}
              <View style={{ flex:1, marginLeft:40}}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.input1}
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                />
              </View>

              {/* CVV */}
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input1}
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="•••"
                  secureTextEntry
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Add Card Button */}
            <TouchableOpacity style={styles.addCardButton}>
              <Text style={styles.addCardButtonText}>Add Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  arrow: {
    marginRight: -5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    textAlign: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 5,
    backgroundColor: '#fff',
    margin: 10,
  },
  movieImage: {
    marginRight: 20,
  },
  textDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 10,
  },
  language: {
    fontSize: 16,
  },
  styletextpayment: {
    fontSize: 22,
    margin: 11,
    fontWeight: 'bold',
    color: 'black',
  },
  checkmark: {
    width: 14,
    backgroundColor: '#FF515A',
    height: 14,
    margin: 2,
    borderColor: '#FF515A',
    borderWidth: 2,
    borderRadius: 10,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 100,
  },
  customCheckbox1: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 190,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  stylemaster: {
    marginLeft: 20,
  },
  stylemaster1: {
    marginLeft: 25,
  },
  addNewCardText: {
    fontSize: 18,
    color: 'red',
  },
  addNewCardContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 0.5,
    borderColor: 'red',
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 50,
    borderColor: '#FF515A',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width:250
  },
  input1: {
    height: 50,
    borderColor: '#FF515A',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width:100
  },
  checked: {
    backgroundColor: '#f48fb1',
  },
  stylegachchan: {
    marginTop: 20,
    width: 380,
  },
  containerstyletotal: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  containerstyletotal1: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  styleitemtotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  styleitemtotal1: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  payNowButton: {
    backgroundColor: '#FF515A', // Màu nền hồng
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20, // Khoảng cách từ phần tử trước
  },
  payNowText: {
    color: '#fff', // Màu chữ trắng
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền tối cho modal
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  addCardButton: {
    backgroundColor: '#FF515A', 
    paddingVertical: 15,       
    paddingHorizontal: 60,      
    borderRadius: 20,           
    alignItems: 'center',      
    justifyContent: 'center',   
    marginTop: 20,              
  },
  addCardButtonText: {
    color: '#fff',              
    fontSize: 16,               
    fontWeight: 'bold',         
  },
});

export default Checkout;
