# HireBase Frontend

Production-ready React + Vite frontend scaffold for a recruitment platform.

## Tech Stack

| Tech | Version |
|------|---------|
| React | 19 |
| Vite | 8 |
| React Router DOM | v6 |
| Zustand | latest |
| Ant Design | latest |
| Tailwind CSS | v4 |
| Axios | latest |

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── assets/               # Static assets
├── components/
│   ├── common/           # ProtectedRoute, PageLoader
│   └── ui/               # StatCard, StatusBadge
├── hooks/                # useAuth, useApiCall
├── layouts/              # MainLayout, AuthLayout
├── pages/
│   ├── auth/             # LoginPage, RegisterPage
│   ├── candidate/        # CandidateDashboard, JobListings, MyApplications
│   └── hr/               # HRDashboard, ManageJobs, Applications
├── routes/               # AppRoutes.jsx (centralized routing)
├── services/             # api.js (Axios), authService.js
├── store/                # authStore.js (Zustand + persist)
├── utils/                # helpers.js, constants.js
├── App.jsx
└── main.jsx
```

## Environment Variables

Copy `.env` and update the API URL:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Role-Based Routing

| Role      | Default Path  |
|-----------|---------------|
| candidate | /candidate    |
| hr        | /hr           |

## Auth Flow

- JWT token stored in localStorage via Zustand `persist` middleware
- Axios interceptor automatically attaches `Authorization: Bearer <token>`
- 401 responses trigger auto-logout and redirect to `/login`
