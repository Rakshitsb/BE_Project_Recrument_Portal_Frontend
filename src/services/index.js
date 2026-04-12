/**
 * Barrel export for all API services.
 * Import from here instead of individual files:
 *
 * @example
 * import { jobService } from '../services'
 * import { hrProfileService } from '../services'
 * import { authService } from '../services'
 */

export { default as authService } from './authService'
export { hrProfileService, jobService, applicationService } from './hrService'
export { adminService } from './adminService'
