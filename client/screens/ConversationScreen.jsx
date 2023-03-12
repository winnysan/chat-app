import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  KeyboardAvoidingView,
} from 'react-native'
import DelayInput from 'react-native-debounce-input'
import { AuthContext } from '../context/AuthProvider'
import { EchoContext } from '../context/EchoProvider'
import axiosConfig from '../helpers/axiosConfig'
import { Ionicons } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'

export default function ConversationScreen({ route, navigation }) {
  const flatlistRef = useRef()
  const echo = useContext(EchoContext)
  const { user } = useContext(AuthContext)
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [body, setBody] = useState('test body M phone')
  const [message, setMessage] = useState(null)
  const [newUsers, setNewUsers] = useState(null)

  // search user start
  const [suggestions, setSuggestions] = useState([])
  const [users, setUsers] = useState([])
  // search user end

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chat title',
      headerBackTitleVisible: false,
      headerRight: ({ color }) => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 64,
          }}
        >
          <TouchableOpacity>
            <Ionicons name='person-add-outline' size={24} color={color} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo name='dots-three-vertical' size={24} color={color} />
          </TouchableOpacity>
        </View>
      ),
    })
  })

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
    Keyboard.dismiss()
    setBody(null)
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
      <Text style={styles.messageMeta}>{user.id === item.user_id ? 'Ja' : item.user.name}</Text>
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* <Text style={{ alignSelf: 'center' }}>{route.params.uuid}</Text> */}
          {/* {data.users && (
          <View>
            {data.users.map(item => (
              <Text key={item.id}>{user.id === item.id ? 'Ja' : item.name}</Text>
            ))}
          </View>
        )} */}
          {/* search user start */}
          {/* <View style={{ margin: 10 }}>
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
        </View> */}
          {/* search user end */}
          <>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                ref={flatlistRef}
                style={{ margin: 10 }}
                data={data.messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                onContentSizeChange={() => flatlistRef.current.scrollToEnd()}
              />
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                padding: 15,
              }}
            >
              <TextInput
                onChangeText={text => setBody(text)}
                onSubmitEditing={() => sendMessage()}
                value={body}
                placeholder='type...'
                style={styles.inputText}
              />
              <TouchableOpacity onPress={() => sendMessage()}>
                <Ionicons name='paper-plane-outline' size={24} color='#000' />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  message: {
    padding: 15,
    backgroundColor: '#000',
    alignSelf: 'flex-start',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#000',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  messageBody: {
    color: '#fff',
  },
  ownMessageBody: { color: '#000' },
  messageMeta: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    position: 'absolute',
    paddingHorizontal: 10,
    bottom: -10,
  },
  inputText: {
    bottom: 0,
    height: 40,
    flexGrow: 1,
    marginRight: 10,
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    borderRadius: 30,
  },
})
