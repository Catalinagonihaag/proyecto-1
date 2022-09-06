import React, { useState, useContext } from 'react'
import Background from '../../components/Background'
import Header from '../../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import { AuthContext } from '../../../App'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const { signIn } = useContext(AuthContext);

  const onLoginPressed = () => {
    const emailError = false //emailValidator(email.value)
    const passwordError = false //passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    signIn({ email: email.value, password: password.value })
      .then(e => console.log('Logeado!', e))
      .catch(e => {
        console.error(e.message)
      })
  }

  const autoCompleteFields = (email, password) => {
    setEmail({ value: email, error: '' })
    setPassword({ value: password, error: '' })
  }

  return (
    <Background>
      <Header>Iniciar Sesión</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <Button mode="outlined" onPress={() => autoCompleteFields("tester@gmail.com", "tester")} >
        tester@gmail.com
      </Button>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>


    </Background>
  )
}
