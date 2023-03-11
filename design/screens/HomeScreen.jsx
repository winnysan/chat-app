import 'react-native-gesture-handler'
import { View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { conversations as data } from '../conversations'
import { Text } from 'react-native'
import { FlatList } from 'react-native'
import { StyleSheet } from 'react-native'

export default function HomeScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerHideShadow: true,
      headerRight: ({ color }) => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 64,
          }}
        >
          <TouchableOpacity>
            <Ionicons name='create-outline' size={24} color={color} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo name='dots-three-vertical' size={24} color='black' />
          </TouchableOpacity>
        </View>
      ),
    })
  })

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => navigation.navigate('Chat')}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 16,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 20,
        marginVertical: 5,
      }}
    >
      <View style={{ position: 'relative' }}>
        <Ionicons name='person-circle-outline' size={48} color='black' />
      </View>
      <View style={{ flexGrow: 1, justifyContent: 'space-around', marginLeft: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          {item.users.map(user => (
            <Text key={user.id} style={{ marginRight: 2, fontSize: 20, fontWeight: 800 }}>
              {user.name},
            </Text>
          ))}
        </View>
        <Text>
          {item.lastMessage.body} ({item.lastMessage.created_at.slice(0, 10)})
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        style={{ backgroundColor: '#fff', margin: 10 }}
        data={data}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})
