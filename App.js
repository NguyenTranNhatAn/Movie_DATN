import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScreensLogin from "./screens/ScreensLogin";
import SignupScreen from "./screens/SignupScreen";
import VerificationDialog from "./screens/test";
import { createStackNavigator } from "@react-navigation/stack";


const Stack = createStackNavigator();

export default function App() {
  return (
   
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={ScreensLogin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
