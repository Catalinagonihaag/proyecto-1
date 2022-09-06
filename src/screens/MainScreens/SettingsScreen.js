import React from 'react'
import Background from '../../components/Background'
import Button from '../../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { SafeAreaView } from 'react-native';
import { theme } from '../../core/theme';
import UserImage from '../../components/UserComponents/UserImage';
import TextInput from '../../components/TextInput';

export default function SettingsScreen({ navigation , context }) {
    const { signOut } = useContext(context);

    const onPressLogOutButton = async () => {
        AsyncStorage.removeItem("userToken")
        AsyncStorage.removeItem("userFirebase")
        signOut()
    }


    return (
        <SafeAreaView style={theme.appContainer}>
            <Background>
                <UserImage size={120} />
                 <TextInput
                    label="name"
                    value="user.name"
                />
                <TextInput
                    label="username"
                    value="user.username"
                />
                 <TextInput
                    label="password"
                    value="confirm password"
                />
                 <TextInput
                    label="confirm password"
                    value="confirm password"
                />
                <Button
                    mode="outlined"
                >Save Profile</Button>
                <Button
                    mode="outlined"
                    onPress={onPressLogOutButton}

                >Logout
                </Button>
            </Background>
        </SafeAreaView>
    )
}
