import { View, Text, StyleSheet, Image,TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AppHeader from '../components/AppHeader';
import Avatar from '../assets/image/avatar.png';
import Icon1 from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native-paper';
const EditProfile = () => {
    handleLogout = () => {
        console.log("User logged out");
    }
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    return (
        <View style={ styles.container }>
            <View style={ styles.appHeaderContainer }>
                <AppHeader
                    name="chevron-left"
                    header="Edit Profile"
                    action={ () => navigation.goBack() } />
            </View>

            <View style={ styles.header }>
                <View style={ styles.parent }>
                    <Image source={ Avatar } style={ styles.imgAvatar } />
                    <View style={ styles.child }>
                        <View style={ styles.iconWrapper }>
                            <Icon1 name="edit-3" style={ styles.iconEdit } />
                        </View>
                    </View>
                </View>
            </View>

            <TextInput
                label="Name"
                value={ name }
                mode="outlined"
                onChangeText={ text => setName(text) }
                outlineColor="#FB7181"
                activeOutlineColor="#FB7181"
                style={ styles.input }
                theme={ {
                    roundness: 10,  // Thêm roundness vào theme để bo góc
                    colors: { text: '#000' }
                } }
            />

            <TextInput
                label="Mobile Number"
                value={ mobileNumber }
                mode="outlined"
                onChangeText={ text => setMobileNumber(text) }
                outlineColor="#FB7181"
                activeOutlineColor="#FB7181"
                keyboardType="phone-pad"
                style={ styles.input }
                theme={ {
                    roundness: 10,  // Thêm roundness vào theme để bo góc
                    colors: { text: '#000' }
                } }
            />

            <TextInput
                label="Enter Address"
                value={ address }
                mode="outlined"
                onChangeText={ text => setAddress(text) }
                outlineColor="#FB7181"
                activeOutlineColor="#FB7181"
                style={ styles.input }
                theme={ {
                    roundness: 10,  // Thêm roundness vào theme để bo góc
                    colors: { text: '#000' }
                } }
            />
            <TouchableOpacity style={ styles.button } onPress={ handleLogout }>
                <Text style={ styles.TextFoot } >Update</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff', // Thay đổi màu nền
    },
    appHeaderContainer: {
        marginHorizontal: 20,
        marginTop: 20,
        color: 'black',
    },
    header: {
        alignItems: 'center',
        marginTop: 10
    },
    font: {
        fontSize: 16,
        color: 'black',
        fontStyle: 'normal',
        fontWeight: 'bold'
    },
    imgAvatar: {
        width: 100,
        height: 100,
        borderRadius: 15
    },
    parent: {
        position: 'relative',
        marginTop: 25
    },
    child: {
        position: 'absolute',
        bottom: 0,
        right: 0,

    },
    iconWrapper: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#FF515A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2, // Độ dày của đường viền
        borderColor: '#FFF', // Màu sắc của đường viền
    },
    iconEdit: {
        color: 'white'
    },

    input: {
        marginBottom: 20,
        backgroundColor: '#fff',
        width: '90%',
        marginHorizontal: 20,

    },
    button: {
        position: 'absolute',
        bottom: 80,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 335,
        height: 56,
        backgroundColor: '#FF515A',
        borderRadius: 10,
        marginHorizontal: 33

    },
    IconFoot: {
        fontSize: 16,
        color: '#FFF'
    },
    TextFoot: {
        fontSize: 16,
        color: '#FFF',
        marginLeft: 10
    }
})
export default EditProfile