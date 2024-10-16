import React from 'react';
import { StyleSheet, useColorScheme, View, SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your components
import Checkout from './App/Checkout'; // Ensure this path is correct
import Category from './App/Category';
import Profile from './App/Profile';
import Editprofile from './App/Editprofile';
import { Provider } from 'react-redux';
import { store } from './App/store/store';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Background style based on the theme
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    flex: 1,
  };

  return (
    <Provider store={store}>
       <SafeAreaView style={backgroundStyle}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="profile">
          <Stack.Screen
            name="Checkout"
            component={Checkout}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="category"
            component={Category}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="profile"
            component={Profile}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="editprofile"
            component={Editprofile}
            options={{ headerShown: false }} 
          />
          
         
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
    </Provider>
   
  );
}

const styles = StyleSheet.create({
  // Define styles here if needed
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
