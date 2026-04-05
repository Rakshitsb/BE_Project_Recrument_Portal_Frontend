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

---

### Phase A1 — API Layer Setup + CORS
**Date:** 2026-04-05
**Status:** Complete

Changes made:
- `src/services/api.js` — fixed base URL (removed `/api` suffix), added network error handler (`ECONNABORTED` / `ERR_NETWORK`)
- `src/services/authService.js` — rewrote to match FastAPI endpoints exactly (renamed `register` → `/auth/signup` endpoint, removed non-existent `getProfile` and `logout`)
- `frontend/.env` — fixed `VITE_API_BASE_URL` (removed `/api` suffix)
- `backend/main.py` — updated CORS middleware: replaced `allow_origins=["*"]` with explicit Vite dev server origins (`localhost:5173`, `localhost:3000`, `127.0.0.1:5173`)

---

### Phase A2 — Auth Hook + Store Wired to Real API
**Date:** 2026-04-05
**Status:** Complete

Changes made:
- `src/hooks/useAuth.js` — removed all mock data, wired real API calls,
  added FastAPI error parser (`parseApiError`), fixed response mapping for login + signup
  (backend returns `{ access_token, token_type, role }` — not a user object),
  added post-register redirect to profile setup based on role, logout no longer
  calls non-existent backend endpoint
- `src/store/authStore.js` — added `role` field to state, login action, logout action,
  and `partialize` (persisted to localStorage)
- `src/components/common/ProtectedRoute.jsx` — reads role from store's dedicated `role`
  field with `user.role` as fallback
- `src/pages/auth/LoginPage.jsx` — removed `DemoCredentialBanner` (mock-only component),
  added `disabled={loading}` to Form
- `src/pages/auth/RegisterPage.jsx` — added `disabled={loading}` to Form

---

### Phase A3 — Profile Guards + Full Auth Flow
**Date:** 2026-04-05
**Status:** Complete

Changes made:
- `src/hooks/useAuth.js` — added `profileCompleted` flag to userData:
  `login()` sets `true` (returning user, skip setup),
  `register()` sets `false` (new user, must complete setup);
  added auth flow documentation comment block
- `src/components/common/ProfileSetupGuard.jsx` — updated JSDoc to clarify
  strict false-check (`=== false`) so `undefined` safely allows through
- `src/components/common/HRSetupGuard.jsx` — created new guard for HR users,
  redirects to `/hr-profile-setup` when `profileCompleted === false`
- `src/routes/AppRoutes.jsx` — imported `HRSetupGuard`, wrapped HR dashboard
  routes with it (mirrors candidate guard pattern)
- `src/pages/hr/HRProfileSetup.jsx` — fixed completion handler:
  `hasProfile: true` → `profileCompleted: true` (consistent field name)
- `src/pages/candidate/ProfileSetup.jsx` — already correct via `useProfileSetup`
  hook (`updateUser({ profileCompleted: true })`), no change needed

## API Integration

All mock data is clearly marked with:

```js
// ── Mock Data (replace with API calls later) ─────────────────
```

Ready for Phase 2 API integration using `src/services/api.js`.
