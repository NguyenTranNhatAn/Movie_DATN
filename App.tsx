import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SafeAreaView } from "react-native-safe-area-context";
import LoginScreen from "./src/screens/LoginScreens.js";
import SignupScreen from "./src/screens/SignupScreen";
import Onboarding from "./src/screens/OnboardingScreems.js";
import HomeScreens from "./src/screens/HomeScreens.js";
import SplashScreen from "./src/screens/SplashScreens.js";





function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();
  return (
 
    <NavigationContainer>
    <Stack.Navigator initialRouteName="SplashScreen">
    <Stack.Screen name="SplashScreen" component={SplashScreen}  options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen}  options={{ headerShown: false }} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="HomeScreens" component={HomeScreens} options={{ headerShown: false }}/>

    </Stack.Navigator>
  </NavigationContainer>
 
  );
}


export default App;
