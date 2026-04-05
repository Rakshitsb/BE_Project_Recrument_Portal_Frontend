import axios from 'axios'
import useAuthStore from '../store/authStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor: attach JWT token ─────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response Interceptor: handle 401 globally ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid → force logout
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }

    // Dev helper: warn when the backend is unreachable
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.warn('Network error — is the backend running?')
    }

    return Promise.reject(error)
  },
)

export default api
