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
import DelayInput from 'react-native-debounce-input'
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
  const [newUsers, setNewUsers] = useState(null)

  // search user start
  const [suggestions, setSuggestions] = useState([])
  const [users, setUsers] = useState([])
  // search user end

  useEffect(() => {
    getConversation()
    echo
      .private(`conversations.${route.params.uuid}`)
      .listen('Conversation\\MessageAdded', event => {
        // console.info('Conversation\\MessageAdded: ', event.message.body)
        setMessage(event.message)
        setAsRead()
      })
      .listen('Conversation\\UsersAdded', event => {
        // console.info('Conversation\\UsersAdded: ', event)
        setNewUsers(event.users)
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

  useEffect(() => {
    if (newUsers) {
      setNewUsersToConversation(newUsers)
    }
    setNewUsers(null)
  }, [newUsers])

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

  // search user start
  function searchUser(event) {
    if (!event) {
      setSuggestions([])
      return
    }

    axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    axiosConfig
      .get(`/search/users?q=${event}`)
      .then(response => {
        // console.log('search users: ', response.data)
        setSuggestions(response.data)
      })
      .catch(error => {
        console.error('searchUser error: ', error)
      })
  }

  function addUserToSuggestions(userId) {
    if (users.some(user => user.id === userId)) return
    setUsers([...users, suggestions.filter(suggestion => suggestion.id === userId)[0]])
    setSuggestions([])
  }

  function removeUserFromSuggestions(userId) {
    setUsers(users.filter(user => user.id !== userId))
  }
  // search user end

  function addUserToConversation() {
    axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    axiosConfig.defaults.headers.common['X-Socket-ID'] = echo.socketId() ? echo.socketId() : null
    axiosConfig
      .post(`/conversations/${route.params.uuid}/adduser`, {
        users,
      })
      .then(response => {
        // console.log('addUserToConversation: ', response.data)
        setUsers([])
      })
      .catch(error => {
        console.error('addUserToConversation error: ', error.response)
      })
  }

  function setNewUsersToConversation(newUsers) {
    const users = newUsers
    const newData = { ...data, users }
    setData(newData)
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
        {data.users && (
          <View>
            {data.users.map(item => (
              <Text key={item.id}>{user.id === item.id ? 'Ja' : item.name}</Text>
            ))}
          </View>
        )}
        {/* search user start */}
        <View style={{ margin: 10 }}>
          <Text>
            logged user: {user.id} - {user.name}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            {users &&
              users.map(user => (
                <Button
                  key={user.id}
                  title={user.name}
                  onPress={() => removeUserFromSuggestions(user.id)}
                />
              ))}
            {users.length > 0 && (
              <Button title={'Add user'} onPress={() => addUserToConversation()} />
            )}
          </View>
          <DelayInput
            delayTimeout={500}
            minLength={1}
            onChangeText={event => searchUser(event)}
            placeholder='find user...'
            placeholderTextColor='gray'
            style={{ flexGrow: 1, backgroundColor: '#fff' }}
          />
          <View style={{ flexDirection: 'row' }}>
            {suggestions &&
              suggestions.map(suggestion => (
                <Button
                  key={suggestion.id}
                  title={suggestion.name}
                  onPress={() => addUserToSuggestions(suggestion.id)}
                />
              ))}
          </View>
        </View>
        {/* search user end */}
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
