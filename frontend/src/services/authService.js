import api from './api'

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  const { access_token, refresh_token, user } = response.data
  
  // Store tokens and user info
  localStorage.setItem('access_token', access_token)
  localStorage.setItem('refresh_token', refresh_token)
  localStorage.setItem('user', JSON.stringify(user))
  
  return response.data
}

export const register = async (username, email, password, role = 'user') => {
  const response = await api.post('/auth/register', {
    username,
    email,
    password,
    role,
  })
  const { access_token, refresh_token, user } = response.data
  
  // Store tokens and user info
  localStorage.setItem('access_token', access_token)
  localStorage.setItem('refresh_token', refresh_token)
  localStorage.setItem('user', JSON.stringify(user))
  
  return response.data
}

export const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token')
}

export const getStoredUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const isAuthenticated = () => {
  return !!getAccessToken()
}

