import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Auth Store
 * Persists user/token to localStorage via zustand/persist middleware.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      /** Called after a successful login API response */
      login: (userData, token) =>
        set({
          user: userData,
          token,
          isAuthenticated: true,
        }),

      /** Clears session on logout */
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      /** Update user profile fields */
      updateUser: (fields) =>
        set((state) => ({
          user: { ...state.user, ...fields },
        })),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export default useAuthStore
