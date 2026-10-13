import axios from 'axios'

// baseURL is "/api" — in dev, vite.config.js proxies this to localhost:8080.
// In production (S3/CloudFront), we'll set VITE_API_BASE_URL to the real
// backend URL (e.g. an ALB/EC2 DNS name) at build time.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
})

// Attach the JWT (if we have one) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecomstore_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the backend ever says "your token is invalid/expired", log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ecomstore_token')
      localStorage.removeItem('ecomstore_user')
    }
    return Promise.reject(error)
  }
)

export default api
