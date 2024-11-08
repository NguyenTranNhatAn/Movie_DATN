import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
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
import ImageSliderExample from './src/screens/ImageSliderExample';
import MyCarousel from './src/screens/MyCarousel';
import Fb_Demo from './src/screens/Fb_Demo';
import Playtime from './src/screens/Playtime';
import SeatSelectionScreen from './src/screens/SeatSelectionScreen';
import ZoomableView from './src/screens/ZoomableView';
import SeatSelector from './src/screens/SeatSelectionScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import QRScreen from './src/screens/QRScreen';
import PayOsScreen from './src/screens/PayOsScreen';
import PaymentSuccess from './src/screens/PaymentSuccess';
import { Linking, Alert } from 'react-native';
import PaymentWebView from './src/screens/PaymentWebView';
import TicketScreenAll from './src/screens/TicketScreenAll';
/*
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
*/
/*
// Khởi tạo Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();//chuyển màn hình
function MyTabs() {
 return (
  
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
 
  
   <Tab.Navigator tabBar={ (props) => <CustomTabBar { ...props } /> }>
     <Tab.Screen name="Home" component={ HomeScreen } />
     <Tab.Screen name="Settings" component={ SettingsScreen } />
     <Tab.Screen name="Profile" component={ ProfileScreen } />
   </Tab.Navigator>
 );
 
}
  */

const Stack = createStackNavigator();
const App = () => {


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
    //<Playtime />
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="SeatBooking" component={ SeatSelector } options={ { headerShown: false } } />
    //     <Stack.Screen name="ZaloPayPaymentScreen" component={ PaymentScreen } options={ { headerShown: false } } />
    //     <Stack.Screen name="QRScreen" component={ QRScreen } options={ { headerShown: false } } />
    //   </Stack.Navigator>
    // </NavigationContainer>

    //<PaymentScreen route={ { params: { amount: 10000, userId: 'RE123', ticketId: "672a73e68f21d562887f10fc" } } } />
    <NavigationContainer >
      <Stack.Navigator initialRouteName="SeatSelectionScreen">
        <Stack.Screen name="SeatSelectionScreen" component={ SeatSelectionScreen } options={ { headerShown: false } } />
        <Stack.Screen name="PaymentWebView" component={ PaymentWebView } options={ { headerShown: false } } />
        <Stack.Screen name="PaySuccess" component={ PaymentSuccess } options={ { headerShown: false } } />
      </Stack.Navigator>
    </NavigationContainer>
    // <NavigationContainer >
    //   <Stack.Navigator initialRouteName="TicketScreenAll">
    //     <Stack.Screen name="TicketScreenAll" component={ TicketScreenAll } options={ { headerShown: false } } />
    //     <Stack.Screen name="TicketScreen" component={ TicketScreen } options={ { headerShown: false } } />

    //   </Stack.Navigator>
    // </NavigationContainer>
    // <TicketScreenAll navigation={ undefined } />
    //<TicketScreen navigation={ undefined } />
    //<PayOsScreen />
    //<Fb_Demo />
    //<ZoomableView />
    // <SeatDemo />
    //<QRCodeScanner />
    //<QRCodeAnimation />
    // <QRCodeScreen1 />


    //<TicketScreenDemo navigation={ undefined } />
    // <NotificationScreen navigation={ undefined } />
    // <TermsScreen />
    // <PolicyScreen/>
    // <Profile />
    // <EditProfile />
    // <ImageSliderExample/>
    //  <MyCarousel />

  );
}

export default gestureHandlerRootHOC(App);