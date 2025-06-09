import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
})

// przed każdym żądaniem doklej token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  console.log('Axios request, token =', token)        // debug
  if (token) {
    cfg.headers['Authorization'] = `Bearer ${token}`
  }
  return cfg
})


export default api
