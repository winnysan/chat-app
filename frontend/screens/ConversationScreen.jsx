import { useContext, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { AuthContext } from '../context/AuthProvider'
import { EchoContext } from '../context/EchoProvider'
import axiosConfig from '../helpers/axiosConfig'

export default function ConversationScreen({ route, navigation }) {
  const flatlistRef = useRef()
  const echo = useContext(EchoContext)
  const { user } = useContext(AuthContext)
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [body, setBody] = useState('test M phone')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    getConversation()
    echo
      .private(`conversations.${route.params.uuid}`)
      .listen('Conversation\\MessageAdded', event => {
        // console.info('listen event: ', event.message.body)
        setMessage(event.message)
        setAsRead()
      })
    // console.log(`websocket connected: ${echo.socketId()} | conversations.${route.params.uuid}`)

    return () => {
      echo.leave(`conversations.${route.params.uuid}`)
      // console.log(`websocket disconnected`)
    }
  }, [])

  useEffect(() => {
    if (message) {
      appendMessage(message)
    }
    setMessage(null)
  }, [message])

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

  function appendMessage(message) {
    const messages = [...data.messages, message]
    const newData = { ...data, messages }
    setData(newData)
  }

  function setAsRead() {
    axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    axiosConfig
      .patch(`/conversations/${route.params.uuid}`)
      .then(response => {
        // console.info('setMessageAsRead: ', response.data)
      })
      .catch(error => {
        console.error('setMessageAsRead error: ', error.response)
      })
  }

  function sendMessage() {
    axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    axiosConfig.defaults.headers.common['X-Socket-ID'] = echo.socketId() ? echo.socketId() : null
    axiosConfig
      .post(`/conversations/${route.params.uuid}/message`, {
        body,
      })
      .then(response => {
        // console.info('sendMessage: ', response.data.message.body)
        setMessage(response.data.message)
      })
      .catch(error => {
        console.error('sendMessage error: ', error.response.message)
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={{ alignSelf: 'center' }}>{route.params.uuid}</Text>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            ref={flatlistRef}
            style={{ backgroundColor: '#fff', margin: 10 }}
            data={data.messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            onContentSizeChange={() => flatlistRef.current.scrollToEnd()}
          />
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
          <TextInput
            onChangeText={setBody}
            value={body}
            placeholder='type...'
            placeholderTextColor='gray'
            style={{ flexGrow: 1, backgroundColor: '#fff' }}
          />
          <TouchableOpacity
            style={{ backgroundColor: '#0055b3', padding: 5 }}
            onPress={() => sendMessage()}
          >
            <Text style={{ color: '#fff' }}>Send</Text>
          </TouchableOpacity>
        </View>

        <Button title='Go back' onPress={() => navigation.goBack()} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
