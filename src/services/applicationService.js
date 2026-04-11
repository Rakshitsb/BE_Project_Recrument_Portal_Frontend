import api from './api'

const mockApplications = [
  {
    id: 'app_1',
    job_id: '1',
    job_title: 'Senior React Engineer',
    company: 'TechNova Labs',
    location: 'Remote',
    job_type: 'Full-Time',
    salary_range: '$80k-$120k',
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
    salary_range: '$70k-$100k',
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
    salary_range: '$90k-$130k',
    status: 'applied',
    cover_letter: '',
    applied_at: '2026-03-25',
    logoBg: '#722ed1',
  },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const COMPANY_COLORS = ['#1677ff', '#13c2c2', '#722ed1', '#fa8c16', '#2f54eb', '#52c41a', '#eb2f96']

function pickColor(seed = '') {
  const sum = seed.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
  return COMPANY_COLORS[sum % COMPANY_COLORS.length]
}

function normalizeApplication(data) {
  const company =
    data.company ||
    data.company_name ||
    data.hr_company ||
    data.hrCompany ||
    'Hiring Company'

  return {
    id: String(data.id ?? ''),
    job_id: String(data.job_id ?? data.jobId ?? ''),
    job_title: data.job_title || data.jobTitle || data.title || 'Untitled Role',
    company,
    location: data.location || 'Not specified',
    job_type: data.job_type || data.jobType || 'Not specified',
    salary_range: data.salary_range || data.salaryRange || 'Not disclosed',
    status: data.status || 'applied',
    cover_letter: data.cover_letter || data.coverLetter || '',
    applied_at: data.applied_at || data.appliedDate || data.created_at?.split('T')[0] || 'Unknown date',
    logoBg: data.logoBg || pickColor(company),
  }
}

export const applicationService = {
  getMyApplications: async () => {
    try {
      const { data } = await api.get('/applications/my')
      const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : []
      const normalized = list.map(normalizeApplication)

      return {
        data: normalized,
        total: data?.total ?? normalized.length,
      }
    } catch (err) {
      if (!err.response) {
        await delay(600)
        return {
          data: mockApplications.map(normalizeApplication),
          total: mockApplications.length,
        }
      }
      throw err
    }
  },

  applyToJob: async ({ job_id, cover_letter }) => {
    try {
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

  withdrawApplication: async (applicationId) => {
    try {
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
