import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image, TouchableOpacity, Dimensions, TextInput, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'; // Chú ý thay đổi ở đây

const Checkout = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const sheetRef = useRef(null);

  const handleCardSelect = (cardType) => {
    setSelectedCard(prevCard => (prevCard === cardType ? null : cardType));
  };

  const handleSaveCardDetails = () => {
    sheetRef.current.close();
    setIsBottomSheetOpen(false);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardHolderName('');
  };

  const renderBottomSheetContent = () => (
    <View style={styles.bottomSheetContainer}>
      <View style={styles.handleIndicator} />
      <Text style={styles.bottomSheetTitle}>Add New Card</Text>
      <Text style={styles.bottomSheetSubtitle}>Add your card details here</Text>

      <Text style={styles.inputLabel}>Card Number</Text>
      <TextInput
        style={styles.input}
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
        placeholder="**** **** **** ****"
      />

      <Text style={styles.inputLabel}>Card Holder Name</Text>
      <TextInput
        style={styles.input}
        value={cardHolderName}
        onChangeText={setCardHolderName}
        placeholder="Card Holder Name"
      />

      <View style={styles.rowInputs}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.inputHalf}
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder="MM/YY"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.halfInputContainer}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            style={styles.inputHalf}
            value={cvv}
            onChangeText={setCvv}
            placeholder="•••"
            secureTextEntry
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.addCardButton} onPress={handleSaveCardDetails}>
        <Text style={styles.addCardButtonText}>Add Card</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBackdrop = props => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5} // Độ mờ của nền sau
    />
  );

  const itemTotal = 310.70;
  const discount = 5.00;
  const grandTotal = itemTotal - discount;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Image
            source={require('../Img/vectorphai.png')}
            style={styles.arrow}
          />
          <Text style={styles.headerText}>Checkout</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Image
            source={require('../Img/anhspidermen.png')}
            style={styles.movieImage}
          />
          <View style={styles.textDetails}>
            <Text style={styles.title}>Spider Man</Text>
            <Text style={styles.subtitle}>Hollywood Movie</Text>
            <Text style={styles.language}>Language: English, Hindi</Text>
          </View>
        </View>

        <View>
          <Text style={styles.styletextpayment}>Payment Method</Text>
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
            onPress={() => {
              sheetRef.current.expand();
              setIsBottomSheetOpen(true);
            }}
          >
            <Text style={styles.addNewCardText}>+ Add New Card</Text>
          </TouchableOpacity>
        )}

        {/* PayPal Section */}
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
            onPress={() => {
              sheetRef.current.expand();
              setIsBottomSheetOpen(true);
            }}
          >
            <Text style={styles.addNewCardText}>+ Add New PayPal</Text>
          </TouchableOpacity>
        )}

        {/* Summary Section */}
        <View style={styles.summaryContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Item Total</Text>
            <Text style={styles.value}>${itemTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discount</Text>
            <Text style={styles.value}>${discount.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelBold}>Grand Total</Text>
            <Text style={styles.valueBold}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.payNowButton}>
          <Text style={styles.payNowButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={['60%']}
        backdropComponent={renderBackdrop} // Làm mờ nền phía sau
        onChange={(index) => {
          if (index === -1) {
            setIsBottomSheetOpen(false);
          }
        }}
        backgroundStyle={styles.bottomSheetBackground}
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
  input: {
    height: 50,
    borderColor: '#FF515A',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%', // Full width for input fields
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    flex: 1,
  },
  inputHalf: {
    height: 50,
    borderColor: '#FF515A',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '95%', // Adjusting width to fit two fields side by side
  },
  checked: {
    backgroundColor: '#f48fb1',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    padding: 20,
    height: '100%', // Full height for the BottomSheet
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addCardButton: {
    backgroundColor: '#FF515A',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  addCardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSheetBackground: {
    backgroundColor: '#f8f9fa',
  },
  summaryContainer: {
    marginBottom: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  labelBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  valueBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  payNowButton: {
    backgroundColor: '#FF515A',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payNowButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Checkout;
