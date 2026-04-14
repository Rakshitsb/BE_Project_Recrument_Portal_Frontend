import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import MainLayout    from '../layouts/MainLayout'
import AuthLayout    from '../layouts/AuthLayout'
import { AdminLayout }      from '../layouts/AdminLayout'
import ProtectedRoute       from '../components/common/ProtectedRoute'
import ProfileSetupGuard    from '../components/common/ProfileSetupGuard'
import HRSetupGuard         from '../components/common/HRSetupGuard'
import HRProfileSetupOnlyGuard from '../components/common/HRProfileSetupOnlyGuard'

// ── Lazy-loaded pages ─────────────────────────────────────────────
const LoginPage     = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage  = lazy(() => import('../pages/auth/RegisterPage'))
const ProfileSetup  = lazy(() => import('../pages/candidate/ProfileSetup'))

// Candidate pages
import InterviewTakePage from '../pages/candidate/InterviewTakePage'
import InterviewResultsPage from '../pages/candidate/InterviewResultsPage'

const CandidateDashboard = lazy(() => import('../pages/candidate/CandidateDashboard'))
const JobsPage           = lazy(() => import('../pages/candidate/Jobs'))
const MyApplications     = lazy(() => import('../pages/candidate/MyApplications'))
const JobDetailPage      = lazy(() => import('../pages/candidate/JobDetailPage'))
const CandidateProfile   = lazy(() => import('../pages/candidate/CandidateProfile'))
const EditProfile        = lazy(() => import('../pages/candidate/EditProfile'))

// HR pages
const HRDashboard    = lazy(() => import('../pages/hr/HRDashboard'))
const ManageJobs     = lazy(() => import('../pages/hr/ManageJobs'))
const Applications   = lazy(() => import('../pages/hr/Applications').then(m => ({ default: m.Applications })))
const ApplicationDetail = lazy(() => import('../pages/hr/ApplicationDetail'))
const HRProfileSetup = lazy(() => import('../pages/hr/HRProfileSetup'))
const HRProfile      = lazy(() => import('../pages/hr/HRProfile').then(m => ({ default: m.HRProfile })))
const Interviewers   = lazy(() => import('../pages/hr/Interviewers').then(m => ({ default: m.Interviewers })))
const Interviews     = lazy(() => import('../pages/hr/Interviews').then(m => ({ default: m.Interviews })))
const InterviewDetail = lazy(() => import('../pages/hr/InterviewDetail').then(m => ({ default: m.InterviewDetail })))

// Misc pages
const NotFound = lazy(() => import('../pages/NotFound').then(m => ({ default: m.NotFound })))

// Admin pages
const AdminDashboard    = lazy(() => import('../pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const UserManagement    = lazy(() => import('../pages/admin/UserManagement').then(m => ({ default: m.UserManagement })))
const AdminJobs         = lazy(() => import('../pages/admin/AdminJobs').then(m => ({ default: m.AdminJobs })))
const AdminApplications = lazy(() => import('../pages/admin/AdminApplications').then(m => ({ default: m.AdminApplications })))

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
        <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
          <Route path="/profile-setup" element={<ProfileSetup />} />
        </Route>


        {/* HR Profile Setup — hr role, no layout shell */}
        <Route element={<ProtectedRoute allowedRoles={['hr']} />}>
          <Route element={<HRProfileSetupOnlyGuard />}>
            <Route path="/hr-profile-setup" element={<HRProfileSetup />} />
          </Route>
        </Route>

        {/* Candidate protected routes (also checks profile completion) */}
        <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
          <Route element={<ProfileSetupGuard />}>
            <Route element={<MainLayout role="candidate" />}>
              <Route path="/candidate"                    element={<CandidateDashboard />} />
              <Route path="/candidate/jobs"               element={<JobsPage />} />
              <Route path="/jobs"                         element={<JobsPage />} />
              <Route path="/candidate/jobs/:jobId"        element={<JobDetailPage />} />
              <Route path="/candidate/applications"       element={<MyApplications />} />
              <Route path="/candidate/profile"            element={<CandidateProfile />} />
              <Route path="/candidate/profile/setup"      element={<ProfileSetup />} />
              <Route path="/candidate/profile/edit"       element={<EditProfile />} />
            </Route>
          </Route>
        </Route>


        {/* HR protected routes (also checks HR profile completion) */}
        <Route element={<ProtectedRoute allowedRoles={['hr']} />}>
          <Route element={<HRSetupGuard />}>
            <Route element={<MainLayout role="hr" />}>
              <Route path="/hr"                  element={<HRDashboard />} />
              <Route path="/hr/jobs"             element={<ManageJobs />} />
              <Route path="/hr/applications"     element={<Applications />} />
              <Route path="/hr/applications/:applicationId" element={<ApplicationDetail />} />
              <Route path="/hr/profile"          element={<HRProfile />} />
              <Route path="/hr/interviewers"     element={<Interviewers />} />
              <Route path="/hr/interviews"       element={<Interviews />} />
              <Route path="/hr/interviews/:interviewId" element={<InterviewDetail />} />
            </Route>
          </Route>
        </Route>

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin"                    element={<AdminDashboard />} />
            <Route path="/admin/users"              element={<UserManagement />} />
            <Route path="/admin/jobs"               element={<AdminJobs />} />
            <Route path="/admin/applications"       element={<AdminApplications />} />
          </Route>
        </Route>

        
        {/* Candidate Standalone Interview Routes */}
        <Route path="/interview/:token" element={<InterviewTakePage />} />
        <Route path="/interview/:token/results" element={<InterviewResultsPage />} />

        {/* Default redirect + 404 */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
