import { API_URL, WS_HOST } from '@env'
import { createContext } from 'react'
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
  encrypted: true,
  authEndpoint: `${API_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: 'Bearer 22|weAEtY92wOZnyWLLCxhVdyqu7utxLDbOrKDMz9WW',
    },
  },
  NetInfo,
})

let echo = new Echo({
  broadcaster: 'pusher',
  client: PusherClient,
})

export const EchoProvider = ({ children }) => {
  return <EchoContext.Provider value={echo}>{children}</EchoContext.Provider>
}