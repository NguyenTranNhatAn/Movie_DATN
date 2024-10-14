import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Tabs/HomeScreen';
import SeatSelection from '../screens/Stack/Test';
import History from '../screens/Stack/History';
import Search from '../screens/Tabs/Search';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthRouter = <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* <Stack.Screen name='LoginScreen' component={LoginScreen} />
    <Stack.Screen name='SignInScreen' component={SignInScreen} /> */}

</Stack.Navigator>

const MainStackNavigation = (props) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tab" component={MainTabNavigation} />
            <Stack.Screen name="History" component={History} />
            <Stack.Screen name="Test" component={SeatSelection} />

        </Stack.Navigator>
    )
}
const MainTabNavigation = (props) => {


    return (
        <Tab.Navigator screenOptions={{headerShown:false}}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={Search} />

        </Tab.Navigator>
    )
}

const Router = (props) => {

    return (
        <MainStackNavigation />
    );
}

export default Router