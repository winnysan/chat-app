import { useContext, useState } from 'react'
import { Button, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../context/AuthProvider'
import axiosConfig from '../helpers/axiosConfig'
import DelayInput from 'react-native-debounce-input'

export default function NewConversationScreen() {
  const { user } = useContext(AuthContext)
  const [suggestions, setSuggestions] = useState([])
  const [body, setBody] = useState('body text...')
  const [users, setUsers] = useState([])

  //   removePeople(e) {
  //     let filteredArray = this.state.people.filter(item => item !== e.target.value)
  //     this.setState({people: filteredArray});
  // }

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
  }

  function removeUser(userId) {
    setUsers(users.filter(user => user.id !== userId))
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
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
          onPress={() => console.log('body: ', body)}
        >
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
