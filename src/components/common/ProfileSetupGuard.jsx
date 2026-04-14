import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

/**
 * ProfileSetupGuard
 * Redirects candidates to profile setup if they
 * have not yet completed their profile.
 */
function ProfileSetupGuard() {
  const { user } = useAuthStore()
  const location = useLocation()

  // Allow the setup page itself; redirect only when on other candidate pages
  if (user?.profileCompleted === false && location.pathname !== '/candidate/profile/setup') {
    return <Navigate to="/candidate/profile/setup" replace />
  }

  return <Outlet />
}

export default ProfileSetupGuard
