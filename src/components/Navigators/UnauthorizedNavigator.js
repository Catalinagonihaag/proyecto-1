import React, { Fragment } from 'react'
import Logo from '../../components/Logo'
import { StyleSheet, View } from 'react-native'
import {
  LoginScreen,
  RegisterScreen
} from '../../screens'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
  Logo: {
    'background-color': '#fff',
    padding: 20,
    width: '100%',
    alignItems: 'center',
  }
})

export default function UnauthorizedNavigator({ navigation }) {
  return (
    <Fragment>
      <View style={styles.Logo}>
        <Logo />
      </View>
      <Tab.Navigator>
        <Tab.Screen name="Iniciar Sesión" component={LoginScreen} /> 
        <Tab.Screen name="Registrarse" component={RegisterScreen} />
      </Tab.Navigator>
    </Fragment>
  )
}

