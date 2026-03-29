import api from './api'

export const authService = {
  /**
   * Login user
   * @param {{ email: string, password: string }} credentials
   */
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    return data
  },

  /**
   * Register new user
   * @param {{ name: string, email: string, password: string, role: string }} payload
   */
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    return data
  },

  /**
   * Fetch current user profile
   */
  getProfile: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },

  /**
   * Logout (optional server-side call)
   */
  logout: async () => {
    await api.post('/auth/logout').catch(() => {}) // soft-fail
  },
}

export default authService
