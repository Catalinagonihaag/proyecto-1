import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native'
import { HomeScreen, ProfileScreen, SettingsScreen } from '../../screens/'
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchScreen from '../../screens/MainScreens/SearchScreen';


const Tab = createBottomTabNavigator();



export default function AuthorizedNavigator({ navigation, context }) {
    //const { signOut } = useContext(AuthContext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;


                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search-outline';
                    }



                    return <Ionicons name={iconName} size={size} color={color} />;
                }
            })}
        >
            <Tab.Screen name="Home" children={() => <HomeScreen context={context} />} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Settings" children={() => <SettingsScreen context={context} />} />
            <Tab.Screen name="Profile" children={() => <ProfileScreen context={context}  />} />
        </Tab.Navigator>
    )
}
