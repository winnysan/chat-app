import { API_URL, WS_HOST } from '@env'
import { createContext, useContext } from 'react'
import Pusher from 'pusher-js/react-native'
import Echo from 'laravel-echo'
import NetInfo from '@react-native-community/netinfo'
import { AuthContext } from './AuthProvider'

export const EchoContext = createContext()

export const EchoProvider = ({ children }) => {
  const { user } = useContext(AuthContext)

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
        Authorization: `Bearer ${user ? user.token : null}`,
      },
    },
    NetInfo,
  })

  let echo = new Echo({
    broadcaster: 'pusher',
    client: PusherClient,
  })

  return <EchoContext.Provider value={echo}>{children}</EchoContext.Provider>
}
