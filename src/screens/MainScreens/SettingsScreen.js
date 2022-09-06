import React from 'react'
import Background from '../../components/Background'
import Logo from '../../components/Logo'
import Button from '../../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../App'
import { useContext } from 'react';

export default function SettingsScreen({ navigation }) {
    const { signOut } = useContext(AuthContext);

    const onPressLogOutButton = async () => {
        AsyncStorage.removeItem("userToken")
        AsyncStorage.removeItem("userFirebase")
        signOut()
    }


    return (
        <Background>
            <Logo />
            <Button
                mode="outlined"
            >Edit Profile</Button>
            <Button
                mode="outlined"
                onPress={onPressLogOutButton}

            >Logout
            </Button>
        </Background>
    )
}
