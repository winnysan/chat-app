import React, { useEffect } from 'react'
import { AuthProvider } from './context/AuthProvider'
import Root from './Root'
import { EchoProvider } from './context/EchoProvider'
// import Pusher from 'pusher-js/react-native'
// import Echo from 'laravel-echo'
// import NetInfo from '@react-native-community/netinfo'

export default function App() {
  return (
    <AuthProvider>
      <EchoProvider>
        <Root />
      </EchoProvider>
    </AuthProvider>
  )
}
