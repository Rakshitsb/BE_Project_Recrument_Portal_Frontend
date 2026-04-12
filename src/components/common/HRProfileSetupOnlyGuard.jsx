import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

/**
 * Allows HR profile setup only while the HR user still has no profile.
 * Once setup is complete, this route redirects permanently to the dashboard.
 */
function HRProfileSetupOnlyGuard() {
  const { user } = useAuthStore()

  if (user?.profileCompleted !== false) {
    return <Navigate to="/hr" replace />
  }

  return <Outlet />
}

export default HRProfileSetupOnlyGuard
