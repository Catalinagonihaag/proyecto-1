import { View, StyleSheet, Text } from 'react-native'
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar } from 'react-native-paper';
import Button from './Button';


export default function UserListItem({ image_url, username, followStatusName, onPress }) {
    const imgUrl = image_url ? image_url : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
    const miUser = username ? username : 'UserNameNotFound'
    return (

        <View style={styles.userItem}>
            <View style={styles.avatar}>
                <Avatar.Image
                    source={{
                        uri: imgUrl,
                    }}
                    size={70}
                />
            </View>
            <View style={styles.userData}>
                <Text style={[styles.title, { fontSize: 20 }]}>{miUser}</Text>
                <TouchableOpacity onPress={onPress}>
                    <Button style={styles.followStatus} labelStyle={{ fontSize: 10, height: '100%', top: 7 }} color='white'>{followStatusName}</Button>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: "20%",
    },
    userItem: {
        paddingLeft: 10,
        paddingRight: 10,
        width: "100%",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',

    },
    userData: {
        paddingLeft: 40,
        width: "80%",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',

    },
    followStatus: {
        backgroundColor: '#4e81df',
        width: 100,
        height: 30,
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },


});