import { Outlet } from 'react-router-dom'

/**
 * ProfileSetupGuard
 * Previously redirected candidates to /profile-setup
 * if profileCompleted === false.
 *
 * Profile setup is now accessible via the candidate
 * profile page as an explicit user action.
 * This guard now simply renders child routes.
 */
function ProfileSetupGuard() {
  return <Outlet />
}

export default ProfileSetupGuard
