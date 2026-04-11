import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

/**
 * ProfileSetupGuard
 * Redirects candidates to profile setup if they
 * have not yet completed their profile.
 */
function ProfileSetupGuard() {
  const { user } = useAuthStore()

  if (user?.profileCompleted === false) {
    return <Navigate to="/candidate/profile/setup" replace />
  }

  return <Outlet />
}

export default ProfileSetupGuard
