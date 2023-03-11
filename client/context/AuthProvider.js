import { createContext, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import axiosConfig from '../helpers/axiosConfig'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        isLoading,
        login: (email, password) => {
          setIsLoading(true)
          axiosConfig
            .post('/login', {
              email,
              password,
              device_name: 'mobile',
            })
            .then(response => {
              const userResponse = {
                token: response.data.token,
                id: response.data.user.id,
                name: response.data.user.name,
                email: response.data.user.email,
              }
              // console.log('Login user: ', response.data.user.name)
              setUser(userResponse)
              setError(null)
              SecureStore.setItemAsync('user', JSON.stringify(userResponse))
              setIsLoading(false)
            })
            .catch(error => {
              console.error('Login error: ', error.response)
              setError(error.response.data.message)
              setIsLoading(false)
            })
        },
        logout: () => {
          setIsLoading(true)
          axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
          axiosConfig
            .post('/logout')
            .then(response => {
              // console.log('Logout: ', response.data)
              setUser(null)
              SecureStore.deleteItemAsync('user')
              setError(null)
              setIsLoading(false)
            })
            .catch(error => {
              console.error('Logout error: ', error.response)
              setUser(null)
              SecureStore.deleteItemAsync('user')
              setError(error.response.data.message)
              setIsLoading(false)
            })
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
