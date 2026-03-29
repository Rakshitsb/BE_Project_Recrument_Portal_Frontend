import { Outlet } from 'react-router-dom'

/**
 * AuthLayout
 * Wraps public pages (login, register) in a centred gradient background.
 */
function AuthLayout() {
  return (
    <div className="auth-wrapper">
      <Outlet />
    </div>
  )
}

export default AuthLayout
