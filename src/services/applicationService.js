import api from './api'

// ── Mock applications data (used when no backend is connected) ────────────────
const mockApplications = [
  {
    id: 'app_1',
    job_id: '1',
    job_title: 'Senior React Engineer',
    company: 'TechNova Labs',
    location: 'Remote',
    job_type: 'Full-Time',
    salary_range: '$80k–$120k',
    status: 'interview',
    cover_letter: 'I am excited to apply for this role...',
    applied_at: '2026-03-20',
    logoBg: '#1677ff',
  },
  {
    id: 'app_2',
    job_id: '2',
    job_title: 'Product Designer',
    company: 'VistaPay',
    location: 'San Francisco, CA',
    job_type: 'Full-Time',
    salary_range: '$70k–$100k',
    status: 'under_review',
    cover_letter: '',
    applied_at: '2026-03-22',
    logoBg: '#13c2c2',
  },
  {
    id: 'app_3',
    job_id: '3',
    job_title: 'Data Scientist',
    company: 'Helix Health',
    location: 'New York, NY',
    job_type: 'Full-Time',
    salary_range: '$90k–$130k',
    status: 'applied',
    cover_letter: '',
    applied_at: '2026-03-25',
    logoBg: '#722ed1',
  },
  {
    id: 'app_4',
    job_id: '4',
    job_title: 'Blockchain Engineer',
    company: 'ChainBridge',
    location: 'Remote',
    job_type: 'Contract',
    salary_range: '$100k–$150k',
    status: 'shortlisted',
    cover_letter: 'Huge fan of the protocol...',
    applied_at: '2026-03-18',
    logoBg: '#fa8c16',
  },
  {
    id: 'app_5',
    job_id: '5',
    job_title: 'People Operations Lead',
    company: 'Northwind',
    location: 'Austin, TX',
    job_type: 'Full-Time',
    salary_range: '$60k–$80k',
    status: 'rejected',
    cover_letter: '',
    applied_at: '2026-03-12',
    logoBg: '#2f54eb',
  },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const applicationService = {
  /**
   * Fetch all applications submitted by the current candidate.
   *
   * @returns {Promise<{ data: Array, total: number }>}
   */
  getMyApplications: async () => {
    try {
      // ── TODO: replace with api.get('/applications/my') ──
      const { data } = await api.get('/applications/my')
      return { data: data.results ?? data, total: data.total ?? data.length }
    } catch (err) {
      if (!err.response) {
        await delay(600)
        return { data: mockApplications, total: mockApplications.length }
      }
      throw err
    }
  },

  /**
   * Submit a new application for a job.
   *
   * @param {{ job_id: string, cover_letter: string }} payload
   * @returns {Promise<{ success: boolean, id: string, status: string }>}
   */
  applyToJob: async ({ job_id, cover_letter }) => {
    try {
      // ── TODO: replace with api.post('/applications/', payload) ──
      const { data } = await api.post('/applications/', { job_id, cover_letter })
      return data
    } catch (err) {
      if (!err.response) {
        await delay(1000)
        return { success: true, id: 'app_new', status: 'applied' }
      }
      throw err
    }
  },

  /**
   * Withdraw (delete) an existing application by ID.
   *
   * @param {string} applicationId
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  withdrawApplication: async (applicationId) => {
    try {
      // ── TODO: replace with api.delete('/applications/' + applicationId) ──
      const { data } = await api.delete(`/applications/${applicationId}`)
      return data
    } catch (err) {
      if (!err.response) {
        await delay(800)
        return { success: true, message: 'Application withdrawn' }
      }
      throw err
    }
  },
}

export default applicationService
