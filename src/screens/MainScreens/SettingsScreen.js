import React from 'react'
import Background from '../../components/Background'
import Logo from '../../components/Logo'
import Button from '../../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../App'
import { useContext } from 'react';
import { SafeAreaView } from 'react-native';
import { theme } from '../../core/theme';
import UserImage from '../../components/UserComponents/UserImage';
import TextInput from '../../components/TextInput';

export default function SettingsScreen({ navigation }) {
    const { signOut } = useContext(AuthContext);

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
