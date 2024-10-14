import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import { color } from '../constants/color';


// Danh sách các tab
const TabArr = [
  { route: 'Home', label: 'Home', icon: 'home', component: View, color: Colors.primary, alphaClr: Colors.primaryAlpha },
  { route: 'Search', label: 'Search', icon: 'search', component: View, color: Colors.green, alphaClr: Colors.greenAlpha },
  { route: 'Add', label: 'Add New', icon: 'plus-square', component: View, color: Colors.red, alphaClr: Colors.redAlpha },
  { route: 'Account', label: 'Account', icon: 'user', component: View, color: Colors.purple, alphaClr: Colors.purpleAlpha },
];

const Tab = createBottomTabNavigator();

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;

  // Sử dụng shared values để tạo animation
  const scale = useSharedValue(focused ? 1 : 0);
  const textScale = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value = withTiming(focused ? 1 : 0, { duration: 300 });
    textScale.value = withTiming(focused ? 1 : 0, { duration: 300 });
  }, [focused]);

  // Style động cho icon và text
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: textScale.value }],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, { flex: focused ? 1 : 0.65 }]}
    >
      <View>
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { backgroundColor: item.color, borderRadius: 16 }, animatedStyle]}
        />
        <View style={[styles.btn, { backgroundColor: focused ? null : item.alphaClr }]}>
          <Feather name={item.icon} size={24} color={focused ? Colors.white : Colors.primary} />
          <Animated.View style={animatedTextStyle}>
            {focused && (
              <Text style={{ color: Colors.white, paddingHorizontal: 8 }}>{item.label}</Text>
            )}
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function AnimTab3() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            position: 'absolute',
            margin: 16,
            borderRadius: 16,
          },
        }}
      >
        {TabArr.map((item, index) => {
          return (
            <Tab.Screen
              key={index}
              name={item.route}
              component={item.component}
              options={{
                tabBarShowLabel: false,
                tabBarButton: (props) => <TabButton {...props} item={item} />,
              }}
            />
          );
        })}
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  },
});
