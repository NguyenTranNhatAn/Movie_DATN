import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Avatar from '../assets/image/avatar.png';
import Icon1 from 'react-native-vector-icons/Feather';
import EditIcon from 'react-native-vector-icons/FontAwesome5';
import TicketIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Privacy from 'react-native-vector-icons/MaterialIcons';
import Terms from 'react-native-vector-icons/MaterialIcons';
import Logout from 'react-native-vector-icons/AntDesign';
const Profilef = () => {
    handleLogout = () => {
        console.log("User logged out");
    }
    return (
        <View style={ styles.container }>
            <View style={ styles.header }>
                <Text style={ styles.font }>Profile</Text>

                <View style={ styles.parent }>
                    <Image source={ Avatar } style={ styles.imgAvatar } />
                    <View style={ styles.child }>
                        <View style={ styles.iconWrapper }>
                            <Icon1 name="edit-3" style={ styles.iconEdit } />
                        </View>
                    </View>
                </View>

                <Text style={ { color: 'black', fontSize: 20, fontWeight: 'bold', marginTop: 10 } }>Zhao LI YING</Text>
                <Text style={ { fontSize: 16, marginTop: 3 } }>(+84) 0967 98330 </Text>

            </View>
            <View style={ { marginTop: 20 } }></View>
            <View style={ styles.body }>
                <View style={ styles.iconAndText }>
                    <EditIcon name="edit" style={ styles.IconChange } />
                    <Text style={ styles.textStyle }>Edit Profile</Text>
                </View>
                <Icon1 name="chevron-right" style={ styles.iconBody } />
            </View>
            <View style={ styles.body }>
                <View style={ styles.iconAndText }>
                    <TicketIcon name="ticket-confirmation-outline" style={ styles.IconChange } />
                    <Text style={ styles.textStyle }>My TIckets</Text>
                </View>
                <Icon1 name="chevron-right" style={ styles.iconBody } />
            </View>
            <View style={ styles.body }>
                <View style={ styles.iconAndText }>
                    <Icon1 name="lock" style={ styles.IconChange } />
                    <Text style={ styles.textStyle }>Change Password</Text>
                </View>
                <Icon1 name="chevron-right" style={ styles.iconBody } />
            </View>

            <View style={ styles.body }>
                <View style={ styles.iconAndText }>
                    <Privacy name="privacy-tip" style={ styles.IconChange } />
                    <Text style={ styles.textStyle }>Privacy Policy</Text>
                </View>
                <Icon1 name="chevron-right" style={ styles.iconBody } />
            </View>


            <View style={ styles.body }>
                <View style={ styles.iconAndText }>
                    <Terms name="event-note" style={ styles.IconChange } />
                    <Text style={ styles.textStyle }>Terms & Conditons</Text>
                </View>
                <Icon1 name="chevron-right" style={ styles.iconBody } />
            </View>
            <TouchableOpacity style={ styles.button } onPress={ handleLogout }>
                <Logout name="logout" style={ styles.IconFoot } />
                <Text style={ styles.TextFoot } >Logout</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff', // Thay đổi màu nền
    },
    header: {
        alignItems: 'center',
        marginTop: 10
    },
    font: {
        fontSize: 20,
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
    body: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',  // Để căn giữa theo trục dọc
        height: 65,
        marginHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#f6f6f6'

    },
    iconAndText: {
        flexDirection: 'row',  // Sắp xếp icon và text theo hàng ngang
        alignItems: 'center',  // Đảm bảo icon và text được căn giữa theo trục dọc
    },
    IconChange: {
        fontSize: 25,
        color: '#302c2c',
    },
    textStyle: {
        marginLeft: 8,  // Khoảng cách giữa icon và text
        fontSize: 18,
        color: '#302c2c',
    },
    iconBody: {
        fontSize: 30,
        color: '#302c2c',
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

});
export default Profilef