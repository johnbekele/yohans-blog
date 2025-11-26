/**
 * Input Sanitization Utility
 * Prevents XSS and other injection attacks
 */

/**
 * Sanitize HTML to prevent XSS
 * Escapes dangerous HTML characters
 */
export const sanitizeHTML = (str) => {
  if (!str) return ''
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  
  return String(str).replace(/[&<>"'/]/g, (char) => map[char])
}

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
 */
export const isValidURL = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Sanitize user input (remove potentially dangerous characters)
 */
export const sanitizeInput = (input, maxLength = 1000) => {
  if (!input) return ''
  
  // Trim whitespace
  let sanitized = String(input).trim()
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '')
  
  return sanitized
}

/**
 * Validate slug format (URL-safe string)
 */
export const isValidSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

/**
 * Sanitize filename
 */
export const sanitizeFilename = (filename) => {
  if (!filename) return ''
  
  // Remove path traversal attempts
  return filename
    .replace(/\.\./g, '')
    .replace(/[/\\]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
}

/**
 * Validate and sanitize markdown content
 * Allows safe markdown but prevents script injection
 */
export const sanitizeMarkdown = (markdown) => {
  if (!markdown) return ''
  
  // Remove inline scripts
  let sanitized = markdown.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove inline event handlers
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '')
  sanitized = sanitized.replace(/on\w+='[^']*'/gi, '')
  
  // Remove javascript: protocols
  sanitized = sanitized.replace(/javascript:/gi, '')
  
  return sanitized
}

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const errors = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Remove excessive whitespace from text
 */
export const normalizeWhitespace = (text) => {
  if (!text) return ''
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Validate integer within range
 */
export const validateInteger = (value, min = -Infinity, max = Infinity) => {
  const num = parseInt(value, 10)
  return !isNaN(num) && num >= min && num <= max
}

/**
 * Sanitize search query
 */
export const sanitizeSearchQuery = (query) => {
  if (!query) return ''
  
  // Remove special regex characters to prevent ReDoS
  return query
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, '')
    .substring(0, 100) // Limit length
}

