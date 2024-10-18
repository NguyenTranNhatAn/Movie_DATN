/*
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import SeatBookingScreen from './src/screens/SeatBookingScreen';

function App(): React.JSX.Element {

  return (

    <SeatBookingScreen />
    // <View>

    //   <Icon name="couch" size={ 50 } color="#900" />
    //   <Icon1 name="sofa-single-outline" size={ 50 } color="#900" />
    //   <Icon1 name="sofa-single" size={ 50 } color="#900" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    color: 'black'

  }
});

export default App;
*/


import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomTabBar from './src/CustomTabBar';
import Animated from 'react-native-reanimated';
import Animated1 from './src/Animated1';
import SeatBookingScreen from './src/screens/SeatBookingScreen';
import QRCodeScanner from './src/screens/QRCodeScanner';
import QRCodeAnimation from './src/screens/QRCodeAnimation';
import QRCodeScreen1 from './src/screens/TicketDemo';
import TicketScreen from './src/screens/TicketScreen';
import { createStackNavigator } from '@react-navigation/stack';//chuyển man hình
import TicketScreenDemo from './src/screens/TicketDemo';
import NotificationScreen from './src/screens/NotificationScreen';
import TermsScreen from './src/screens/TermsScreen';
import PolicyScreen from './src/screens/PolicyScreen';
import Profile from './src/screens/Profile';
import EditProfile from './src/screens/EditProfile';
import SeatDemo from './src/screens/SeatDemo';

// Tạo các màn hình đơn giản
function HomeScreen() {
  return (
    <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
      <Text>Home Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
      <Text>Settings Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
      <Text>Profile Screen</Text>
    </View>
  );
}

// Khởi tạo Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();//chuyển màn hình
function MyTabs() {
  return (
    /*
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // Trả về icon tương ứng từ react-native-vector-icons
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >

      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
    */
    <Tab.Navigator tabBar={ (props) => <CustomTabBar { ...props } /> }>
      <Tab.Screen name="Home" component={ HomeScreen } />
      <Tab.Screen name="Settings" component={ SettingsScreen } />
      <Tab.Screen name="Profile" component={ ProfileScreen } />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    // <NavigationContainer>
    //   <MyTabs />
    // </NavigationContainer>
    // <Animated1 width={ 123 }/>
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="SeatBooking" component={ SeatBookingScreen } />
    //     <Stack.Screen name="Ticket" component={ TicketScreen } />
    //   </Stack.Navigator>
    // </NavigationContainer>

    // <SeatBookingScreen navigation={ undefined } route={ undefined } />
    // <SeatDemo />
    //<QRCodeScanner />
    //<QRCodeAnimation />
    // <QRCodeScreen1 />
    // <TicketScreen />
    // <TicketScreenDemo navigation={ undefined } />
    // <NotificationScreen navigation={ undefined } />
    // <TermsScreen />
    // <PolicyScreen/>
    // <Profile />
    // <EditProfile />
  );
}










