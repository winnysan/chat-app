import React from 'react'
import { AuthProvider } from './context/AuthProvider'
import Root from './Root'
import { EchoProvider } from './context/EchoProvider'

export default function App() {
  return (
    <AuthProvider>
      <EchoProvider>
        <Root />
      </EchoProvider>
    </AuthProvider>
  )
}
