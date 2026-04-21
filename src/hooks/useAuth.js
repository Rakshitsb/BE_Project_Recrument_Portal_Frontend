import { useState, useCallback } from 'react'
import { App } from 'antd'
import { useNavigate } from 'react-router-dom'

import useAuthStore from '../store/authStore'
import authService from '../services/authService'
import { hrProfileService } from '../services'
import profileService from '../services/profileService'

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
 *   1. POST /auth/signup
 *   2. Show success message
 *   3. Redirect to /login
 *   4. Do not auto-login after registration
 *
 * LOGIN (returning user):
 *   1. POST /auth/login → { access_token, token_type, role }
 *   2. For HR users, GET /hr/profile to determine whether setup is complete
 *   3. storeLogin(userData, access_token)
 *   4. Navigate to /hr-profile-setup only when the HR profile does not exist
 *   5. Otherwise navigate to role home
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
        // authService.login returns { token, user: { email, role } }
        const { token, user } = await authService.login(credentials)
        let profileCompleted = true

        if (user.role === 'hr') {
          try {
            const hrProfile = await hrProfileService.getProfile(token)
            profileCompleted = Boolean(hrProfile)
          } catch (err) {
            // 404 = profile not created yet (new HR user)
            // 403 = role mismatch in DB (treat same as not-set-up)
            if (err.response?.status === 404 || err.response?.status === 403) {
              profileCompleted = false
            } else {
              throw err
            }
          }
        }

        if (user.role === 'candidate') {
          try {
            const candidateProfile = await profileService.getProfile(token)
            profileCompleted = Boolean(candidateProfile)
          } catch (err) {
            if (err.response?.status === 404) {
              profileCompleted = false
            } else {
              throw err
            }
          }
        }

        const userData = {
          email:            user.email,
          role:             user.role,
          name:             credentials.email.split('@')[0], // fallback display name
          profileCompleted,
        }

        storeLogin(userData, token)
        message.success('Welcome back!')

        if (user.role === 'hr' && !profileCompleted) {
          navigate('/hr-profile-setup', { replace: true })
          return
        }

        if (user.role === 'candidate' && !profileCompleted) {
          message.warning('Please complete your profile first to proceed.')
          navigate('/candidate/profile/setup', { replace: true })
          return
        }

        navigate(ROLE_HOME[user.role] ?? '/candidate', { replace: true })
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
   * Shows a success message and redirects to login.
   *
   * @param {{ name: string, email: string, password: string, role: string }} payload
   */
  const register = useCallback(
    async (payload) => {
      setLoading(true)
      try {
        await authService.register(payload)
        message.success('Account created successfully! Please sign in to continue.')
        navigate('/login', { replace: true })
      } catch (err) {
        message.error(parseApiError(err))
      } finally {
        setLoading(false)
      }
    },
    [navigate, message],
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
