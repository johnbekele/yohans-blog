/**
 * Error Handler Utility
 * Centralized error handling with user-friendly messages
 */

/**
 * Extract user-friendly error message from API error
 */
export const getErrorMessage = (error) => {
  // Handle different error scenarios
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response
    
    if (status === 401) {
      return 'Authentication failed. Please login again.'
    }
    
    if (status === 403) {
      return 'You do not have permission to perform this action.'
    }
    
    if (status === 404) {
      return 'The requested resource was not found.'
    }
    
    if (status === 500) {
      return 'Server error. Please try again later.'
    }
    
    // Use backend error message if available
    return data?.detail || data?.message || 'An error occurred. Please try again.'
  }
  
  if (error.request) {
    // Request made but no response
    return 'Unable to reach the server. Please check your internet connection.'
  }
  
  // Something else happened
  return error.message || 'An unexpected error occurred. Please try again.'
}

/**
 * Sanitize error for logging (remove sensitive data)
 */
export const sanitizeError = (error) => {
  if (!error) return null
  
  // Create a safe error object without sensitive data
  const sanitized = {
    message: error.message || 'Unknown error',
    status: error.response?.status,
    statusText: error.response?.statusText,
    // Never log: request data, response data, tokens, passwords, user data
  }
  
  // Remove any potential sensitive fields
  if (error.config) {
    sanitized.url = error.config.url
    sanitized.method = error.config.method
    // Don't log headers, data, or params as they may contain sensitive info
  }
  
  return sanitized
}

/**
 * Log errors in development mode only with sanitized data
 */
export const logError = (context, error) => {
  if (process.env.NODE_ENV === 'development') {
    const sanitized = sanitizeError(error)
    console.error(`[${context}]`, sanitized)
  }
  // In production, errors are silently handled - no console logging
}

