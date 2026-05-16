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
  is_active:             values.isActive ?? values.is_active ?? true,
  jd_parsed:             values.jdParsed || values.jd_parsed || undefined,
  raw_jd_text:           values.rawJdText || values.raw_jd_text || undefined,
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
  jdParsed:            data.jd_parsed || null,
  rawJdText:           data.raw_jd_text || '',
  applicants:          data.applicants ?? data.applicant_count ?? 0,
  postedDate:          data.created_at?.split('T')[0] || '',
})

const normalizeJobType = (type) => {
  if (!type) return undefined
  const raw = String(type).trim().toLowerCase()
  const map = {
    fulltime: 'Full-Time',
    'full time': 'Full-Time',
    'full-time': 'Full-Time',
    parttime: 'Part-Time',
    'part time': 'Part-Time',
    'part-time': 'Part-Time',
    contract: 'Contract',
    remote: 'Remote',
  }
  return map[raw] || type
}

const isNonEmptyValue = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim() !== ''
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return true
}

const firstNonEmpty = (...values) => values.find(isNonEmptyValue)

const parseExperience = (value) => {
  if (value === null || value === undefined || value === '') return undefined
  if (typeof value === 'number') return value
  const match = String(value).match(/\d+(\.\d+)?/)
  return match ? Number(match[0]) : undefined
}

const toStringList = (value) => {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.flatMap(toStringList)
  }

  if (typeof value === 'object') {
    return Object.values(value).flatMap(toStringList)
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const flattenResponsibilities = (value) => {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === 'string') return item.trim() ? [item.trim()] : []

      if (item && typeof item === 'object') {
        const heading = item.name ? [`${item.name}:`] : []
        const tasks = toStringList(item.tasks || item.items || item.details)
        return [...heading, ...tasks.map((task) => `- ${task}`)]
      }

      return []
    })
  }

  return toStringList(value)
}

const flattenTechnicalSkills = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return toStringList(value)
  }

  return Object.values(value).flatMap(toStringList)
}

const formatSalary = (value) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value !== 'object') return String(value)

  const parts = [
    value.annual_ctc,
    value.range,
    value.base,
    value.bonus ? `Bonus: ${value.bonus}` : '',
    value.stock_options ? `Stock Options: ${value.stock_options}` : '',
  ].filter(Boolean)

  return parts.join(' | ')
}

const formatLocation = (value) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value !== 'object') return String(value)

  return [
    value.primary,
    value.office,
    value.work_type,
  ].filter(Boolean).join(' | ')
}

const buildDescription = (parsed) => {
  const directDescription = firstNonEmpty(
    parsed.description,
    parsed.job_description,
    parsed.job?.description,
  )
  if (directDescription) {
    return directDescription
  }

  const summary = firstNonEmpty(parsed.summary, parsed.job?.summary)
  const responsibilities = flattenResponsibilities(parsed.responsibilities)

  const parts = [
    summary,
    parsed.about_company ? `About Company:\n${parsed.about_company}` : '',
    responsibilities.length
      ? `Responsibilities:\n${responsibilities.join('\n')}`
      : '',
  ].filter(Boolean)

  return parts.join('\n\n')
}

const normalizeParsedJd = (payload) => {
  const parsed = payload?.parsed_jd || payload?.parsedJd || payload || {}
  const job = parsed.job || {}
  const requiredSkills = [
    ...toStringList(
      firstNonEmpty(parsed.required_skills, parsed.requiredSkills, parsed.skills),
    ),
    ...flattenTechnicalSkills(parsed.technical_skills),
    ...toStringList(parsed.keywords),
  ]

  const uniqueRequiredSkills = [...new Set(requiredSkills)]

  return {
    title: firstNonEmpty(parsed.title, parsed.job_title, parsed.jobTitle, job.title) || '',
    description: buildDescription(parsed),
    requiredSkills: uniqueRequiredSkills,
    location: formatLocation(firstNonEmpty(parsed.location, parsed.location_details)),
    jobType: normalizeJobType(
      firstNonEmpty(parsed.job_type, parsed.jobType, parsed.employment_type, job.employment_type),
    ),
    experienceRequired: parseExperience(
      firstNonEmpty(
        parsed.experience_required,
        parsed.experienceRequired,
        parsed.experience,
        parsed.min_experience,
        job.experience_required,
      ),
    ),
    salaryRange: formatSalary(
      firstNonEmpty(parsed.salary_range, parsed.salaryRange, parsed.salary),
    ),
    coverLetterRequired: Boolean(
      parsed.cover_letter_required ?? parsed.coverLetterRequired ?? false,
    ),
    jdParsed: parsed,
    rawJdText: payload?.raw_jd_text || payload?.rawJdText || payload?.raw_text || '',
    modelUsed: payload?.model_used || payload?.modelUsed || '',
  }
}

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

const fromBackendDashboard = (data) => ({
  stats: {
    totalJobsPosted: data.stats?.total_jobs_posted ?? 0,
    activeJobs: data.stats?.active_jobs ?? 0,
    totalApplicants: data.stats?.total_applicants ?? 0,
    positionsFilled: data.stats?.positions_filled ?? 0,
  },
  jobs: Array.isArray(data.jobs)
    ? data.jobs.map((job) => ({
      id: job.id,
      title: job.title,
      isActive: job.is_active,
      applicants: job.applicants ?? 0,
      postedDate: job.created_at?.split('T')[0] || '',
    }))
    : [],
  recentApplicants: Array.isArray(data.recent_applicants)
    ? data.recent_applicants.map((app) => ({
      id: app.id,
      jobId: app.job_id,
      jobTitle: app.job_title || '-',
      candidateId: app.candidate_id,
      candidateName: app.candidate_name || `Candidate ${app.candidate_id?.slice(-4) || ''}`,
      candidateEmail: app.candidate_email || '-',
      status: app.status,
      appliedDate: app.created_at?.split('T')[0] || '-',
    }))
    : [],
})

const dashboardService = {
  getDashboard: async () => {
    const { data } = await api.get('/hr/dashboard')
    return fromBackendDashboard(data)
  },
}

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
      // 404 = profile not created yet
      // 403 = role mismatch in DB — treat as no profile
      if (err.response?.status === 404 || err.response?.status === 403) {
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
   * Parse an uploaded JD file into structured job data.
   * POST /ai/parse-jd
   * @param {File} file
   * @returns {Promise<object>} camelCase job fields with parsed metadata
   */
  parseJd: async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await api.post('/ai/parse-jd', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    })

    return normalizeParsedJd(data)
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

  getRankedCandidates: async (jobId) => {
    const { data } = await api.get(`/applications/job/${jobId}/ranked`)
    return data
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
export { hrProfileService, jobService, applicationService, dashboardService }
export default { hrProfileService, jobService, applicationService, dashboardService }
