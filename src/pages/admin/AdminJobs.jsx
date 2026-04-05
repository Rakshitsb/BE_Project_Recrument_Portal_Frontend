import { useMemo, useState } from 'react'
import { Col, Input, Row, Select, Space, Tag, Typography } from 'antd'

import { PageHeader }          from '../../components/ui'
import { AdminJobsTable }      from '../../components/admin/AdminJobsTable'
import { AdminJobDetailModal } from '../../components/admin/AdminJobDetailModal'

// ── Mock Data (replace with API calls later) ──────────────────────────────

const MOCK_JOBS = [
  {
    id: 'j1', title: 'Senior React Developer', hrName: 'Rajesh Kapoor',
    company: 'Infosys Ltd', location: 'Bengaluru, Karnataka',
    jobType: 'Full-Time', experienceRequired: 4,
    salaryRange: '₹18–24 LPA', requiredSkills: ['React', 'TypeScript', 'Redux', 'Node.js'],
    isActive: true, applicants: 34, postedDate: '2024-02-10',
    description: 'We are seeking a Senior React Developer to lead the frontend architecture of our flagship SaaS product. You will collaborate with cross-functional teams, mentor junior engineers, and drive best practices across the codebase.',
    coverLetterRequired: true,
  },
  {
    id: 'j2', title: 'Data Engineer', hrName: 'Deepa Krishnamurthy',
    company: 'Wipro Technologies', location: 'Hyderabad, Telangana',
    jobType: 'Full-Time', experienceRequired: 3,
    salaryRange: '₹14–20 LPA', requiredSkills: ['Python', 'Apache Spark', 'AWS Glue', 'SQL'],
    isActive: true, applicants: 22, postedDate: '2024-01-28',
    description: 'Build and maintain large-scale data pipelines on AWS. Work closely with data science and analytics teams to ensure reliable, high-quality data delivery across business domains.',
    coverLetterRequired: false,
  },
  {
    id: 'j3', title: 'Product Manager – Fintech', hrName: 'Amit Bhatia',
    company: 'Razorpay', location: 'Bengaluru, Karnataka',
    jobType: 'Full-Time', experienceRequired: 5,
    salaryRange: '₹28–40 LPA', requiredSkills: ['Product Strategy', 'Agile', 'SQL', 'Stakeholder Management'],
    isActive: true, applicants: 18, postedDate: '2024-02-05',
    description: 'Drive product vision and roadmap for our payment gateway suite. Translate market insights into actionable features and work with engineering to ship impactful products for millions of merchants.',
    coverLetterRequired: true,
  },
  {
    id: 'j4', title: 'UI/UX Designer', hrName: 'Preethi Subramaniam',
    company: 'Freshworks Inc', location: 'Chennai, Tamil Nadu',
    jobType: 'Full-Time', experienceRequired: 2,
    salaryRange: '₹10–16 LPA', requiredSkills: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    isActive: true, applicants: 41, postedDate: '2024-01-20',
    description: 'Design intuitive, accessible interfaces for our CRM suite. Conduct user research, create wireframes, and iterate on designs in close collaboration with product and engineering teams.',
    coverLetterRequired: false,
  },
  {
    id: 'j5', title: 'DevOps Engineer', hrName: 'Suresh Joshi',
    company: 'Tata Consultancy Services', location: 'Pune, Maharashtra',
    jobType: 'Contract', experienceRequired: 4,
    salaryRange: '₹16–22 LPA', requiredSkills: ['Kubernetes', 'Terraform', 'Jenkins', 'AWS'],
    isActive: false, applicants: 15, postedDate: '2023-11-14',
    description: 'Set up and manage CI/CD pipelines, container orchestration, and cloud infrastructure. Collaborate with development teams to improve deployment frequency and reduce mean time to recovery.',
    coverLetterRequired: false,
  },
  {
    id: 'j6', title: 'Android Developer', hrName: 'Nisha Agarwal',
    company: "BYJU'S", location: 'Bengaluru, Karnataka',
    jobType: 'Full-Time', experienceRequired: 2,
    salaryRange: '₹12–18 LPA', requiredSkills: ['Kotlin', 'Jetpack Compose', 'Retrofit', 'MVVM'],
    isActive: true, applicants: 27, postedDate: '2024-02-18',
    description: 'Build engaging learning experiences for millions of students on Android. Own features end-to-end, from design review to Play Store release, with a focus on performance and accessibility.',
    coverLetterRequired: true,
  },
  {
    id: 'j7', title: 'QA Automation Engineer', hrName: 'Kiran Desai',
    company: 'Persistent Systems', location: 'Nagpur, Maharashtra',
    jobType: 'Full-Time', experienceRequired: 3,
    salaryRange: '₹10–15 LPA', requiredSkills: ['Selenium', 'Cypress', 'TestNG', 'Python'],
    isActive: true, applicants: 11, postedDate: '2024-01-08',
    description: 'Build robust test automation frameworks to ensure software quality across web and API layers. Collaborate with developers to shift quality left and integrate testing into the CI pipeline.',
    coverLetterRequired: false,
  },
  {
    id: 'j8', title: 'Cloud Solutions Architect', hrName: 'Meenakshi Rao',
    company: 'HCL Technologies', location: 'Noida, Uttar Pradesh',
    jobType: 'Remote', experienceRequired: 8,
    salaryRange: '₹35–50 LPA', requiredSkills: ['AWS', 'Azure', 'GCP', 'Solution Design', 'Cost Optimisation'],
    isActive: false, applicants: 9, postedDate: '2023-10-30',
    description: 'Design enterprise-scale cloud architectures for global clients. Lead pre-sales engagements, create solution blueprints, and guide implementation teams through complex migrations.',
    coverLetterRequired: true,
  },
  {
    id: 'j9', title: 'Backend Engineer – Go', hrName: 'Sanjay Pillai',
    company: 'Swiggy', location: 'Bengaluru, Karnataka',
    jobType: 'Full-Time', experienceRequired: 3,
    salaryRange: '₹20–30 LPA', requiredSkills: ['Go', 'gRPC', 'PostgreSQL', 'Redis', 'Kafka'],
    isActive: true, applicants: 38, postedDate: '2024-02-22',
    description: 'Build high-throughput backend services powering food delivery at scale. You will own microservices from design through production, with a focus on reliability, latency, and observability.',
    coverLetterRequired: false,
  },
  {
    id: 'j10', title: 'HR Business Partner', hrName: 'Anita Verma',
    company: 'Mahindra & Mahindra', location: 'Mumbai, Maharashtra',
    jobType: 'Part-Time', experienceRequired: 5,
    salaryRange: '₹12–16 LPA', requiredSkills: ['HR Strategy', 'Talent Management', 'Labour Law', 'HRIS'],
    isActive: false, applicants: 7, postedDate: '2023-12-03',
    description: 'Act as a strategic people partner for business units, guiding managers on talent development, performance management, and organisational design aligned with company growth objectives.',
    coverLetterRequired: true,
  },
]

const JOB_TYPE_OPTIONS = ['Full-Time', 'Part-Time', 'Contract', 'Remote'].map(
  (t) => ({ value: t, label: t }),
)

const STATUS_OPTIONS = [
  { value: 'active',   label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

// ── Component ─────────────────────────────────────────────────────────────

/**
 * AdminJobs
 * Admin overview of all platform job postings with search, type,
 * and status filters plus a detail modal.
 */
export function AdminJobs() {
  const [jobs,         setJobs]         = useState(MOCK_JOBS)    // eslint-disable-line no-unused-vars
  const [searchText,   setSearchText]   = useState('')
  const [filterType,   setFilterType]   = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)
  const [selectedJob,  setSelectedJob]  = useState(null)
  const [modalOpen,    setModalOpen]    = useState(false)

  // ── Derived filtered list ─────────────────────────────────────────────
  const filteredJobs = useMemo(() => {
    const q = searchText.toLowerCase()
    return jobs.filter((job) => {
      const matchSearch = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q)
      const matchType   = !filterType   || job.jobType === filterType
      const matchStatus = !filterStatus || (filterStatus === 'active' ? job.isActive : !job.isActive)
      return matchSearch && matchType && matchStatus
    })
  }, [jobs, searchText, filterType, filterStatus])

  // ── Handlers ─────────────────────────────────────────────────────────
  function handleView(job) {
    setSelectedJob(job)
    setModalOpen(true)
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="Jobs Overview"
        subtitle="All job postings across the platform"
        actions={
          <Space>
            <Tag color="blue">{jobs.length} Total Jobs</Tag>
            <Tag color="green">{jobs.filter((j) => j.isActive).length} Active</Tag>
          </Space>
        }
      />

      <Row gutter={12} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Input.Search
            placeholder="Search by title or company"
            style={{ width: 260 }}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col>
          <Select
            placeholder="Job Type"
            allowClear
            style={{ width: 160 }}
            options={JOB_TYPE_OPTIONS}
            onChange={(val) => setFilterType(val ?? null)}
          />
        </Col>
        <Col>
          <Select
            placeholder="Status"
            allowClear
            style={{ width: 140 }}
            options={STATUS_OPTIONS}
            onChange={(val) => setFilterStatus(val ?? null)}
          />
        </Col>
        <Col style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Text type="secondary">{filteredJobs.length} results</Typography.Text>
        </Col>
      </Row>

      <AdminJobsTable jobs={filteredJobs} onView={handleView} />

      <AdminJobDetailModal
        open={modalOpen}
        job={selectedJob}
        onClose={() => { setModalOpen(false); setSelectedJob(null) }}
      />
    </div>
  )
}
