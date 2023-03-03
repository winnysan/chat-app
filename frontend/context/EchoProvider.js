import { createContext } from 'react'
import { WS_HOST } from '@env'

import { Alert } from 'react-native'

import Pusher from 'pusher-js/react-native'
import Echo from 'laravel-echo'
import NetInfo from '@react-native-community/netinfo'

export const EchoContext = createContext()

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

// console.log('Echo', echo)

// echo.channel('things').listen('NewThingAvailable', event => {
//   console.log(event)
//   Alert.alert(event.message)
// })

export const EchoProvider = ({ children }) => {
  return <EchoContext.Provider value={echo}>{children}</EchoContext.Provider>
}
