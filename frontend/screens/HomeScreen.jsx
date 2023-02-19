import { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, FlatList, Text, View } from 'react-native'
import { AuthContext } from '../context/AuthProvider'
import axiosConfig from '../helpers/axiosConfig'

export default function HomeScreen({ navigation }) {
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
        // console.log('Conversations: ', response.data.conversations)
        setData(response.data.conversations)
      })
      .catch(error => {
        console.error('Conversations error: ', error.response)
      })
      .finally(() => setIsLoading(false))
  }

  function gotoConversation(uuid) {
    navigation.navigate('Conversation', { uuid })
  }

  const renderConversation = ({ item }) => (
    <View>
      <Text>{item.uuid}</Text>
      <Button title='Go to Conversation' onPress={() => gotoConversation(item.uuid)} />
      {item.users.map(conversationUser => (
        <View key={conversationUser.id}>
          {user.id === conversationUser.id ? <Text>Ja</Text> : <Text>{conversationUser.name}</Text>}
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
