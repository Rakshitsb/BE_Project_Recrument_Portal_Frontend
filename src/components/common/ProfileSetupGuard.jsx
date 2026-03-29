import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

/**
 * ProfileSetupGuard
 * Redirects candidate users to /profile-setup if their profile
 * is not yet completed (user.profileCompleted === false).
 *
 * Should wrap candidate-only protected routes in AppRoutes.
 */
function ProfileSetupGuard() {
  const { user } = useAuthStore()

  // If profileCompleted is explicitly false, redirect to setup
  if (user && user.profileCompleted === false) {
    return <Navigate to="/profile-setup" replace />
  }

  return <Outlet />
}

export default ProfileSetupGuard
