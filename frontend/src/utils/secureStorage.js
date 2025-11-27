/**
 * Secure Storage Utility
 * Wraps localStorage with error handling and security best practices
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
}

/**
 * Safely get item from localStorage with error handling
 */
export const getItem = (key) => {
  try {
    const item = localStorage.getItem(key)
    return item
  } catch (error) {
    // Handle localStorage errors (quota exceeded, privacy mode, etc.)
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to read from storage: ${key}`)
      }
    }
    return null
  }
}

/**
 * Safely set item in localStorage with error handling
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    // Handle localStorage errors (quota exceeded, privacy mode, etc.)
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to write to storage: ${key}`)
      }
    }
    return false
  }
}

/**
 * Safely remove item from localStorage
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to remove from storage: ${key}`)
      }
    }
    return false
  }
}

/**
 * Clear all storage
 */
export const clear = () => {
  try {
    localStorage.clear()
    return true
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to clear storage')
      }
    }
    return false
  }
}

/**
 * Parse JSON safely
 */
export const parseJSON = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to parse JSON')
      }
    }
    return fallback
  }
}

export { STORAGE_KEYS }

