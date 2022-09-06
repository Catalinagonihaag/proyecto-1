import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, Platform } from 'react-native';

import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,
} from 'react-native-paper';
import { ReadUserData } from '../../api/ApiFirebase'
import UserImage from '../../components/UserComponents/UserImage';
import { theme } from '../../core/theme';
import LoadingScreen from '../CommonScreens/LoadingScreen';


const ProfileScreen = () => {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        AsyncStorage.getItem('userFirebase')
            .then(value => JSON.parse(value))
            .then(user => {
                ReadUserData(user.uid).then(userData => {
                    console.log("ProfileScreen : UserData", userData)
                    setUser({
                        name: userData.username,
                        description: userData.description,
                        followers: userData.hasOwnProperty("followers") ? userData.followers.length : 0,
                        following: (userData.hasOwnProperty("following") ? userData.following.length : 0),
                        mutualFollows: userData.hasOwnProperty("mutualFollows") ? userData.mutualFollows : 0,

                    })
                    setLoading(false)

                })
            })

    }, [])


    return (

        loading
            ?
            <LoadingScreen />
            :
            <SafeAreaView style={theme.appContainer}>
                <View style={styles.userInfoSection}>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <View style={styles.avatar}>
                            <UserImage size={80}/>
                        </View>

                        <View style={styles.userData}>
                            <View style={{ padding: 10 }}><Text style={styles.title}>{user.name}</Text></View>
                            <View style={styles.follows}>
                                <View style={styles.followsItem}>
                                    <Text>{user.followers}</Text>
                                    <Text style={{ color: "#777777", marginLeft: 20 }}>Seguidores</Text>
                                </View>
                                <View style={styles.followsItem}>
                                    <Text>{user.mutualFollows}</Text>
                                    <Text style={{ color: "#777777", marginLeft: 20 }}>Seguidos</Text>
                                </View>
                                <View style={styles.followsItem}>
                                    <Text>{user.following}</Text>
                                    <Text style={{ color: "#777777", marginLeft: 20 }}>Siguiendo</Text>
                                </View>
                            </View>

                            <View><Text style={styles.biografy}>{user.description}</Text></View>
                        </View>
                    </View>
                </View>

                <View style={styles.posteos}>

                </View>


            </SafeAreaView>



    );
}

export default ProfileScreen;


const styles = StyleSheet.create({
    title: {
        marginTop: 15,
        marginBottom: 5,
    },
    avatar: {
        width: "20%",
    },
    userData: {
        width: "80%",
        alignItems: 'center'
    },
    follows: {
        flexDirection: "row",
    },
    followsItem: {
        alignItems: 'center',
        color: "#777777",
        marginLeft: 20,
    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 25,
    },
    biografy: {
        // "max-inline-size": "40ch",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    posteos: {
        borderTopColor: '#dddddd',
        borderTopWidth: 1,
    },

});