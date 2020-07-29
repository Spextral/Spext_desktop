import axios from 'axios'

const client = axios.create({
  baseURL: process.env.API_BASE_URL,
})

client.interceptors.request.use((config) => {
  let token = localStorage.getItem('token')
  try {
    token = JSON.parse(token)
  } catch (e) {
    localStorage.removeItem('token')
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client

