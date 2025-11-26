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
 * Log errors in development mode only
 */
export const logError = (context, error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error)
  }
}

/**
 * Sanitize error for logging (remove sensitive data)
 */
export const sanitizeError = (error) => {
  if (!error) return null
  
  const sanitized = {
    message: error.message,
    status: error.response?.status,
    // Never log response data as it might contain sensitive info
  }
  
  return sanitized
}

