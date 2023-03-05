import { useState } from 'react'
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function NewConversationScreen() {
  const [findUser, setFindUser] = useState('')
  const [body, setBody] = useState('body text...')
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
      <View style={{ margin: 10 }}>
        <TextInput
          onChangeText={setFindUser}
          value={findUser}
          placeholder='find user...'
          placeholderTextColor='gray'
          style={{ flexGrow: 1, backgroundColor: '#fff' }}
        />
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
