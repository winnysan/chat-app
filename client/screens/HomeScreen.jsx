import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons, Entypo } from '@expo/vector-icons'
import { AuthContext } from '../context/AuthProvider'
import { EchoContext } from '../context/EchoProvider'
import axiosConfig from '../helpers/axiosConfig'
import { Modalize } from 'react-native-modalize'
import NewChat from '../components/NewChat'

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [createdConversation, setCreatedConversation] = useState(null)
  const [updatedConversation, setUpdatedConversation] = useState(null)
  const modalizeRef = useRef(null)

  const echo = useContext(EchoContext)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: null,
      headerHideShadow: true,
      headerRight: ({ color }) => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 64,
          }}
        >
          <TouchableOpacity onPress={() => onOpen()}>
            <Ionicons name='create-outline' size={24} color={color} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => logout()}>
            <Entypo name='dots-three-vertical' size={24} color='black' />
          </TouchableOpacity>
        </View>
      ),
    })
  })

  useEffect(() => {
    getConversations()

    echo
      .private(`users.${user.id}`)
      .listen('Conversation\\ConversationCreated', event => {
        // console.info('listenConversationCreated: ', event.conversation.lastMessage.body)
        setCreatedConversation(event.conversation)
      })
      .listen('Conversation\\ConversationUpdated', event => {
        // console.info('listenConversationUpdated: ', event.conversation.lastMessage.body)
        setUpdatedConversation(event.conversation)
      })
    // console.log(`echo.private: users.${user.id}`)

    return () => {
      echo.leave(`users.${user.id}`)
      // console.log(`echo.leave: users.${user.id}`)
    }
  }, [])

  useEffect(() => {
    if (createdConversation) {
      appendConversation(createdConversation)
    }
    setCreatedConversation(null)
  }, [createdConversation])

  useEffect(() => {
    if (updatedConversation) {
      updateConversation(updatedConversation)
    }
    setUpdatedConversation(null)
  }, [updatedConversation])

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

  function appendConversation(conversation) {
    const newData = [...data, conversation]
    setData(newData)
  }

  function updateConversation(event) {
    // console.info('updateConversation: ', event.lastMessage.body)
    const newData = data.map(conversation => {
      if (conversation.id === event.id) {
        conversation = event
      }

      return conversation
    })
    setData(newData)
  }

  function gotoConversation(uuid) {
    navigation.navigate('Conversation', { uuid })
  }

  function gotoNewConversation() {
    navigation.navigate('NewConversation')
  }

  function onOpen() {
    modalizeRef.current?.open()
  }

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 16,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 20,
        marginVertical: 5,
      }}
      onPress={() => gotoConversation(item.uuid)}
    >
      <View style={{ alignItems: 'flex-start' }}>
        <Ionicons name='person-circle-outline' size={48} color='black' />
      </View>
      <View style={{ flexGrow: 1, justifyContent: 'space-around', marginLeft: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          {item.users.map(
            u =>
              user.id === u.id &&
              !u.pivot.read_at && (
                <Text key={u.id} style={{ marginRight: 8, fontSize: 20 }}>
                  ●
                </Text>
              )
          )}
          {item.users.map(u => (
            <Text key={u.id} style={{ marginRight: 2, fontSize: 20, fontWeight: 'bold' }}>
              {user.id === u.id ? 'Ja' : u.name},
            </Text>
          ))}
        </View>
        <Text>
          {item.lastMessage.body} ({item.lastMessage.created_at.slice(0, 10)})
        </Text>
        <Text>{item.uuid}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            style={{ padding: 10 }}
            renderItem={renderConversation}
            keyExtractor={item => item.id}
            refreshing={false}
            onRefresh={() => getConversations()}
          />
        )}
        <Modalize
          ref={modalizeRef}
          disableScrollIfPossible
          adjustToContentHeight
          keyboardAvoidingOffset={60}
        >
          <NewChat />
        </Modalize>
      </>
    </SafeAreaView>
  )
}
