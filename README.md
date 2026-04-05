# HireBase Frontend

Production-ready React + Vite frontend for a recruitment platform.
Built with Ant Design, Zustand, and React Router v6.

## Tech Stack

| Tech             | Version  |
|------------------|----------|
| React            | 19       |
| Vite             | 8        |
| React Router DOM | v6       |
| Zustand          | latest   |
| Ant Design       | latest   |
| Tailwind CSS     | v4       |
| Axios            | latest   |

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:8000
```

## Role-Based Routing

| Role      | Default Path |
|-----------|--------------|
| candidate | /candidate   |
| hr        | /hr          |
| admin     | /admin       |

## Project Structure

```
src/
├── assets/
├── components/
│   ├── common/          # ProtectedRoute, ProfileSetupGuard
│   ├── ui/              # StatCard, StatusBadge, DataTable,
│   │                    # ConfirmModal, PageHeader, EmptyState
│   ├── hr/              # RecentApplicants, JobActivityList,
│   │   │                # ApplicantCard, ApplicationFilters,
│   │   │                # JobForm, JobsTable,
│   │   │                # HRProfileCard, HRProfileEditForm
│   │   └── setup/       # PersonalInfoStep, CompanyInfoStep
│   └── admin/           # PlatformStats, RecentActivityFeed,
│                        # AdminQuickTables, CandidateTable,
│                        # HRTable, UserDetailModal,
│                        # AdminJobsTable, AdminApplicationsTable,
│                        # AdminJobDetailModal
├── hooks/               # useAuth, useApiCall
├── layouts/             # MainLayout, AuthLayout, AdminLayout
├── pages/
│   ├── auth/            # LoginPage, RegisterPage
│   ├── candidate/       # CandidateDashboard, Jobs,
│   │                    # MyApplications, ProfileSetup
│   ├── hr/              # HRDashboard, ManageJobs,
│   │                    # Applications, HRProfileSetup, HRProfile
│   ├── admin/           # AdminDashboard, UserManagement,
│   │                    # AdminJobs, AdminApplications
│   └── NotFound.jsx
├── routes/              # AppRoutes.jsx
├── services/            # api.js, authService.js
├── store/               # authStore.js
├── utils/               # helpers.js, constants.js
├── App.jsx
└── main.jsx
```

## Auth Flow

- JWT stored in localStorage via Zustand persist middleware
- Axios interceptor attaches `Authorization: Bearer <token>`
- 401 responses trigger auto-logout and redirect to `/login`
- Role-based guards via `ProtectedRoute` component

## Progress Log

### Phase 1 — Reusable UI Components        ✅ Complete
### Phase 2 — Admin Layout + Route Wiring   ✅ Complete
### Phase 3 — HR Dashboard                  ✅ Complete
### Phase 4 — HR Manage Jobs                ✅ Complete
### Phase 5 — HR Applications Viewer        ✅ Complete
### Phase 6 — HR Profile Setup              ✅ Complete
### Phase 7 — Admin Dashboard               ✅ Complete
### Phase 8 — Admin User Management         ✅ Complete
### Phase 9 — Admin Jobs + Applications     ✅ Complete
### Phase 10 — HR Profile + Polish          ✅ Complete

## API Integration

All mock data is clearly marked with:

```js
// ── Mock Data (replace with API calls later) ─────────────────
```

Ready for Phase 2 API integration using `src/services/api.js`.
