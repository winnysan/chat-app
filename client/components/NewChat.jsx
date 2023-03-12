import { useContext, useState } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import DelayInput from 'react-native-debounce-input'
import { AuthContext } from '../context/AuthProvider'
import axiosConfig from '../helpers/axiosConfig'
import { useNavigation } from '@react-navigation/native'

export default function NewChat() {
  const navigation = useNavigation()
  const { user } = useContext(AuthContext)
  const [suggestions, setSuggestions] = useState([])
  const [body, setBody] = useState(null)
  const [users, setUsers] = useState([])

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

  function gotoConversation(uuid) {
    navigation.navigate('Conversation', { uuid })
  }

  function createConversation() {
    axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    axiosConfig
      .post('/conversations/create', {
        users,
        body,
      })
      .then(response => {
        // console.log('createConversation: ', response.data)
        gotoConversation(response.data.uuid)
      })
      .catch(error => {
        console.error('createConversation error: ', error)
      })
  }

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View style={{ marginBottom: 40 }}>
            <View
              style={{
                margin: 15,
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: '#000',
                borderBottomWidth: 1,
              }}
            >
              <Entypo name='magnifying-glass' size={24} color='#000' />
              <DelayInput
                delayTimeout={500}
                minLength={1}
                onChangeText={event => searchUser(event)}
                placeholder='find user...'
                style={{
                  bottom: 0,
                  height: 40,
                  flexGrow: 1,
                  paddingHorizontal: 20,
                  borderRadius: 30,
                }}
              />
            </View>
            <View style={{ paddingHorizontal: 15 }}>
              {suggestions &&
                suggestions.map(suggestion => (
                  <TouchableOpacity
                    key={suggestion.id}
                    onPress={() => addUser(suggestion.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderColor: '#000',
                      borderWidth: 1,
                      borderRadius: 20,
                      padding: 10,
                      marginBottom: 15,
                    }}
                  >
                    <Ionicons name='person-circle-outline' size={24} color='black' />
                    <Text style={{ fontSize: 18, marginLeft: 12 }}>{suggestion.name}</Text>
                  </TouchableOpacity>
                ))}
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
              <Ionicons name='ios-people-outline' size={24} color='#000' style={{ marginTop: 6 }} />
              <View style={{ flexDirection: 'row', flexWrap: 1 }}>
                {users.length > 0 ? (
                  users.map(user => (
                    <TouchableOpacity
                      key={user.id}
                      onPress={() => removeUser(user.id)}
                      style={{
                        flexDirection: 'row',
                        backgroundColor: '#000',
                        alignItems: 'center',
                        borderRadius: 10,
                        padding: 10,
                        marginLeft: 15,
                        marginBottom: 10,
                      }}
                    >
                      <Ionicons name='person-circle-outline' size={16} color='#fff' />
                      <Text style={{ color: '#fff', fontSize: 12, marginLeft: 8 }}>
                        {user.name}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 10,
                      marginLeft: 15,
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons name='sad-outline' size={16} color='#000' />
                    <Text style={{ color: '#000', fontSize: 12, marginLeft: 8 }}>
                      I'm so lonely...
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                padding: 15,
              }}
            >
              <TextInput
                onChangeText={setBody}
                value={body}
                placeholder='type...'
                style={styles.inputText}
              />
              <TouchableOpacity onPress={() => createConversation()}>
                <Ionicons name='paper-plane-outline' size={24} color='#000' />
              </TouchableOpacity>
            </View>
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
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
