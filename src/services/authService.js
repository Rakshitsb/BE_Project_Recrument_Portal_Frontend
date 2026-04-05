import api from './api'

/**
 * Authentication service
 * Connects to FastAPI backend auth endpoints.
 * Base URL: http://localhost:8000 (set in VITE_API_BASE_URL)
 */

const authService = {

  /**
   * Login an existing user.
   * POST /auth/login
   * @param {{ email: string, password: string }} credentials
   * @returns {{ access_token: string, token_type: string, role: string }}
   */
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    return data
  },

  /**
   * Register a new user (candidate or hr only).
   * POST /auth/signup
   * @param {{ name: string, email: string, password: string, role: string }} payload
   * @returns {{ access_token: string, token_type: string, role: string }}
   *
   * NOTE: Backend returns same shape as login on successful signup.
   * If backend returns only a success message on signup (not a token),
   * handle that in useAuth.js — not here. This function just returns
   * whatever the backend sends.
   */
  register: async (payload) => {
    const { data } = await api.post('/auth/signup', payload)
    return data
  },

}

export default authService
