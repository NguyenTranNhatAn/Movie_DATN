// CustomTabBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    navigation.navigate(route.name);
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={[
                            styles.tabItem,
                            {
                                backgroundColor: isFocused ? 'tomato' : 'transparent',
                                paddingHorizontal: isFocused ? 20 : 0,
                            },
                        ]}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon
                                name={
                                    route.name === 'Home'
                                        ? (isFocused ? 'home' : 'home-outline')
                                        : route.name === 'Settings'
                                        ? (isFocused ? 'settings' : 'settings-outline')
                                        : 'person'
                                }
                                size={24}
                                color={isFocused ? 'white' : 'gray'}
                            />
                            {isFocused && (
                                <Text style={[styles.tabLabel, { color: 'white' }]}>{label}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 5,
    },
    tabLabel: {
        fontSize: 12,
        marginLeft: 5,  // Added marginLeft to space out text from icon
        marginTop: 4,
    },
});

export default CustomTabBar;
