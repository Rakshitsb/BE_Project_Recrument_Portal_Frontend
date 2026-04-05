import { useState, useCallback } from 'react'
import { App } from 'antd'
import { useNavigate } from 'react-router-dom'

import useAuthStore from '../store/authStore'
import authService from '../services/authService'

// ── Role → home route map ─────────────────────────────────────────────
const ROLE_HOME = {
  candidate: '/candidate',
  hr: '/hr',
  admin: '/admin',
}

/**
 * Extracts a human-readable message from a FastAPI error response.
 * Handles both string detail and array detail (validation errors).
 *
 * @param {unknown} err - Axios error object
 * @returns {string} User-friendly error message
 */
const parseApiError = (err) => {
  const detail = err.response?.data?.detail
  if (!detail) return 'Something went wrong. Please try again.'
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(', ')
  return 'Something went wrong. Please try again.'
}

/*
 * ── Auth Flow Documentation ───────────────────────────────────
 *
 * REGISTER (new user):
 *   1. POST /auth/signup → { access_token, token_type, role }
 *   2. Build userData: { name, email, role, profileCompleted: false }
 *   3. storeLogin(userData, access_token)
 *   4. Navigate to /profile-setup (candidate) or /hr-profile-setup (hr)
 *   5. On setup complete: updateUser({ profileCompleted: true })
 *   6. Navigate to /candidate or /hr
 *
 * LOGIN (returning user):
 *   1. POST /auth/login → { access_token, token_type, role }
 *   2. Build userData: { email, role, profileCompleted: true }
 *   3. storeLogin(userData, access_token)
 *   4. Navigate to /candidate, /hr, or /admin based on role
 *   5. Guards allow through (profileCompleted: true)
 *
 * LOGOUT:
 *   1. Clear Zustand store
 *   2. Navigate to /login
 *   (No backend call — backend is stateless JWT)
 *
 * TOKEN EXPIRY:
 *   1. Any API call returns 401
 *   2. Axios interceptor in api.js calls storeLogout()
 *   3. Redirects to /login via window.location.href
 *
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Custom hook encapsulating login / logout / register logic.
 * Wired to the real FastAPI backend via authService.
 * The backend returns { access_token, token_type, role } — no full user
 * object — so we build a minimal userData ourselves.
 */
function useAuth() {
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()
  const navigate = useNavigate()
  const {
    login: storeLogin,
    logout: storeLogout,
    user,
    token,
    isAuthenticated,
  } = useAuthStore()

  /**
   * Log in an existing user.
   * Builds userData from credentials.email + response role.
   *
   * @param {{ email: string, password: string }} credentials
   */
  const login = useCallback(
    async (credentials) => {
      setLoading(true)
      try {
        const data = await authService.login(credentials)

        const userData = {
          email: credentials.email,
          role: data.role,
          name: credentials.email.split('@')[0], // fallback display name
          profileCompleted: true,                 // returning user — skip setup
        }

        storeLogin(userData, data.access_token)
        message.success('Welcome back!')
        navigate(ROLE_HOME[data.role] ?? '/candidate', { replace: true })
      } catch (err) {
        message.error(parseApiError(err))
      } finally {
        setLoading(false)
      }
    },
    [storeLogin, navigate, message],
  )

  /**
   * Register a new user (candidate or hr).
   * Builds userData from payload fields + response role.
   * Redirects to role-specific profile setup after registration.
   *
   * @param {{ name: string, email: string, password: string, role: string }} payload
   */
  const register = useCallback(
    async (payload) => {
      setLoading(true)
      try {
        const data = await authService.register(payload)

        const userData = {
          name: payload.name,
          email: payload.email,
          role: data.role,
          profileCompleted: false,  // new user — must complete setup
        }

        storeLogin(userData, data.access_token)
        message.success('Account created successfully!')

        // Redirect to profile setup based on role
        if (data.role === 'candidate') {
          navigate('/profile-setup', { replace: true })
        } else if (data.role === 'hr') {
          navigate('/hr-profile-setup', { replace: true })
        } else {
          navigate(ROLE_HOME[data.role] ?? '/candidate', { replace: true })
        }
      } catch (err) {
        message.error(parseApiError(err))
      } finally {
        setLoading(false)
      }
    },
    [storeLogin, navigate, message],
  )

  /**
   * Log out the current user.
   * No API call needed — backend has no /auth/logout endpoint.
   */
  const logout = useCallback(() => {
    storeLogout()
    navigate('/login', { replace: true })
    message.success('You have been logged out.')
  }, [storeLogout, navigate, message])

  return { login, register, logout, loading, user, token, isAuthenticated }
}

export default useAuth
