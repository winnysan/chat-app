import { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native'
import { AuthContext } from '../context/AuthProvider'
import axiosConfig from '../helpers/axiosConfig'

export default function ConversationScreen({ route, navigation }) {
  const { user } = useContext(AuthContext)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getConversation()
  }, [])

  function getConversation() {
    setIsLoading(true)
    axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    axiosConfig
      .get(`/conversations/${route.params.uuid}`)
      .then(response => {
        // console.log('Conversation: ', response.data.conversation)
        setData(response.data.conversation)
      })
      .catch(error => {
        console.error('Conversation error: ', error.response.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const renderMessage = ({ item }) => (
    <View style={user.id === item.user_id ? [styles.message, styles.ownMessage] : styles.message}>
      <Text
        style={
          user.id === item.user_id
            ? [styles.messageBody, styles.ownMessageBody]
            : styles.messageBody
        }
      >
        {item.body}
      </Text>
      {user.id === item.user_id ? <Text>Ja</Text> : <Text>{item.user.name}</Text>}
    </View>
  )

  return (
    <View style={{ flex: 1 }}>
      <Text>conversation: {route.params.uuid}</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={{ backgroundColor: '#fff' }}
          data={data.messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
        />
      )}

      <Button title='Go back' onPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  message: {
    alignSelf: 'flex-start',
    margin: 5,
  },
  ownMessage: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  messageBody: {
    backgroundColor: '#2f2f2f',
    color: '#fff',
    padding: 10,
  },
  ownMessageBody: { backgroundColor: '#0055b3' },
})
