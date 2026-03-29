/** Application status → display label/color map */
export const APPLICATION_STATUSES = {
  pending:   { label: 'Pending',   color: 'gold' },
  reviewed:  { label: 'Reviewed',  color: 'blue' },
  interview: { label: 'Interview', color: 'purple' },
  accepted:  { label: 'Accepted',  color: 'success' },
  rejected:  { label: 'Rejected',  color: 'error' },
}

/** Employment types */
export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
]

/** User roles */
export const ROLES = {
  CANDIDATE: 'candidate',
  HR: 'hr',
}

/** API base URL (can be overridden by env) */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

/** Pagination defaults */
export const PAGE_SIZE_DEFAULT = 10
