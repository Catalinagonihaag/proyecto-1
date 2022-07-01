import React, { useEffect, useReducer, useMemo } from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  MainScreen,
} from './src/screens'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyD9Y7A-NBwExsXtDySImWPn2sjnPY5Pq8I",
  authDomain: "hss-2d0af.firebaseapp.com",
  projectId: "hss-2d0af",
  storageBucket: "hss-2d0af.appspot.com",
  messagingSenderId: "993924137747",
  appId: "1:993924137747:web:fc2f3003f93df2c41750e6",
  measurementId: "G-40LW453GJ8"
};
initializeApp(firebaseConfig)


const Stack = createStackNavigator()
export const AuthContext = React.createContext();

export default function App() {
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

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, [dispatch]);

  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        return signInWithEmailAndPassword(getAuth(), data.email, data.password)
          .then(() => {
            dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
          })
          .catch(e => {
            throw e
          })


      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        return createUserWithEmailAndPassword(getAuth(), data.email, data.password)
          .then(() => {
            console.log('User account created & signed in!')
            dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' })
          })
          .catch(error => {

            if (error.code === 'auth/email-already-in-use') {
              throw 'Email ya registrado'
            }
            if (error.code === 'auth/weak-password') {
              throw 'Contraseña muy débil'
            }
            if (error.code === 'auth/invalid-email') {
              throw { error: 'Email Invalido!' }
            }

            console.log(error)
            throw 'Error al registrar, intente más tarde'
          });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <Provider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            {
              state.userToken == null ? (
                // No token found, user isn't signed in
                <Stack.Screen
                  name="StartScreen"
                  component={StartScreen}
                  options={{
                    title: 'Iniciar Sesión',
                    // When logging out, a pop animation feels intuitive
                    animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                  }}
                />
              ) : (
                // User is signed in
                <Stack.Screen name="MainScreen" component={MainScreen} />

              )
            }
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </AuthContext.Provider>
  )
}
