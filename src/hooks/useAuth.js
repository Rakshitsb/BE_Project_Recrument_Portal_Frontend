import { useState, useCallback } from 'react'
import { App } from 'antd'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import authService from '../services/authService'

// ── Mock users for demo (no backend needed) ───────────────────────
const MOCK_USERS = {
  'candidate@demo.com': {
    // profileCompleted: false → ProfileSetupGuard will redirect to /profile-setup
    user:  { id: 1, name: 'Alice Johnson', email: 'candidate@demo.com', role: 'candidate', profileCompleted: false },
    token: 'mock-candidate-jwt-token',
  },
  'hr@demo.com': {
    user:  { id: 2, name: 'Bob Smith', email: 'hr@demo.com', role: 'hr', profileCompleted: true },
    token: 'mock-hr-jwt-token',
  },
}

const MOCK_PASSWORD = 'demo1234'

/**
 * Custom hook encapsulating login / logout / register logic.
 * Separates auth business logic from UI components.
 *
 * Demo credentials (no backend required):
 *   candidate@demo.com / demo1234  → Candidate portal
 *   hr@demo.com        / demo1234  → HR portal
 */
function useAuth() {
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { login: storeLogin, logout: storeLogout, user, token, isAuthenticated } = useAuthStore()

  const login = useCallback(
    async (credentials) => {
      setLoading(true)
      try {
        // ── Mock login check ────────────────────────────────────────
        const mockEntry = MOCK_USERS[credentials.email?.toLowerCase()]
        if (mockEntry && credentials.password === MOCK_PASSWORD) {
          // Simulate a small network delay
          await new Promise((r) => setTimeout(r, 600))
          storeLogin(mockEntry.user, mockEntry.token)
          message.success(`Welcome back, ${mockEntry.user.name}! 👋`)
          navigate(mockEntry.user.role === 'hr' ? '/hr' : '/candidate', { replace: true })
          return
        }

        // ── Real API call (when backend is connected) ───────────────
        const data = await authService.login(credentials)
        storeLogin(data.user, data.token)
        message.success(`Welcome back, ${data.user.name}!`)
        navigate(data.user.role === 'hr' ? '/hr' : '/candidate', { replace: true })
      } catch (err) {
        const msg = err.response?.data?.message || 'Invalid email or password.'
        message.error(msg)
      } finally {
        setLoading(false)
      }
    },
    [storeLogin, navigate, message],
  )

  const register = useCallback(
    async (payload) => {
      setLoading(true)
      try {
        const data = await authService.register(payload)
        storeLogin(data.user, data.token)
        message.success('Account created successfully!')
        navigate(data.user.role === 'hr' ? '/hr' : '/candidate', { replace: true })
      } catch (err) {
        const msg = err.response?.data?.message || 'Registration failed.'
        message.error(msg)
      } finally {
        setLoading(false)
      }
    },
    [storeLogin, navigate, message],
  )

  const logout = useCallback(async () => {
    try { await authService.logout() } catch { /* ignore if no backend */ }
    storeLogout()
    navigate('/login', { replace: true })
    message.success('You have been logged out.')
  }, [storeLogout, navigate, message])

  return { login, register, logout, loading, user, token, isAuthenticated }
}

export default useAuth
