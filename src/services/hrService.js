import api from './api'

const normalizeWebsite = (website) => {
  if (!website) return null
  if (/^https?:\/\//i.test(website)) return website
  return `https://${website}`
}

// ── Field mappers ─────────────────────────────────────────────────────────

/**
 * Maps frontend camelCase HR profile form values
 * to backend snake_case request body.
 * @param {object} values
 * @returns {object}
 */
const toBackendProfile = (values) => ({
  full_name:        values.fullName || values.name || values.full_name,
  phone:            values.phone,
  designation:      values.designation,
  company_name:     values.companyName || values.company || values.company_name,
  company_website:  normalizeWebsite(values.companyWebsite || values.company_website),
  company_location: values.companyLocation || values.company_location,
  industry:         values.industry,
  company_size:     values.companySize || values.company_size,
})

/**
 * Maps backend snake_case HR profile response
 * to frontend camelCase shape.
 * @param {object} data
 * @returns {object}
 */
const fromBackendProfile = (data) => ({
  id:              data.id,
  userId:          data.user_id,
  name:            data.full_name,
  phone:           data.phone,
  designation:     data.designation,
  company:         data.company_name,
  companyWebsite:  data.company_website || '',
  companyLocation: data.company_location,
  industry:        data.industry,
  companySize:     data.company_size,
  createdAt:       data.created_at,
})

/**
 * Maps frontend camelCase job form values
 * to backend snake_case request body.
 * @param {object} values
 * @returns {object}
 */
const toBackendJob = (values) => ({
  title:                 values.title,
  description:           values.description,
  required_skills:       values.requiredSkills || values.required_skills || [],
  location:              values.location,
  job_type:              values.jobType || values.job_type,
  experience_required:   values.experienceRequired ?? values.experience_required ?? 0,
  salary_range:          values.salaryRange || values.salary_range || null,
  cover_letter_required: values.coverLetterRequired ?? values.cover_letter_required ?? false,
})

/**
 * Maps backend snake_case job response
 * to frontend camelCase shape.
 * @param {object} data
 * @returns {object}
 */
const fromBackendJob = (data) => ({
  id:                  data.id,
  hrId:                data.hr_id,
  title:               data.title,
  description:         data.description,
  requiredSkills:      data.required_skills || [],
  location:            data.location,
  jobType:             data.job_type,
  experienceRequired:  data.experience_required,
  salaryRange:         data.salary_range || '',
  coverLetterRequired: data.cover_letter_required,
  isActive:            data.is_active,
  applicants:          0,
  postedDate:          data.created_at?.split('T')[0] || '',
})

/**
 * Maps backend snake_case application response
 * to frontend camelCase shape.
 * Fills missing candidate fields with fallback values
 * since Phase 1 backend does not return candidate details.
 * @param {object} data
 * @returns {object}
 */
const fromBackendApplication = (data) => ({
  id:              data.id,
  jobId:           data.job_id,
  jobTitle:        data.job_title || '—',
  candidateId:     data.candidate_id,
  candidateName:   data.candidate_name  || `Candidate ${data.candidate_id?.slice(-4) || ''}`,
  candidateEmail:  data.candidate_email || '—',
  candidatePhone:  data.candidate_phone || '—',
  location:        data.location        || '—',
  skills:          data.skills          || [],
  experienceYears: data.experience_years ?? '—',
  education:       Array.isArray(data.education)
                     ? data.education.map((e) => [e.degree, e.institution, e.year].filter(Boolean).join(', ')).join(' | ')
                     : data.education || '—',
  coverLetter:     data.cover_letter    || '',
  status:          data.status,
  appliedDate:     data.created_at?.split('T')[0] || '—',
  updatedAt:       data.updated_at?.split('T')[0] || '—',
})

// ── HR Profile Service ───────────────────────────────────────────

const hrProfileService = {

  /**
   * Get the logged-in HR user's profile.
   * GET /hr/profile
   * @returns {Promise<object>} camelCase profile object
   */
  getProfile: async (token) => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined
      const { data } = await api.get('/hr/profile', config)
      return fromBackendProfile(data)
    } catch (err) {
      if (err.response?.status === 404) {
        return null
      }
      throw err
    }
  },

  /**
   * Create HR profile (first-time setup).
   * POST /hr/profile
   * @param {object} values - camelCase form values
   * @returns {Promise<object>} camelCase profile object
   */
  createProfile: async (values) => {
    const { data } = await api.post('/hr/profile', toBackendProfile(values))
    return fromBackendProfile(data)
  },

  /**
   * Update existing HR profile.
   * PUT /hr/profile
   * @param {object} values - camelCase form values
   * @returns {Promise<object>} camelCase profile object
   */
  updateProfile: async (values) => {
    const { data } = await api.put('/hr/profile', toBackendProfile(values))
    return fromBackendProfile(data)
  },

}

// ── Jobs Service ─────────────────────────────────────────────────

const jobService = {

  /**
   * Get all jobs (returns all active jobs — filter by hr_id on frontend).
   * GET /jobs/
   * @returns {Promise<object[]>} array of camelCase job objects
   */
  getMyJobs: async () => {
    try {
      const { data: profile } = await api.get('/hr/profile')
      const hrId = profile.user_id

      const { data } = await api.get('/jobs/')
      const allJobs = Array.isArray(data) ? data.map(fromBackendJob) : []
      return allJobs.filter(job => job.hrId === hrId)
    } catch (err) {
      if (err.response?.status === 404) return []
      throw err
    }
  },

  /**
   * Get a single job by ID.
   * GET /jobs/{job_id}
   * @param {string} jobId
   * @returns {Promise<object>} camelCase job object
   */
  getJobById: async (jobId) => {
    const { data } = await api.get(`/jobs/${jobId}`)
    return fromBackendJob(data)
  },

  /**
   * Create a new job posting.
   * POST /jobs/
   * @param {object} values - camelCase form values
   * @returns {Promise<object>} camelCase job object
   */
  createJob: async (values) => {
    const { data } = await api.post('/jobs/', toBackendJob(values))
    return fromBackendJob(data)
  },

  /**
   * Update an existing job posting.
   * PUT /jobs/{job_id}
   * @param {string} jobId
   * @param {object} values - camelCase form values
   * @returns {Promise<object>} camelCase job object
   */
  updateJob: async (jobId, values) => {
    const { data } = await api.put(`/jobs/${jobId}`, toBackendJob(values))
    return fromBackendJob(data)
  },

  /**
   * Delete a job posting.
   * DELETE /jobs/{job_id}
   * @param {string} jobId
   * @returns {Promise<void>}
   */
  deleteJob: async (jobId) => {
    await api.delete(`/jobs/${jobId}`)
  },

}

// ── Applications Service (HR side) ───────────────────────────────

const applicationService = {

  /**
   * Get all applications for a specific job.
   * GET /applications/job/{job_id}
   * @param {string} jobId
   * @returns {Promise<object[]>} array of application objects
   */
  getJobApplications: async (jobId) => {
    const { data } = await api.get(`/applications/job/${jobId}`)
    return Array.isArray(data) ? data.map(fromBackendApplication) : []
  },

  /**
   * Find a single application across the HR user's jobs.
   * Useful for deep-linking to a candidate review page.
   * @param {string} applicationId
   * @returns {Promise<object|null>}
   */
  getApplicationById: async (applicationId) => {
    const jobs = await jobService.getMyJobs()
    const applicationLists = await Promise.all(
      (jobs || []).map((job) => applicationService.getJobApplications(job.id))
    )

    for (const apps of applicationLists) {
      const match = (apps || []).find((app) => app.id === applicationId)
      if (match) return match
    }

    return null
  },

  /**
   * Update the status of an application.
   * PUT /applications/{app_id}/status
   * @param {string} appId
   * @param {string} status - applied | under_review | shortlisted |
   *                          interview | selected | rejected
   * @returns {Promise<object>} updated application object
   */
  updateStatus: async (appId, status) => {
    const { data } = await api.put(
      `/applications/${appId}/status`,
      { status },
    )
    return data
  },

}

// ── Exports ──────────────────────────────────────────────────────
export { hrProfileService, jobService, applicationService }
export default { hrProfileService, jobService, applicationService }
