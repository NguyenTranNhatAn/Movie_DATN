import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import AppHeader from '../components/AppHeader';
import Icon1 from 'react-native-vector-icons/AntDesign';

const NotificationScreen = ({ navigation }) => {
    const notifications = {
        today: [
            {
                icon: 'setting',
                title: 'Get 30% Off on Dance Event!',
                content: 'Special promotion only valid today',
            },
            {
                icon: 'lock',
                title: 'Password update Successful',
                content: 'Your password update successfully',
            },
        ],
        yesterday: [
            {
                icon: 'bells',
                title: 'New Event Alert',
                content: 'Don’t miss the live concert tomorrow',
            },
            {
                icon: 'shoppingcart',
                title: 'Purchase Confirmation',
                content: 'Your ticket purchase is confirmed',
            },
        ],
        '13/9/2024': [
            {
                icon: 'gift',
                title: 'Gift Voucher Received',
                content: 'You have received a 50% off gift voucher.',
            },
        ],
    };

    const NotificationItem = ({ item }) => (
        <View style={ styles.itemContainer }>
            <View style={ styles.iconWrapper }>
                <Icon1 name={ item.icon } style={ styles.icon } />
            </View>
            <View style={ styles.textContainer }>
                <Text style={ styles.titleList }>{ item.title }</Text>
                <Text style={ styles.contentList }>{ item.content }</Text>
            </View>
        </View>
    );

    const renderNotificationSection = (title, data) => (
        <View key={ title }>
            <View style={ styles.sectionTitle }>
                <Text style={ styles.sectionContent }>{ title }</Text>
            </View>
            { data.map((item, index) => (
                <NotificationItem key={ index } item={ item } />
            )) }
        </View>
    );

    return (
        <View style={ styles.container }>
            <ScrollView>
                <View style={ styles.appHeaderContainer }>
                    <AppHeader
                        name="chevron-left"
                        header="Notification"
                        action={ () => navigation.goBack() }
                    />
                </View>
                { renderNotificationSection('Today', notifications.today) }
                { renderNotificationSection('Yesterday', notifications.yesterday) }
                { renderNotificationSection('13/9/2024', notifications['13/9/2024']) }
                { renderNotificationSection('13/9/2024', notifications['13/9/2024']) }
                { renderNotificationSection('13/9/2024', notifications['13/9/2024']) }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f3', // Thay đổi màu nền
    },
    appHeaderContainer: {
        marginHorizontal: 36,
        marginTop: 20,
        color: 'black',
    },
    sectionTitle: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    sectionContent: {
        fontSize: 28, // Tăng kích thước phông chữ cho tiêu đề
        fontWeight: 'bold',
        color: '#333', // Màu sắc tối hơn cho tiêu đề
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 15, // Tăng padding cho mục
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        alignItems: 'center',
        marginHorizontal: 20, // Giảm khoảng cách hai bên
        elevation: 3,
        marginTop: 15,
        backgroundColor: '#ffffff', // Thay đổi màu nền mục
        borderRadius: 8, // Thêm góc bo cho mục,
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FF515A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 24,
        color: 'white',
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    titleList: {
        fontSize: 18, // Điều chỉnh kích thước phông chữ
        fontWeight: 'bold',
        color: '#000',
    },
    contentList: {
        fontSize: 14,
        color: '#666',
    },
});

export default NotificationScreen;
