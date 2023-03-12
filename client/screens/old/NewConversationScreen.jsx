import { useContext, useState } from 'react'
import {
  Button,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { AuthContext } from '../context/AuthProvider'
import axiosConfig from '../helpers/axiosConfig'
import DelayInput from 'react-native-debounce-input'

export default function NewConversationScreen({ navigation }) {
  const { user } = useContext(AuthContext)
  const [suggestions, setSuggestions] = useState([])
  const [body, setBody] = useState('body text...')
  const [users, setUsers] = useState([])

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

  function addUser(userId) {
    if (users.some(user => user.id === userId)) return
    setUsers([...users, suggestions.filter(suggestion => suggestion.id === userId)[0]])
    setSuggestions([])
  }

  function removeUser(userId) {
    setUsers(users.filter(user => user.id !== userId))
  }
  // search user end

  function gotoConversation(uuid) {
    navigation.navigate('Conversation', { uuid })
  }

  function handleSubmit() {
    axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    axiosConfig
      .post('/conversations/create', {
        users,
        body,
      })
      .then(response => {
        // console.log('handleSubmit: ', response.data)
        gotoConversation(response.data.uuid)
      })
      .catch(error => {
        console.error('handleSubmit error: ', error)
      })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* search user start */}
        <View style={{ margin: 10 }}>
          <Text>
            logged user: {user.id} - {user.name}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            {users &&
              users.map(user => (
                <Button key={user.id} title={user.name} onPress={() => removeUser(user.id)} />
              ))}
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
                  onPress={() => addUser(suggestion.id)}
                />
              ))}
          </View>
        </View>
        {/* search user end */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 10,
          }}
        >
          <TextInput
            onChangeText={setBody}
            value={body}
            placeholder='type...'
            placeholderTextColor='gray'
            style={{ flexGrow: 1, backgroundColor: '#fff' }}
          />
          <TouchableOpacity
            style={{ backgroundColor: '#0055b3', padding: 5 }}
            onPress={() => handleSubmit()}
          >
            <Text style={{ color: '#fff' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
