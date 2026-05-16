import api from './api'

const mockJobs = [
  {
    id: '1',
    title: 'Senior React Engineer',
    company: 'TechNova Labs',
    description: 'Lead the web platform team building customer-facing dashboards.',
    location: 'Remote',
    industry: 'Technology',
    size: '201-500',
    category: 'Engineering',
    tags: ['React', 'TypeScript', 'GraphQL'],
    jobsCount: 4,
    postedAt: '2026-03-20',
    logoBg: '#1677ff',
    jobType: 'Full-Time',
    experienceRequired: 3,
    salaryRange: '$80k-$120k',
    coverLetterRequired: true,
    isActive: true,
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'VistaPay',
    description: 'Design flows for consumer payments and merchant tools.',
    location: 'San Francisco, CA',
    industry: 'Fintech',
    size: '501-1000',
    category: 'Design',
    tags: ['Figma', 'Design Systems', 'Prototyping'],
    jobsCount: 2,
    postedAt: '2026-03-22',
    logoBg: '#13c2c2',
    jobType: 'Full-Time',
    experienceRequired: 2,
    salaryRange: '$70k-$100k',
    coverLetterRequired: false,
    isActive: true,
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'Helix Health',
    description: 'Build predictive models that power provider recommendations.',
    location: 'New York, NY',
    industry: 'Healthcare',
    size: '51-200',
    category: 'Data',
    tags: ['Python', 'ML', 'SQL'],
    jobsCount: 3,
    postedAt: '2026-03-25',
    logoBg: '#722ed1',
    jobType: 'Full-Time',
    experienceRequired: 3,
    salaryRange: '$90k-$130k',
    coverLetterRequired: false,
    isActive: true,
  },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const COMPANY_COLORS = ['#1677ff', '#13c2c2', '#722ed1', '#fa8c16', '#2f54eb', '#52c41a', '#eb2f96']

function pickColor(seed = '') {
  const sum = seed.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
  return COMPANY_COLORS[sum % COMPANY_COLORS.length]
}

function safeArray(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean)
  }
  return []
}

function normalizeJob(data) {
  const company =
    data.company ||
    data.company_name ||
    data.hrCompany ||
    data.hr_company ||
    'Hiring Company'

  const postedAt =
    data.postedAt ||
    data.posted_at ||
    data.created_at?.split('T')[0] ||
    ''

  return {
    id: String(data.id ?? ''),
    title: data.title || 'Untitled Role',
    company,
    companyLogoUrl: data.company_logo_url || data.companyLogoUrl || '',
    description: data.description || 'No description provided yet.',
    location: data.location || 'Remote',
    industry: data.industry || 'General',
    size: data.size || data.company_size || data.companySize || 'Not specified',
    category: data.category || 'General',
    tags: safeArray(data.tags || data.required_skills || data.requiredSkills),
    jobsCount: data.jobsCount ?? 1,
    postedAt,
    logoBg: data.logoBg || pickColor(company),
    jobType: data.jobType || data.job_type || 'Not specified',
    experienceRequired: data.experienceRequired ?? data.experience_required ?? 0,
    salaryRange: data.salaryRange || data.salary_range || 'Not disclosed',
    coverLetterRequired: Boolean(data.coverLetterRequired ?? data.cover_letter_required),
    isActive: data.isActive ?? data.is_active ?? true,
  }
}

function filterJobs(list, filters) {
  const searchTerm = filters.searchTerm?.toLowerCase() || ''
  const locations = filters.location && filters.location !== 'Anywhere'
    ? [filters.location]
    : []

  return list.filter((job) => {
    const matchSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm)

    const matchLocation = locations.length === 0 || locations.includes(job.location)
    const matchIndustry = filters.industries?.length
      ? filters.industries.includes(job.industry)
      : true
    const matchSize = filters.sizes?.length ? filters.sizes.includes(job.size) : true
    const matchCategory = filters.categories?.length
      ? filters.categories.includes(job.category)
      : true
    const matchTags = filters.tags?.length
      ? filters.tags.every((tag) => job.tags.includes(tag))
      : true

    return matchSearch && matchLocation && matchIndustry && matchSize && matchCategory && matchTags
  })
}

function sortJobs(list, sort) {
  if (sort === 'latest') {
    return [...list].sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0))
  }
  return list
}

export async function fetchJobs(filters = {}, page = 1, pageSize = 6) {
  try {
    const { data } = await api.get('/jobs/')
    const normalized = Array.isArray(data) ? data.map(normalizeJob) : []
    const filtered = sortJobs(filterJobs(normalized, filters), filters.sort)
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
    }
  } catch (err) {
    if (err.response) throw err

    await delay(500)
    const filtered = sortJobs(filterJobs(mockJobs, filters), filters.sort)
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
    }
  }
}

export async function getJobById(jobId) {
  try {
    const { data } = await api.get(`/jobs/${jobId}`)
    return normalizeJob(data)
  } catch (err) {
    if (err.response) throw err

    await delay(250)
    return mockJobs.find((job) => job.id === String(jobId)) || normalizeJob({ id: jobId })
  }
}

export async function fetchCompanies() {
  const { data } = await fetchJobs({}, 1, 100)
  return Array.from(new Set(data.map((job) => job.company)))
}

export default {
  fetchJobs,
  getJobById,
  fetchCompanies,
}
