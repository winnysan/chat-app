import { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: (email, password) => {
                    // communicate with backend and store token in SecureStore
                    setUser('Marek')
                },
                logout: () => {
                    setUser(null)
                }
            }}>
            {children}
        </AuthContext.Provider>
    )
}