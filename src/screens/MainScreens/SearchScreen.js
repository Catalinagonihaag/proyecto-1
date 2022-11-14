import React, { useEffect, useState } from 'react'
import Background from '../../components/Background'
import Button from '../../components/Button'
import { View, StyleSheet, Text, SafeAreaView } from 'react-native'
import { theme } from '../../core/theme'
import TextInput from '../../components/TextInput'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Avatar } from 'react-native-paper'
import UserListItem from '../../components/UserListItem'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { FlatList } from 'native-base'
import { GetUserList } from '../../api/ApiFirebase'

export default function SearchScreen({ navigation, route }) {
    const [userList, setUserList] = useState([])
    const [search, setSearch] = useState('')
    const [hayResultados, setHayResultados] = useState(false)


    const onClickUserProfile = (userId) => {
        console.log('onClickUserProfile', userId)
        navigation.jumpTo('Profile', { a: userId })
    }
    const onClickFollowButton = (userId) => {
        console.log('onClickFollowButton', userId)
    }

    useEffect(() => {
        getUserList()
    }, [])


    const getUserList = () => {
        AsyncStorage.getItem('userFirebase')
            .then(user => JSON.parse(user))
            .then(user => GetUserList(user.uid))
            .then(dbUsers => {
                let users = []
                for (const [key, value] of Object.entries(dbUsers)) {
                    users.push({ uid: key, ...value })
                }

                setUserList(users)
                setHayResultados(true)
            }
            )

    }

    const RenderListUsers = ({ text }) => {
        return (
            <FlatList
                data={userList.filter(user => user.username.toLowerCase().includes(text.toLowerCase()))}
                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={({ item }) => (
                    <UserListItem
                        key={item.uid}
                        image_url={item.image_url}
                        username={item.username}
                        followStatusName={"Follow"}
                        onPressFollow={() => onClickFollowButton(item.uid)}
                        onPressAvatar={() => onClickUserProfile(item.uid)}
                    />
                )}
                keyExtractor={item => item.uid}
            />
        )

    }

    return (
        <SafeAreaView style={theme.appContainer}>
            <Background style={styles.container}>
                <View style={styles.searchSection} >
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Ionicons name={'search'} size={20} style={styles.iconSearchBox} />
                        <TextInput
                            onChangeText={text => setSearch(text)}
                            style={styles.inputSearch}
                            selectionColor={theme.colors.primary}
                            underlineColor="transparent"
                            mode="outlined"
                            label="Search"
                        />

                    </View>
                    <View style={styles.filtersButtons}>
                        <TouchableOpacity onPress={getUserList}>
                            <Button style={[styles.buttonFilter, { backgroundColor: '#4e81df', 'color': 'white' }]} mode={'outlined'} labelStyle={{ fontSize: 10 }}> Users</Button>
                        </TouchableOpacity>
                        <Button style={styles.buttonFilter} labelStyle={{ fontSize: 10 }} > Hastags </Button>
                        <Button style={styles.buttonFilter} labelStyle={{ fontSize: 10 }}> Posteos </Button>
                    </View>
                </View>
                <View style={styles.resultsSection}>
                    {
                        hayResultados
                            ? <RenderListUsers text={search} />
                            : console.log('Esperando a que se busque algo')

                    }

                </View>
            </Background>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({



    container: {
        width: '100%',
        marginVertical: 12,
    },
    searchSection: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        width: '80%',
        flexDirection: 'column',
    },
    inputSearch: {
        backgroundColor: theme.colors.surface,
        width: '80%',
        height: 30,
        alignSelf: 'flex-end',
        borderWidth: 0,

    },
    iconSearchBox: {
        color: '#000',
        alignSelf: 'center',
    },
    filtersButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '40%',
        alignSelf: 'center',
    },
    buttonFilter: {
        height: 40,
        alignSelf: 'center',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 50,

    },




    resultsSection: {
        flex: 1,
        marginTop: 12,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    description: {
        fontSize: 13,

        paddingTop: 8,
    },
    error: {
        fontSize: 13,

        paddingTop: 8,
    },
})

