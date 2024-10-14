import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Text, View, ScrollView } from 'react-native';
import HomeScreen from './src/screens/Tabs/HomeScreen';
import SeatSelection from './src/screens/Stack/Test';
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/routers/Router';
import AnimTab3 from './src/screens/BottomTab';

function App(): React.JSX.Element {

  return (



    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar

        barStyle={'dark-content'}
        backgroundColor="rgba(255, 255, 255, 1)"
      />
     {/* <NavigationContainer>
      <Router/>
     </NavigationContainer> */}
     <AnimTab3/>



    </SafeAreaView>



  );
}


export default App;
