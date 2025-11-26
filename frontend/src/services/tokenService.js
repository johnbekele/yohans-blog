import api from './api'

export const saveToken = async (token) => {
  const response = await api.post('/token/save', { token })
  return response.data
}

export const getTokenStatus = async () => {
  const response = await api.get('/token/status')
  return response.data
}

export const removeToken = async () => {
  const response = await api.delete('/token/remove')
  return response.data
}

