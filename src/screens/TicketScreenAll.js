import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import AppHeader from '../components/AppHeader';

const TicketDemoWithHoles = ({ navigation }) => {
    const [tickets, setTickets] = useState([]);
    const userId = 'RE123';

    useEffect(() => {
        fetch(`https://60d8-171-252-189-233.ngrok-free.app/ticket/all/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.error === 0) {
                    setTickets(data.data);
                } else {
                    console.error('Error fetching tickets:', data.message);
                }
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    const TicketItem = ({ movieName, status, movieImage, ticketId }) => (
        <TouchableOpacity
            style={styles.ticketContainer}
            onPress={() => navigation.navigate('TicketScreen', { ticketId })}
        >
            <View style={styles.ticketBG}>
                <View style={[styles.blackCircle, { position: 'absolute', top: -40, right: -40 }]} />
                <View style={[styles.blackCircle, { position: 'absolute', bottom: -40, right: -40 }]} />
                <View style={[styles.blackCircle, { position: 'absolute', top: '50%', right: 10, marginTop: -40 }]} />
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.ticketFooter}>
                <View style={[styles.blackCircle, { position: 'absolute', top: -40, left: -40 }]} />
                <View style={[styles.blackCircle, { position: 'absolute', bottom: -40, left: -40 }]} />

                <View style={styles.rowContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.movieTitle}>{movieName}</Text>
                        <Text style={styles.daysLeft}>{status}</Text>
                    </View>
                    {movieImage && (
                        <Image
                            source={{ uri: movieImage }}
                            style={styles.ticketImage}
                            resizeMode="cover"
                        />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.appHeaderContainer}>
                <AppHeader
                    name="close"
                    header="My Tickets"
                    action={() => navigation.goBack()}
                />
            </View>
            <FlatList
                data={tickets}
                keyExtractor={(item) => item.ticketId}
                renderItem={({ item }) => (
                    <TicketItem
                        movieName={item.movieName}
                        status={item.status}
                        movieImage={item.movieImage}
                        ticketId={item.ticketId}
                    />
                )}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: 25,
    },
    appHeaderContainer: {
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    listContainer: {
        paddingHorizontal: 10,
    },
    ticketContainer: {
        flexDirection: 'row',
        backgroundColor: 'black',
        paddingBottom: 30,
    },
    ticketBG: {
        width: 100,
        height: 190,
        backgroundColor: '#FF5722',
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        position: 'relative',
    },
    verticalDivider: {
        width: 1,
        height: 190,
        backgroundColor: '#000',
        marginLeft: 5,
    },
    ticketFooter: {
        width: 290,
        height: 190,
        backgroundColor: '#FF5722',
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        position: 'relative',
        overflow: 'hidden',
        padding: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    movieTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    daysLeft: {
        fontSize: 20,
        color: '#FF0000',
        marginTop: 5,
    },
    ticketImage: {
        width: 100,
        height: 170,
        borderRadius: 10,
    },
    blackCircle: {
        height: 80,
        width: 80,
        borderRadius: 40,
        backgroundColor: '#000',
    },
});

export default TicketDemoWithHoles;
