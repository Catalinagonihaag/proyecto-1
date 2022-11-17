import React, { useState } from 'react'
import { StyleSheet, Dimensions, Text } from 'react-native'
import { View } from 'native-base'
import TextInput from '../../components/TextInput'
import { style } from 'styled-system'
import Icon from 'react-native-vector-icons/Feather'
import { TouchableHighlight } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { postPost } from '../../api/ApiFirebase'

export default function UploadPost({ navigation, context }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uid, setUid] = useState('')

  const handleChangeDesc = (e) => {
    if (e.length <= 150) {
      setDescription(e)
    }
  }

  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem('userFirebase')
      if (value !== null) {
        return JSON.parse(value)
      }
    } catch (e) {
      console.log(e)
    }
  }

  getUser().then((data) => {
    setUid(data.uid);
  })

    const handleUpload = async () => {
        let data = {
            title: title,
            description: description,
        }
        await postPost(uid, data).then(() => {
            console.log('Post subido');
        })
        .catch((error) => {
            console.log(error)
        })
    }
    


  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={(e) => setTitle(e)}
      />
      <TextInput
        label="Descripción"
        multiline={true}
        numberOfLines={8}
        placeholder={'"Me gusta el arte, todo tipo de arte..."'}
        style={[styles.inputDesc]}
        value={description}
        onChangeText={handleChangeDesc}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <TouchableHighlight style={styles.uploadBox}>
          <Icon name="upload" size={50} />
        </TouchableHighlight>
        <TouchableHighlight style={styles.uploadBox}>
          <Icon name="upload" size={50} />
        </TouchableHighlight>
      </View>
      <TouchableHighlight
        style={{
          width: 100,
          alignItems: 'center',
          marginTop: 20,
          backgroundColor: '#32a852',
          paddingVertical: 10,
          borderRadius: 10,
        }}
        onPress={() => handleUpload()}
      >
        <Text>Subir</Text>
      </TouchableHighlight>
    </View>
  )
}

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  inputDesc: {
    width: '100%',
    height: 185,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  inputYellow: {
    borderColor: '#F1F1F1',
    borderWidth: 2,
  },
  uploadBox: {
    width: windowWidth / 2 - 40,
    height: 100,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderColor: '#000',
    borderWidth: 1,
  },
})
