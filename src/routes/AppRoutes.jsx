import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import MainLayout    from '../layouts/MainLayout'
import AuthLayout    from '../layouts/AuthLayout'
import ProtectedRoute       from '../components/common/ProtectedRoute'
import ProfileSetupGuard    from '../components/common/ProfileSetupGuard'

// ── Lazy-loaded pages ─────────────────────────────────────────────
const LoginPage     = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage  = lazy(() => import('../pages/auth/RegisterPage'))
const ProfileSetup  = lazy(() => import('../pages/candidate/ProfileSetup'))

// Candidate pages
const CandidateDashboard = lazy(() => import('../pages/candidate/CandidateDashboard'))
const JobsPage           = lazy(() => import('../pages/candidate/Jobs'))
const MyApplications     = lazy(() => import('../pages/candidate/MyApplications'))

// HR pages
const HRDashboard  = lazy(() => import('../pages/hr/HRDashboard'))
const ManageJobs   = lazy(() => import('../pages/hr/ManageJobs'))
const Applications = lazy(() => import('../pages/hr/Applications'))

// ── Loading fallback ──────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex-center" style={{ minHeight: '100vh' }}>
    <Spin size="large" tip="Loading..." />
  </div>
)

// ── Routes ────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public / Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Profile Setup — authenticated, any role, no layout shell */}
        <Route element={<ProtectedRoute allowedRoles={[]} />}>
          <Route path="/profile-setup" element={<ProfileSetup />} />
        </Route>

        {/* Candidate protected routes (also checks profile completion) */}
        <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
          <Route element={<ProfileSetupGuard />}>
            <Route element={<MainLayout role="candidate" />}>
              <Route path="/candidate"              element={<CandidateDashboard />} />
              <Route path="/candidate/jobs"         element={<JobsPage />} />
              <Route path="/candidate/applications" element={<MyApplications />} />
            </Route>
          </Route>
        </Route>

        {/* Public jobs landing (reuses candidate layout + guard) */}
        <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
          <Route element={<ProfileSetupGuard />}>
            <Route element={<MainLayout role="candidate" />}>
              <Route path="/jobs" element={<JobsPage />} />
            </Route>
          </Route>
        </Route>

        {/* HR protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['hr']} />}>
          <Route element={<MainLayout role="hr" />}>
            <Route path="/hr"                  element={<HRDashboard />} />
            <Route path="/hr/jobs"             element={<ManageJobs />} />
            <Route path="/hr/applications"     element={<Applications />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
