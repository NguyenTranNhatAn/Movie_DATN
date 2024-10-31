import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Text, View, ScrollView } from 'react-native';
import HomeScreen from './src/screens/Tabs/HomeScreen';
import SeatSelection from './src/screens/Stack/Test';
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/routers/Router';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import CinemaSelect from './src/screens/Stack/CinemaSelect';


function App(): React.JSX.Element {

  return (



   <Provider store={store}>
 <SafeAreaView style={{ flex: 1 }}>
      <StatusBar

        barStyle={'dark-content'}
        backgroundColor="rgba(255, 255, 255, 1)"
      />
     {/* <NavigationContainer>
      <Router/>
     </NavigationContainer> */}
     <CinemaSelect navigation={undefined} route={undefined}/>
     



    </SafeAreaView>
   </Provider>



  );
}


export default App;











