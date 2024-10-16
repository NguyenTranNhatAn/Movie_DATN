
import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Latest from './src/screens/Latest'
import Favour from './src/screens/Favour'
import Search from './src/screens/Search';
import Profile from './src/screens/Profile';
import Detail from './src/screens/Detail';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();
  return (
  <Provider store ={store}>
    <NavigationContainer>

      <Stack.Navigator initialRouteName='search'>
     
      <Stack.Screen name="latest" component={Latest} options={{ headerShown: false }} />
      <Stack.Screen name="favour" component={Favour} options={{ headerShown: false }} />
       <Stack.Screen name="search" component={Search} options={{ headerShown: false }} />
       <Stack.Screen name="profile" component={Profile} options={{ headerShown: false }} />
       <Stack.Screen name="detail" component={Detail} options={{ headerShown: false }} />
      
      </Stack.Navigator>

    </NavigationContainer>
    </Provider>
  );
}


export default App;
