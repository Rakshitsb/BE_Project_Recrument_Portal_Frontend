import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

/**
 * ProtectedRoute
 * Redirects unauthenticated users to /login.
 * Optionally enforces role-based access for child routes.
 *
 * Reads role from the store's dedicated role field first,
 * with user.role as a fallback for backwards compatibility.
 *
 * @param {string[]} allowedRoles - Roles permitted to access child routes
 */
function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, user, role } = useAuthStore()

  // Prefer the dedicated role field; fall back to user.role
  const userRole = role || user?.role

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to the user's actual home based on their role
    const ROLE_HOME = { hr: '/hr', admin: '/admin' }
    const rolePath = ROLE_HOME[userRole] ?? '/candidate'
    return <Navigate to={rolePath} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
