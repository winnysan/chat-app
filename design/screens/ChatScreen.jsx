import 'react-native-gesture-handler'
import { View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { Platform } from 'react-native'
import { TextInput } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import { Keyboard } from 'react-native'
import { messages as data } from '../messages'
import { Text } from 'react-native'
import { FlatList } from 'react-native'
import { StyleSheet } from 'react-native'
import { KeyboardAvoidingView } from 'react-native'

export default function ChatScreen({ navigation }) {
  const [input, setInput] = useState('')
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

  function sendMessage() {
    Keyboard.dismiss()
  }

  const renderMessage = ({ item }) => (
    <View
      key={item.id}
      style={item.user_id === 1 ? [styles.message, styles.ownMessage] : styles.message}
    >
      <Text
        style={
          item.user_id === 1 ? [styles.messageBody, styles.ownMessageBody] : styles.messageBody
        }
      >
        {item.body}
      </Text>
      <Text style={styles.messageMeta}>{item.user_id === 1 ? 'Ja' : item.user.name}</Text>
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <>
            <FlatList
              style={{ backgroundColor: '#fff', margin: 10 }}
              data={data}
              renderItem={renderMessage}
              keyExtractor={item => item.id}
            />
            <View
              style={{ flexDirection: 'row', alignItems: 'center', width: '100%', padding: 15 }}
            >
              <TextInput
                value={input}
                onChangeText={text => setInput(text)}
                onSubmitEditing={() => sendMessage()}
                placeholder='Type...'
                style={{
                  bottom: 0,
                  height: 40,
                  flex: 1,
                  marginRight: 15,
                  borderColor: '#000',
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 30,
                }}
              />
              <TouchableOpacity onPress={() => sendMessage()}>
                <Ionicons name='ios-send-outline' size={24} color='#000' />
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
})
