import api from './api'

/**
 * Maps backend candidate response
 * to frontend camelCase shape.
 * @param {object} data
 * @returns {object}
 */
const fromBackendCandidate = (data) => ({
  id:              data.id,
  userId:          data.user_id ?? data.userId ?? data.id,
  name:            data.full_name || data.name || '—',
  email:           data.email,
  phone:           data.phone || '—',
  location:        data.location || '—',
  skills:          data.skills || [],
  experienceYears: data.experience_years ?? 0,
  totalApplications: data.total_applications ?? data.totalApplications ?? 0,
  status:          data.status || 'active',
  education:       Array.isArray(data.education)
                     ? data.education.map((e) => [e.degree, e.institution, e.year].filter(Boolean).join(', ')).join(' | ')
                     : data.education || '—',
  bio:             data.bio || '',
  joinedDate:      data.created_at?.split('T')[0] || '—',
})

/**
 * Maps backend HR response
 * to frontend camelCase shape.
 * @param {object} data
 * @returns {object}
 */
const fromBackendHR = (data) => ({
  id:              data.id,
  userId:          data.user_id ?? data.userId ?? data.id,
  name:            data.full_name || data.name || '—',
  email:           data.email,
  phone:           data.phone || '—',
  designation:     data.designation || '—',
  company:         data.company_name || '—',
  companyLocation: data.company_location || '—',
  industry:        data.industry || '—',
  companySize:     data.company_size || '—',
  companyWebsite:  data.company_website || '',
  totalJobsPosted: data.total_jobs_posted ?? data.totalJobsPosted ?? 0,
  status:          data.status || 'active',
  joinedDate:      data.created_at?.split('T')[0] || '—',
})

/**
 * Maps backend job response
 * to frontend camelCase shape.
 * @param {object} data
 * @returns {object}
 */
const fromBackendJob = (data) => ({
  id:                  data.id,
  hrId:                data.hr_id,
  title:               data.title,
  description:         data.description || '',
  requiredSkills:      data.required_skills || [],
  company:             data.company_name || data.company || '—',
  hrName:              data.hr_name || data.hrName || '—',
  location:            data.location,
  jobType:             data.job_type,
  experienceRequired:  data.experience_required,
  salaryRange:         data.salary_range || '',
  coverLetterRequired: data.cover_letter_required,
  isActive:            data.is_active,
  applicants:          data.applicants ?? 0,
  postedDate:          data.created_at?.split('T')[0] || '—',
})

/**
 * Maps backend application response
 * to frontend camelCase shape.
 * @param {object} data
 * @returns {object}
 */
const fromBackendApplication = (data) => ({
  id:              data.id,
  jobId:           data.job_id,
  jobTitle:        data.job_title || '—',
  candidateId:     data.candidate_id,
  candidateName:   data.candidate_name || '—',
  candidateEmail:  data.candidate_email || '—',
  hrName:          data.hr_name || '—',
  company:         data.company_name || data.company || '—',
  status:          data.status,
  experienceYears: data.experience_years ?? '—',
  location:        data.location || '—',
  appliedDate:     data.created_at?.split('T')[0] || '—',
})

const adminService = {

  /**
   * Get all candidates.
   * GET /admin/candidates
   * @returns {Promise<object[]>} array of candidate objects
   */
  getCandidates: async () => {
    const { data } = await api.get('/admin/candidates')
    return Array.isArray(data) ? data.map(fromBackendCandidate) : []
  },

  /**
   * Get all HRs.
   * GET /admin/hrs
   * @returns {Promise<object[]>} array of HR objects
   */
  getHRs: async () => {
    const { data } = await api.get('/admin/hrs')
    return Array.isArray(data) ? data.map(fromBackendHR) : []
  },

  /**
   * Get all jobs.
   * GET /admin/jobs
   * @returns {Promise<object[]>} array of job objects
   */
  getJobs: async () => {
    const { data } = await api.get('/admin/jobs')
    return Array.isArray(data) ? data.map(fromBackendJob) : []
  },

  /**
   * Get all applications.
   * GET /admin/applications
   * @returns {Promise<object[]>} array of application objects
   */
  getApplications: async () => {
    const { data } = await api.get('/admin/applications')
    return Array.isArray(data) ? data.map(fromBackendApplication) : []
  },

  /**
   * Delete a candidate by user ID.
   * DELETE /admin/candidate/{userId}
   * @param {string} userId
   * @returns {Promise<void>}
   */
  deleteCandidate: async (userId) => {
    await api.delete(`/admin/candidate/${userId}`)
  },

  /**
   * Delete an HR by user ID.
   * DELETE /admin/hr/{userId}
   * @param {string} userId
   * @returns {Promise<void>}
   */
  deleteHR: async (userId) => {
    await api.delete(`/admin/hr/${userId}`)
  },

}

export { adminService }
export default adminService
