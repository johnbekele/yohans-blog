import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'
import { logError, getErrorMessage } from '../utils/errorHandler'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is logged in on mount
    try {
      const token = authService.getAccessToken()
      const storedUser = authService.getStoredUser()
      
      if (token && storedUser) {
        setUser(storedUser)
      }
    } catch (err) {
      logError('AuthContext.init', err)
      // Clear potentially corrupted data
      authService.logout()
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await authService.login(email, password)
      setUser(response.user)
      return response
    } catch (error) {
      const errorMsg = getErrorMessage(error)
      setError(errorMsg)
      logError('AuthContext.login', error)
      throw new Error(errorMsg)
    }
  }

  const register = async (username, email, password) => {
    try {
      setError(null)
      const response = await authService.register(username, email, password)
      setUser(response.user)
      return response
    } catch (error) {
      const errorMsg = getErrorMessage(error)
      setError(errorMsg)
      logError('AuthContext.register', error)
      throw new Error(errorMsg)
    }
  }

  const logout = () => {
    try {
      authService.logout()
      setUser(null)
      setError(null)
    } catch (err) {
      logError('AuthContext.logout', err)
      // Force logout even if there's an error
      setUser(null)
    }
  }

  const isAdmin = () => {
    return user && user.role === 'admin'
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext

