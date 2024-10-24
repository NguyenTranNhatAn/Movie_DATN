import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import AppHeader from '../components/AppHeader';

const TermsScreen = () => {
    return (
        <View style={ styles.container }>
            <ScrollView>
                <View style={ styles.appHeaderContainer }>
                    <AppHeader
                        name="chevron-left"
                        header="Term & Conditions"
                        action={ () => navigation.goBack() }
                    />
                </View>
                <Text style={ styles.title }>
                    LastUpdate:24/09/2024
                </Text>
                <Text style={ styles.content }>
                    These terms and conditions (together with the documents referred to in it) tells you the terms and
                    conditions on which you may make use of our website medialegalhelp.org (our Site), whether as
                    a guest or a registered user. Use of our Site includes accessing, browsing, or registering to use
                    our Site
                </Text>
                <Text style={ styles.redTitle }>
                    Conditions of use
                </Text>
                <Text style={ styles.content }>
                    We do not guarantee that our Site, or any content on it, will always be available or be uninterrupted.
                    Access to our Site is permitted on a temporary basis. We may suspend, withdraw, discontinue or
                    change all or any part of our Site without notice. We will not be liable to you if for any reason our
                    Site is unavailable at any time or for any period.
                    You are responsible for making all arrangements necessary for you to have access to our Site.
                    You are also responsible for ensuring that all persons who access our Site through your internet
                    connection are aware of these terms and conditions and other applicable terms and conditions,
                    and that they comply with them.
                </Text>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f3', // Thay đổi màu nền
        marginHorizontal: 20
    },
    appHeaderContainer: {
        marginHorizontal: 20,
        marginTop: 20,
        color: 'black',
    },
    title: {
        fontSize: 16,
        marginTop: 15
    },
    content: {
        fontSize: 18,
        color: 'black',
        marginTop: 8
    },
    redTitle: {
        color: 'red',
        fontSize: 18,
        marginTop: 20
    }
});
export default TermsScreen