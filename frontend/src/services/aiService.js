import api from './api'

export const generateAndPostBlog = async (idea, model = 'gpt') => {
  console.log('📤 DEBUG [aiService]: Sending request', { idea, model })
  const response = await api.post('/ai/generate-and-post', { 
    idea,
    model  // 'gpt' or 'gemini'
  })
  console.log('📥 DEBUG [aiService]: Raw response:', response)
  console.log('📥 DEBUG [aiService]: Response data:', response.data)
  console.log('📥 DEBUG [aiService]: Response data type:', typeof response.data)
  return response.data
}

export const checkGeminiAvailability = async () => {
  try {
    // For now, assume Gemini is available on the backend
    // The backend will return an error if it's not configured
    return { available: true }
  } catch (error) {
    return { available: false }
  }
}
