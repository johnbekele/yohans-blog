import api from './api'
import { setItem, getItem, removeItem, parseJSON, STORAGE_KEYS } from '../utils/secureStorage'
import { logError } from '../utils/errorHandler'

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    const { access_token, refresh_token, user } = response.data
    
    // Store tokens and user info securely
    setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
    setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
    setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    
    return response.data
  } catch (error) {
    logError('AuthService.login', error)
    throw error
  }
}

export const register = async (username, email, password, role = 'user') => {
  try {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      role,
    })
    const { access_token, refresh_token, user } = response.data
    
    // Store tokens and user info securely
    setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
    setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
    setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    
    return response.data
  } catch (error) {
    logError('AuthService.register', error)
    throw error
  }
}

export const logout = () => {
  try {
    removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    removeItem(STORAGE_KEYS.USER)
  } catch (error) {
    logError('AuthService.logout', error)
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me')
    return response.data
  } catch (error) {
    logError('AuthService.getCurrentUser', error)
    throw error
  }
}

export const getAccessToken = () => {
  return getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

export const getRefreshToken = () => {
  return getItem(STORAGE_KEYS.REFRESH_TOKEN)
}

export const getStoredUser = () => {
  const user = getItem(STORAGE_KEYS.USER)
  return parseJSON(user, null)
}

export const isAuthenticated = () => {
  return !!getAccessToken()
}

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  } catch (error) {
    logError('AuthService.forgotPassword', error)
    throw error
  }
}

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      new_password: newPassword
    })
    return response.data
  } catch (error) {
    logError('AuthService.resetPassword', error)
    throw error
  }
}

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    })
    return response.data
  } catch (error) {
    logError('AuthService.changePassword', error)
    throw error
  }
}

export const getOAuthUrl = async () => {
  try {
    const response = await api.get('/auth/oauth/google')
    return response.data.auth_url
  } catch (error) {
    logError('AuthService.getOAuthUrl', error)
    throw error
  }
}

export const oauthCallback = async (code) => {
  try {
    const response = await api.post(`/auth/oauth/google/callback?code=${code}`)
    const { access_token, refresh_token, user } = response.data
    
    setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
    setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
    setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    
    return response.data
  } catch (error) {
    logError('AuthService.oauthCallback', error)
    throw error
  }
}

