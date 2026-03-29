import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

/**
 * ProtectedRoute
 * Redirects unauthenticated users to /login.
 * Optionally checks role-based access.
 *
 * @param {string[]} allowedRoles - Roles that may access child routes
 */
function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to the user's home based on their actual role
    const rolePath = user?.role === 'hr' ? '/hr' : '/candidate'
    return <Navigate to={rolePath} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
