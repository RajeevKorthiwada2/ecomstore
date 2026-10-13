import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecomstore_user')
    return saved ? JSON.parse(saved) : null
  })

  const persistSession = (authResponse) => {
    const { token, email, fullName, roles } = authResponse
    const userData = { email, fullName, roles }
    localStorage.setItem('ecomstore_token', token)
    localStorage.setItem('ecomstore_user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    persistSession(data)
    return data
  }

  const register = async (fullName, email, password) => {
    const { data } = await api.post('/auth/register', { fullName, email, password })
    persistSession(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('ecomstore_token')
    localStorage.removeItem('ecomstore_user')
    setUser(null)
  }

  const isAdmin = () => !!user?.roles?.includes('ROLE_ADMIN')

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
