import { useContext, useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import { AuthContext } from '../context/AuthProvider'

export default function LoginScreen() {
  const [email, setEmail] = useState('m@r.ek')
  const [password, setPassword] = useState('password')
  const { login } = useContext(AuthContext)
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login Screen</Text>
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder='Email'
        placeholderTextColor='gray'
        textContentType='emailAddress'
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder='Password'
        placeholderTextColor='gray'
        autoCapitalize='none'
        // secureTextEntry={true}
      />
      <Button onPress={() => login(email, password)} title='Login' />
    </View>
  )
}
