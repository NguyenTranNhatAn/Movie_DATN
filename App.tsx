import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Text, View, ScrollView } from 'react-native';
import HomeScreen from './src/screens/Stack/HomeScreen';

function App(): React.JSX.Element {

  return (


   
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar

          barStyle={'dark-content'}
          backgroundColor="rgba(255, 255, 255, 1)"
        />
        <HomeScreen />


      
      </SafeAreaView>



  );
}


export default App;
