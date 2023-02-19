import { ActivityIndicator, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext } from './context/AuthProvider'
import { useContext, useEffect, useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import * as SecureStore from 'expo-secure-store'

const Stack = createNativeStackNavigator()

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { user, setUser } = useContext(AuthContext)

  useEffect(() => {
    SecureStore.getItemAsync('user')
      .then(userString => {
        if (userString) {
          setUser(JSON.parse(userString))
        }
        // console.log('SecureStore user: ', userString)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('SecureStore error: ', error)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' color='gray' />
      </View>
    )
  }

  return (
    <>
      {user ? (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='Home' component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='Login' component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  )
}
