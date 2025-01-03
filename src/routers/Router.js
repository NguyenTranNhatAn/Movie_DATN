import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Tabs/HomeScreen';
import SeatSelection from '../screens/Stack/Test';
import History from '../screens/Stack/History';
import Search from '../screens/Tabs/Search';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Image } from 'react-native-animatable';
import Details from '../screens/Stack/Detail';
import Profile from '../screens/Tabs/Profile';
import Latest from '../screens/Stack/Latest';
import Category from '../screens/Tabs/Category';
import Checkout from '../screens/Stack/Checkout';
import EditProfileComponent from '../screens/Stack/Editprofile';
import LoginScreen from '../screens/Stack/LoginScreens';
import SplashScreen from '../screens/Stack/SplashScreens';
import Favour from '../screens/Stack/Favour';
import SignupScreen from '../screens/Stack/SignupScreen';
import SeatBookScreen from '../screens/Stack/SeatBook';
import CinemaSelect from '../screens/Stack/CinemaSelect';
import PolicyScreen from '../screens/PolicyScreen';
import PaymentWebView from '../screens/PaymentWebView'; // Add if needed
import PaymentSuccess from '../screens/PaymentSuccess'; // Add if needed
import TicketScreen from '../screens/Stack/TicketScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import Component from '../screens/Component';
import PaymentScreen from '../screens/Payment_Screen';
import TicketDetail from '../screens/Stack/TicketDetail';
import SeatSelectionn from '../screens/SeatSelectionScreen copy';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={ { headerShown: false } }>
      <Stack.Screen name="Login" component={ LoginScreen } />
      <Stack.Screen name="Tab" component={ MainTabNavigation } />
      <Stack.Screen name="Splash" component={ SplashScreen } />
      <Stack.Screen name="History" component={ History } />
      <Stack.Screen name="Test" component={ SeatSelection } />
      <Stack.Screen name="Detail" component={ Details } />
      <Stack.Screen name="Latest" component={ Latest } />
      <Stack.Screen name="Seat" component={ SeatSelectionScreen } />
      <Stack.Screen name="Combo" component={ Component } />
      <Stack.Screen name="Pay_Screen" component={ PaymentScreen } />
      <Stack.Screen name="PaymentWebView" component={ PaymentWebView } />
      <Stack.Screen name="PaySuccess" component={ PaymentSuccess } />
      <Stack.Screen name="Cinema" component={ CinemaSelect } />
      <Stack.Screen name="TicketDetails" component={ TicketDetail} />
      <Stack.Screen name="Favour" component={ Favour } />
      <Stack.Screen name="Checkout" component={ Checkout } />
      <Stack.Screen name="EditProfile" component={ EditProfileComponent } />
      <Stack.Screen name="Signup" component={ SignupScreen } />
      <Stack.Screen name="Policy" component={ PolicyScreen } />
    </Stack.Navigator>
  );
};

const TabArr = [
  {
    route: 'Home',
    label: 'Home',
    focusedImage: require('../../assets/image/homeFocus.png'),
    unfocusedImage: require('../../assets/image/home.png'),
    component: HomeScreen,
    color: "#FF515A",
  },
  {
    route: 'Search',
    label: 'Search',
    focusedImage: require('../../assets/image/search-f.png'),
    unfocusedImage: require('../../assets/image/search-normal.png'),
    component: Search,
    color: "#FF515A",
  },
  {
    route: 'Favorite',
    label: 'Favorite',
    focusedImage: require('../../assets/image/heart-f.png'),
    unfocusedImage: require('../../assets/image/heart.png'),
    component: Favour,
    color: "#FF515A",
  },
  {
    route: 'Ticket',
    label: 'Ticket',
    focusedImage: require('../../assets/image/ticket-f.png'),
    unfocusedImage: require('../../assets/image/ticket.png'),
    component: Category,
    color: "#FF515A",
  },
  {
    route: 'Profile',
    label: 'Profile',
    focusedImage: require('../../assets/image/user-square-f.png'),
    unfocusedImage: require('../../assets/image/user-square.png'),
    component: Profile,
    color: "#FF515A",
  },
];

const TabButton = ({ item, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;
  const scale = useSharedValue(focused ? 1 : 0);
  const textScale = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value = withTiming(focused ? 1 : 0, { duration: 300 });
    textScale.value = withTiming(focused ? 1 : 0, { duration: 300 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textScale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={ onPress }
      activeOpacity={ 1 }
      style={ [styles.container, { flex: focused ? 1 : 0.65 }] }
    >
      <View>
        <Animated.View
          style={ [StyleSheet.absoluteFillObject, { backgroundColor: item.color, borderRadius: 16 }, animatedStyle] }
        />
        <View style={ [styles.btn, { backgroundColor: focused ? null : item.alphaClr }] }>
          <Image source={ focused ? item.focusedImage : item.unfocusedImage } style={ { width: 24, height: 24 } } />
          <Animated.View style={ animatedTextStyle }>
            { focused && <Text style={ { fontSize: 14, color: "white", marginLeft: 8 } }>{ item.label }</Text> }
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MainTabNavigation = () => (
  <Tab.Navigator
    screenOptions={ {
      headerShown: false,
      tabBarStyle: {
        height: 60,
        position: 'absolute',
        paddingHorizontal: 20,
      },
    } }
  >
    { TabArr.map((item, index) => (
      <Tab.Screen
        key={ index }
        name={ item.route }
        component={ item.component }
        options={ {
          tabBarShowLabel: false,
          tabBarButton: (props) => <TabButton { ...props } item={ item } />,
        } }
      />
    )) }
  </Tab.Navigator>
);

const Router = () => {
  return <MainStackNavigation />;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  btn: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Router;
