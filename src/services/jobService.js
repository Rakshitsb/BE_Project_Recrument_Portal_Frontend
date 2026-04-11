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
  },
  {
    id: '4',
    title: 'Blockchain Engineer',
    company: 'ChainBridge',
    description: 'Own smart contract development and audits for core protocol.',
    location: 'Remote',
    industry: 'Blockchain',
    size: '11-50',
    category: 'Engineering',
    tags: ['Solidity', 'EVM', 'Security'],
    jobsCount: 5,
    postedAt: '2026-03-18',
    logoBg: '#fa8c16',
  },
  {
    id: '5',
    title: 'People Operations Lead',
    company: 'Northwind',
    description: 'Scale hiring programs and talent experience globally.',
    location: 'Austin, TX',
    industry: 'Technology',
    size: '501-1000',
    category: 'People',
    tags: ['HR', 'Talent', 'Operations'],
    jobsCount: 1,
    postedAt: '2026-03-12',
    logoBg: '#2f54eb',
  },
  {
    id: '6',
    title: 'Growth Marketing Manager',
    company: 'Storyline',
    description: 'Own lifecycle campaigns and paid acquisition experiments.',
    location: 'Remote',
    industry: 'Media',
    size: '51-200',
    category: 'Marketing',
    tags: ['Lifecycle', 'Performance', 'Analytics'],
    jobsCount: 2,
    postedAt: '2026-03-15',
    logoBg: '#eb2f96',
  },
  {
    id: '7',
    title: 'Security Engineer',
    company: 'ShieldOps',
    description: 'Harden cloud infrastructure and lead incident response.',
    location: 'Seattle, WA',
    industry: 'Security',
    size: '201-500',
    category: 'Engineering',
    tags: ['AWS', 'Kubernetes', 'Detection'],
    jobsCount: 2,
    postedAt: '2026-03-19',
    logoBg: '#52c41a',
  },
  {
    id: '8',
    title: 'Business Analyst',
    company: 'Everest Logistics',
    description: 'Drive analytics for supply chain efficiency initiatives.',
    location: 'Chicago, IL',
    industry: 'Logistics',
    size: '1001-5000',
    category: 'Operations',
    tags: ['SQL', 'Tableau', 'Stakeholder Management'],
    jobsCount: 3,
    postedAt: '2026-03-10',
    logoBg: '#fa541c',
  },
  {
    id: '9',
    title: 'AI Product Manager',
    company: 'Cortex AI',
    description: 'Ship ML-powered features across enterprise products.',
    location: 'Boston, MA',
    industry: 'AI',
    size: '201-500',
    category: 'Product',
    tags: ['Product Strategy', 'AI', 'Roadmaps'],
    jobsCount: 2,
    postedAt: '2026-03-21',
    logoBg: '#1890ff',
  },
  {
    id: '10',
    title: 'Customer Success Manager',
    company: 'Beacon CRM',
    description: 'Champion enterprise customers and drive adoption targets.',
    location: 'Remote',
    industry: 'SaaS',
    size: '51-200',
    category: 'Customer',
    tags: ['CSM', 'Enterprise', 'Onboarding'],
    jobsCount: 4,
    postedAt: '2026-03-08',
    logoBg: '#7cb305',
  },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const normalizeJob = (job) => {
  const company = job.company || job.hr_name || job.organisation || 'Unknown Company'
  const tags = Array.isArray(job.required_skills) && job.required_skills.length
    ? job.required_skills
    : ['General']

  return {
    id: job.id,
    title: job.title,
    company,
    description: job.description || 'No description provided.',
    location: job.location || 'Remote',
    job_type: job.job_type || 'Full-Time',
    salary_range: job.salary_range || '—',
    experience_required: job.experience_required ?? 0,
    cover_letter_required: job.cover_letter_required ?? false,
    is_active: job.is_active ?? true,
    postedAt: job.created_at ? new Date(job.created_at).toISOString().slice(0, 10) : '—',
    tags,
    jobsCount: job.jobsCount || 1,
    logoBg: job.logoBg || '#1677ff',
    industry: job.industry || '—',
    company_size: job.company_size || '—',
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
    return [...list].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
  }
  return list
}

export async function fetchJobs(filters = {}, page = 1, pageSize = 6) {
  // First try the real backend
  try {
    const params = {
      search: filters.searchTerm || undefined,
      location: filters.location && filters.location !== 'Anywhere' ? filters.location : undefined,
      industries: filters.industries?.length ? filters.industries.join(',') : undefined,
      sizes: filters.sizes?.length ? filters.sizes.join(',') : undefined,
      categories: filters.categories?.length ? filters.categories.join(',') : undefined,
      tags: filters.tags?.length ? filters.tags.join(',') : undefined,
      sort: filters.sort || undefined,
      page,
      page_size: pageSize,
    }

    const { data } = await api.get('/jobs', { params })
    // Expecting { results, total } or array fallback
    const rawResults = data.results ?? data.data ?? data
    const total = data.total ?? rawResults?.length ?? 0

    const results = Array.isArray(rawResults) ? rawResults.map(normalizeJob) : []
    return { data: results, total }
  } catch (err) {
    // Fallback to mock data when backend is unreachable
    if (!err.response) {
      await delay(500)
      const filtered = sortJobs(filterJobs(mockJobs, filters), filters.sort)
      const start = (page - 1) * pageSize
      const end = start + pageSize
      return { data: filtered.slice(start, end).map(normalizeJob), total: filtered.length }
    }
    throw err
  }
}

export async function fetchJobById(id) {
  try {
    const { data } = await api.get(`/jobs/${id}`)
    const job = data.result ?? data.data ?? data
    return normalizeJob(job)
  } catch (err) {
    if (!err.response) {
      const fallback = mockJobs.find((j) => String(j.id) === String(id))
      if (fallback) return normalizeJob(fallback)
    }
    throw err
  }
}

export async function fetchCompanies() {
  try {
    const { data } = await api.get('/jobs/companies')
    return data.results ?? data
  } catch (err) {
    if (!err.response) {
      await delay(200)
      return Array.from(new Set(mockJobs.map((job) => job.company)))
    }
    throw err
  }
}

export default {
  fetchJobs,
  fetchJobById,
  fetchCompanies,
}
