import axios from 'axios'
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../utils/secureStorage'
import { logError } from '../utils/errorHandler'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    logError('API.request', error)
    return Promise.reject(error)
  }
)

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = getItem(STORAGE_KEYS.REFRESH_TOKEN)
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const { access_token, refresh_token: newRefreshToken } = response.data
          setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
          setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)

          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        logError('API.tokenRefresh', refreshError)
        removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        removeItem(STORAGE_KEYS.USER)
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    // Log non-401 errors in development
    if (error.response?.status !== 401) {
      logError('API.response', error)
    }

    return Promise.reject(error)
  }
)

export default api

