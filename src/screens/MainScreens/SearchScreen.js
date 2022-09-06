import React, { useEffect, useState } from 'react'
import Background from '../../components/Background'
import Logo from '../../components/Logo'
import Header from '../../components/Header'
import Paragraph from '../../components/Paragraph'
import Button from '../../components/Button'
import { View, StyleSheet, Text } from 'react-native'
import { theme } from '../../core/theme'
import TextInput from '../../components/TextInput'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GetUserList } from '../../api/ApiFirebase'
import { Avatar } from 'react-native-paper'
import UserListItem from '../../components/UserListItem'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function SearchScreen({ navigation }) {
  const [userList, setUserList] = useState([])
  const [search, setSearch] = useState('')
  const [hayResultados, setHayResultados] = useState(false)


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

  const RenderListUsers = () => {

    return (
      userList.map(({ uid, image_url, username }) => { return <UserListItem key={uid} image_url={image_url} username={username} followStatusName="Follow" /> })
    )

  }

  return (
    <Background style={styles.container}>
      <View style={styles.searchSection} >
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Ionicons name={'search'} size={20} style={styles.iconSearchBox} />
          <TextInput
            style={styles.inputSearch}
            selectionColor={theme.colors.primary}
            underlineColor="transparent"
            mode="outlined"
            label="Search"
          />

        </View>
        <View style={styles.filtersButtons}>
          <TouchableOpacity onPress={getUserList}>
            <Button  style={[styles.buttonFilter, { backgroundColor: '#4e81df', 'color': 'white' }]} mode={'outlined'} labelStyle={{ fontSize: 10 }}> Users</Button>
          </TouchableOpacity>
          <Button style={styles.buttonFilter} labelStyle={{ fontSize: 10 }} > Hastags </Button>
          <Button style={styles.buttonFilter} labelStyle={{ fontSize: 10 }}> Posteos </Button>
        </View>
      </View>
      <View style={styles.resultsSection}>
        {
          hayResultados
            ? <RenderListUsers />
            : console.log('Esperando a que se busque algo')

        }

      </View>
    </Background>
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

