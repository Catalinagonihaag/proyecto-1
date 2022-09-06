import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Button from './Button';
import UserImage from './UserComponents/UserImage';


export default function UserListItem({ image_url, username, followStatusName, onPressFollow, onPressAvatar }) {
    const miUser = username ? username : 'UserNameNotFound'
    return (

        <View style={styles.userItem} onPress={() => { console.log("press") }} >
            <TouchableOpacity style={styles.avatar} onPress={onPressAvatar}>
                <UserImage size={70} optional_image={image_url} otherUser={true} />
            </TouchableOpacity >
            <View style={styles.userData}>
                <Text style={[styles.title, { fontSize: 20 }]}>{miUser}</Text>

                <Button style={styles.followStatus} onPress={onPressFollow} labelStyle={{ fontSize: 10, height: '100%', top: 7 }} color='white'>{followStatusName}</Button>

            </View>
        </View >
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