import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  console.log('Axios request, token =', token)
  if (token) {
    cfg.headers['Authorization'] = `Bearer ${token}`
  }
  return cfg
})


export default api
