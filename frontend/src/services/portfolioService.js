import api from './api'

export const getPortfolio = async () => {
  const response = await api.get('/portfolio')
  return response.data
}

export const getPersonalInfo = async () => {
  const response = await api.get('/portfolio/info')
  return response.data
}

export const getSkills = async () => {
  const response = await api.get('/portfolio/skills')
  return response.data
}

export const getProjects = async () => {
  const response = await api.get('/portfolio/projects')
  return response.data
}

export const getExperience = async () => {
  const response = await api.get('/portfolio/experience')
  return response.data
}

