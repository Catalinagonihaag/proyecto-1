import React, { useState } from 'react'
import { StyleSheet, Dimensions, Text, Image } from 'react-native'
import { View } from 'native-base'
import TextInput from '../../components/TextInput'
import { style } from 'styled-system'
import Icon from 'react-native-vector-icons/Feather'
import { TouchableHighlight } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getImageFromStorage, postPost, uploadImageStorage } from '../../api/ApiFirebase'
import * as ImagePicker from 'expo-image-picker'
import { v4 as uuidv4 } from 'uuid'
import { TouchableOpacity } from 'react-native-gesture-handler'

//lo que muestra la app
export default function UploadPost({ navigation, context }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [base64, setBase64] = useState(null);
  const [uid, setUid] = useState('')

  //guarda des y max caract
  const handleChangeDesc = (e) => {
    if (e.length <= 150) {
      setDescription(e)
    }
  }
  //pide los datos de usuario en fb
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

  //pide que se traiga solo id del usuario
  getUser().then((data) => {
    setUid(data.uid)
  })

  const handleUpload = async () => {

    const uuid = uuidv4()
    let img = false

    if (base64) {
      const {bucket, contentType, fullPath, name} = await uploadImageStorage(base64, uuid)
      img = {bucket, contentType, fullPath, name, id: uuid}
    }

    let data = {
      title: title,
      description: description,
      img
    }

    //se va a subir los datos y el usuario
    await postPost(uid, data, uuid)
      .then(() => {
        console.log('Post subido')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    })

    console.log(result)

    if (!result.cancelled) {
      setImage(result.uri)
      setBase64(result.base64)

    }
  }

  const getPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    console.log(result)

    if (!result.cancelled) {
      setImage(result.uri)
      setBase64(result.base64)
    }
  }

  return (
    <View style={styles.container}>
      {image && (
        <>
          <Text>Image preview</Text>
          <Image source={{ uri: image }} style={{ width: 400, height: 200 }} />
        </>
      )}

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
        <TouchableHighlight
          style={styles.uploadBox}
          onPress={() => takePicture()}
        >
          <Icon name="camera" size={50} />
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.uploadBox}
          onPress={() => getPicture()}
        >
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
