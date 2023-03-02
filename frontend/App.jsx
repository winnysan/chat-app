import React, { useEffect } from 'react'
import { WS_HOST } from '@env'
import { AuthProvider } from './context/AuthProvider'
import Root from './Root'
import Pusher from 'pusher-js/react-native'
import Echo from 'laravel-echo'
import NetInfo from '@react-native-community/netinfo'
import { Alert } from 'react-native'

export default function App() {
  useEffect(() => {
    Pusher.logToConsole = true

    let PusherClient = new Pusher('local', {
      cluster: 'mt1',
      wsHost: WS_HOST,
      wsPort: '6001',
      enabledTransports: ['ws'],
      forceTLS: false,
      NetInfo,
    })

    let echo = new Echo({
      broadcaster: 'pusher',
      client: PusherClient,
    })

    console.log('Echo', echo)

    echo.channel('things').listen('NewThingAvailable', event => {
      console.log(event)
      Alert.alert(event.message)
    })
  })

  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  )
}
