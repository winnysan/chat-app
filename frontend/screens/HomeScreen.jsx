import { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, FlatList, Text, View } from 'react-native'
import { AuthContext } from '../context/AuthProvider'
import axiosConfig from '../helpers/axiosConfig'

export default function HomeScreen() {
  const { user, logout } = useContext(AuthContext)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getConversations()
  }, [])

  function getConversations() {
    setIsLoading(true)
    axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    axiosConfig
      .get('/conversations')
      .then(response => {
        console.log('Conversations: ', response.data.conversations)
        setData(response.data.conversations)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Conversations error: ', error.response)
        setIsLoading(false)
      })
  }

  const renderConversation = ({ item }) => (
    <View>
      <Text>{item.uuid}</Text>
      {item.users.map(user => (
        <View key={user.id}>
          <Text>{user.name}</Text>
        </View>
      ))}
      <Text>Message body</Text>
    </View>
  )

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Conversations:</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          renderItem={renderConversation}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={<Text>---</Text>}
        />
      )}
      <Button onPress={() => logout()} title='Logout' />
    </View>
  )
}
