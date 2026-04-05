import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

/**
 * HRSetupGuard
 * Redirects HR users to /hr-profile-setup if they
 * have not yet completed their company profile.
 * Checks user.profileCompleted flag set by useAuth.
 *
 * Uses strict false check (=== false) so that:
 *   - profileCompleted: false  → redirect to HR setup (new users)
 *   - profileCompleted: true   → allow through (returning users)
 *   - profileCompleted: undefined → allow through (safety fallback)
 */
function HRSetupGuard() {
  const { user } = useAuthStore()

  // If profileCompleted is explicitly false → redirect to HR profile setup
  // Any other value (true, undefined) → allow through
  if (user?.profileCompleted === false) {
    return <Navigate to="/hr-profile-setup" replace />
  }

  return <Outlet />
}

export default HRSetupGuard
