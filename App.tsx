import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Text, View, ScrollView } from 'react-native';
import HomeScreen from './src/screens/Tabs/HomeScreen';
import SeatSelection from './src/screens/Stack/Test';
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/routers/Router';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import CinemaSelect from './src/screens/Stack/CinemaSelect';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Playtime from './src/screens/Playtime';
import Component from './src/screens/Component';
import Payment_Screen from './src/screens/Payment_Screen';
import TicketScreen from './src/screens/Stack/TicketScreen';

function App(): React.JSX.Element {
  // Cấu hình linking
  const linking = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        Seat: 'Seat',
        Cinema: 'Cinema',
        home123: 'home123'
      },
    },
  };
  return (



    <Provider store={ store }>
      <SafeAreaView style={ { flex: 1 } }>
        <StatusBar

          barStyle={ 'dark-content' }
          backgroundColor="rgba(255, 255, 255, 1)"
        />
        <NavigationContainer linking={ linking }>
          <Router />
        </NavigationContainer>
        {/* <CinemaSelect navigation={undefined} route={undefined}/> */ }




      </SafeAreaView>
    </Provider>

    //<Playtime />
    //<Component />
    // <Payment_Screen />
    //<TicketScreen route={ undefined } navigation={ undefined } />
  );
}



export default gestureHandlerRootHOC(App);