import React, { Fragment } from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { StyleSheet, View } from 'react-native'
import {
  LoginScreen,
  RegisterScreen
} from '../screens'
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

export default function StartScreen({ navigation }) {
  return (
    <Fragment>
      <View style={styles.Logo}>
        <Logo/>
      </View>
      <Tab.Navigator>
        <Tab.Screen name="Iniciar Sesión" component={LoginScreen} />
        <Tab.Screen name="Registrarse" component={RegisterScreen} />
      </Tab.Navigator>
    </Fragment>
  )
}

