import api from './api'

export const getPosts = async (params = {}) => {
  const response = await api.get('/posts', { params })
  return response.data
}

export const getPostBySlug = async (slug) => {
  const response = await api.get(`/posts/${slug}`)
  return response.data
}

export const createPost = async (postData) => {
  const response = await api.post('/posts', postData)
  return response.data
}

export const updatePost = async (slug, postData) => {
  const response = await api.put(`/posts/${slug}`, postData)
  return response.data
}

export const deletePost = async (slug) => {
  await api.delete(`/posts/${slug}`)
}

export const getAllTags = async () => {
  const response = await api.get('/posts/tags/all')
  return response.data
}

export const getAllCategories = async () => {
  const response = await api.get('/posts/categories/all')
  return response.data
}

