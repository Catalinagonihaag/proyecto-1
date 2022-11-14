import React, { useEffect, useReducer, useMemo } from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import { NativeBaseProvider, extendTheme } from "native-base";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { RegisterUser, LoginWithEmailAndPassword } from './src/api/ApiFirebase';
import { AuthorizedNavigator, UnauthorizedNavigator } from './src/components/Navigators'

const Stack = createStackNavigator()
export const AuthContext = React.createContext();

export default function App() {
    const nativeTheme = extendTheme({ width: '100%' });

    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userToken: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userToken: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
        }
    );

    const authContext = useMemo(
        () => ({
            signIn: async (data) => {
                // In a production app, we need to send some data (usually username, password) to server and get a token
                // We will also need to handle errors if sign in failed
                // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
                // In the example, we'll use a dummy token

                return LoginWithEmailAndPassword(data.email, data.password)
                    .then((data) => {
                        AsyncStorage.setItem('userFirebase', JSON.stringify(data.user))
                        AsyncStorage.setItem('userToken', data.user.accessToken)

                        dispatch({ type: 'SIGN_IN', token: data.user.accessToken })
                    })
                    .catch(e => {
                        if (e.code == "auth/invalid-email")
                            throw { code: e.code, message: "LoginResponse: Email Invalido" }
                    })


            },
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
            signUp: async (data) => {
                // In a production app, we need to send user data to server and get a token
                // We will also need to handle errors if sign up failed
                // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage

                return RegisterUser(data.name, data.email, data.password)
                    .then((data) => {
                        console.log('User account created & signed in!')
                        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' })
                    })
                    .catch(error => {


                        switch (error.code) {
                            case "auth/email-already-in-use":
                                error_message = "Email ya registrado"
                                break
                            case "auth/weak-password":
                                error_message = "Contraseña muy débil"
                                break
                            case "auth/invalid-email":
                                error_message = "auth/invalid-email"
                            default:
                                let error_message = "Error al registrar, intente más tarde"
                                break
                        }
                        throw { code: error.code, message: error_message }
                    });
            },
        }),
        []
    );

    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken;

            try {
                userToken = await AsyncStorage.getItem('userToken');
            } catch (e) {
                console.log(e)
            }

            // After restoring token, we may need to validate it in production apps

            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };

        bootstrapAsync();
    }, [dispatch]);

    return (
        <AuthContext.Provider value={authContext}>
            <Provider theme={theme}>
                <NativeBaseProvider theme={nativeTheme}>
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: false,
                            }}
                        >
                            {
                                state.userToken == null ? (

                                    //? No token found, user isn't signed in
                                    <Stack.Screen
                                        name="UnauthorizedNavigator"
                                        options={{
                                            title: 'Iniciar Sesión',
                                            // When logging out, a pop animation feels intuitive
                                            animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                                        }}
                                        children={() => <UnauthorizedNavigator context={AuthContext} />}
                                    >
                                    </Stack.Screen>
                                ) : (
                                    //? User is signed in
                                    <Stack.Screen name="AuthorizedNavigator" children={() => <AuthorizedNavigator context={AuthContext} />} />

                                )
                            }
                        </Stack.Navigator>
                    </NavigationContainer>
                </NativeBaseProvider>
            </Provider>
        </AuthContext.Provider>)
}
