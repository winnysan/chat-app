import { useContext, useEffect } from 'react'
import { Button, Text, View } from 'react-native'
import { AuthContext } from '../context/AuthProvider'
import axiosConfig from '../helpers/axiosConfig'

export default function HomeScreen() {
  const { user, logout } = useContext(AuthContext)

  useEffect(() => {
    // console.log('User from secure store: ', user.name)
    // axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    // axiosConfig
    //   .get('/user')
    //   .then(response => {
    //     console.log('Get user from api: ', response.data)
    //   })
    //   .catch(error => {
    //     console.error('Get user from api error: ', error.response)
    //   })
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => logout()} title='Logout' />
    </View>
  )
}
