import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
})

api.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_API_KEY

    if (apiKey && config.headers) {
      config.headers['x-api-key'] = apiKey
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 429) {
        console.error('Too many requests, please slow down!')
      }
      if (error.response.status === 401 || error.response.status === 403) {
        console.error('Authentication error or API Key problem!')
      }
    }
    return Promise.reject(error)
  }
)

export default api
