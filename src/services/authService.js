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
   * @returns {{ token: string, user: object }}
   */
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    // Backend returns: access_token, token_type, role
    return {
      token: data.access_token,
      user: {
        email: credentials.email,
        role:  data.role,
      },
    }
  },

  /**
   * Register a new user (candidate or hr only).
   * POST /auth/signup
   * @param {{ name: string, email: string, password: string, role: string }} payload
   * @returns {{ token: string, user: object }}
   */
  register: async (payload) => {
    // payload: { name, email, password, role }
    const { data } = await api.post('/auth/signup', payload)
    return {
      token: data.access_token,
      user: {
        name:  payload.name,
        email: payload.email,
        role:  data.role,
      },
    }
  },

}

export default authService
