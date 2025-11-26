import api from './api'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const generateBlogPost = async (idea) => {
  const response = await api.post(`${API_BASE}/ai/generate`, { idea })
  return response.data
}

export const generateAndPostBlog = async (idea) => {
  const response = await api.post(`${API_BASE}/ai/generate-and-post`, { idea })
  return response.data
}

