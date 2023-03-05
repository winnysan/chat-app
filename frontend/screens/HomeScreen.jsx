import { useContext, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { AuthContext } from '../context/AuthProvider'
import { EchoContext } from '../context/EchoProvider'
import axiosConfig from '../helpers/axiosConfig'

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const echo = useContext(EchoContext)

  useEffect(() => {
    getConversations()

    // laravel echo test http://10.168.2.4/public/broadcast
    // echo.channel('things').listen('NewThingAvailable', event => {
    //   console.info('event', event)
    // })
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

  function gotoNewConversation() {
    navigation.navigate('NewConversation')
  }

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={{ backgroundColor: '#fff', margin: 10 }}
      onPress={() => gotoConversation(item.uuid)}
    >
      <Text>{item.uuid}</Text>
      {item.users.map(conversationUser => (
        <View key={conversationUser.id}>
          {user.id === conversationUser.id ? <Text>Ja</Text> : <Text>{conversationUser.name}</Text>}
        </View>
      ))}
      <View>
        {!item.pivot.read_at && <Text>●</Text>}
        <Text>last message: {item.lastMessage.body}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList data={data} renderItem={renderConversation} keyExtractor={item => item.id} />
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={() => gotoNewConversation()}>
        <AntDesign name='plus' size={24} color='#fff' />
      </TouchableOpacity>
      <Button onPress={() => logout()} title='Logout' />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0055b3',
    position: 'absolute',
    bottom: 80,
    right: 20,
  },
})
