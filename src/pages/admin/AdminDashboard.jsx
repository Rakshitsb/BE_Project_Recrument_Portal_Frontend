import { useEffect, useState } from 'react'
import { Row, Col, Button, Space, Skeleton, Alert } from 'antd'
import { TeamOutlined, SolutionOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { PageHeader }          from '../../components/ui'
import { PlatformStats }       from '../../components/admin/PlatformStats'
import { RecentActivityFeed }  from '../../components/admin/RecentActivityFeed'
import { AdminQuickTables }    from '../../components/admin/AdminQuickTables'
import { adminService } from '../../services'

function formatDateTime(value) {
  if (!value || value === '—' || value === 'â€”') return 'Recent'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function timestampValue(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

function isCurrentMonth(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false

  const now = new Date()
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
}

function buildActivities({ candidates, hrUsers, jobs, applications }) {
  const candidateActivities = candidates.map((candidate) => ({
    id: `candidate-${candidate.id}`,
    type: 'new_candidate',
    message: `${candidate.name} joined as a candidate`,
    actor: candidate.email,
    timestamp: formatDateTime(candidate.joinedDate),
    sortTime: timestampValue(candidate.joinedDate),
  }))

  const hrActivities = hrUsers.map((hr) => ({
    id: `hr-${hr.id}`,
    type: 'new_hr',
    message: `${hr.name} joined as an HR user`,
    actor: hr.company,
    timestamp: formatDateTime(hr.joinedDate),
    sortTime: timestampValue(hr.joinedDate),
  }))

  const jobActivities = jobs.map((job) => ({
    id: `job-${job.id}`,
    type: 'new_job',
    message: `${job.title} was posted`,
    actor: job.company,
    timestamp: formatDateTime(job.postedDate),
    sortTime: timestampValue(job.postedDate),
  }))

  const applicationActivities = applications.map((application) => ({
    id: `application-${application.id}`,
    type: application.status === 'selected' ? 'hired' : 'application',
    message: application.status === 'selected'
      ? `${application.candidateName} was selected for ${application.jobTitle}`
      : `${application.candidateName} applied for ${application.jobTitle}`,
    actor: application.company,
    timestamp: formatDateTime(application.appliedDate),
    sortTime: timestampValue(application.appliedDate),
  }))

  return [
    ...candidateActivities,
    ...hrActivities,
    ...jobActivities,
    ...applicationActivities,
  ]
    .sort((a, b) => b.sortTime - a.sortTime)
    .slice(0, 6)
}

/**
 * AdminDashboard
 * Platform-wide overview for admin users.
 * Shows aggregate stats, a live activity feed, and quick-access user tables.
 */
export function AdminDashboard() {
  const navigate = useNavigate()
  const [candidates,    setCandidates]   = useState([])
  const [hrUsers,       setHRUsers]      = useState([])
  const [jobs,          setJobs]         = useState([])
  const [applications,  setApplications] = useState([])
  const [loading,       setLoading]      = useState(true)
  const [error,         setError]        = useState(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [c, h, j, a] = await Promise.all([
          adminService.getCandidates(),
          adminService.getHRs(),
          adminService.getJobs(),
          adminService.getApplications(),
        ])
        setCandidates(c)
        setHRUsers(h)
        setJobs(j)
        setApplications(a)
      } catch {
        setError('Failed to load dashboard data. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const stats = {
    totalCandidates:   candidates.length,
    totalHR:           hrUsers.length,
    totalJobs:         jobs.length,
    totalApplications: applications.length,
    activeJobs:        jobs.filter((j) => j.isActive).length,
    hiredThisMonth:    applications.filter((a) => a.status === 'selected' && isCurrentMonth(a.appliedDate)).length,
  }

  const recentActivities = buildActivities({ candidates, hrUsers, jobs, applications })
  const recentCandidates = [...candidates]
    .sort((a, b) => timestampValue(b.joinedDate) - timestampValue(a.joinedDate))
    .slice(0, 5)
  const recentHRUsers    = [...hrUsers]
    .sort((a, b) => timestampValue(b.joinedDate) - timestampValue(a.joinedDate))
    .slice(0, 4)

  const headerActions = (
    <Space>
      <Button icon={<TeamOutlined />} onClick={() => navigate('/admin/users')}>
        Manage Users
      </Button>
      <Button icon={<SolutionOutlined />} onClick={() => navigate('/admin/jobs')}>
        View All Jobs
      </Button>
    </Space>
  )

  return (
    <div className="fade-in-up">

      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform overview and recent activity"
        actions={headerActions}
      />

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
          action={<Button size="small" onClick={() => window.location.reload()}>Retry</Button>}
        />
      )}

      {loading ? <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 24 }} /> : <PlatformStats stats={stats} />}

      <Row gutter={16}>
        <Col xs={24} lg={14}>
          <RecentActivityFeed activities={recentActivities} />
        </Col>

        <Col xs={24} lg={10}>
          <AdminQuickTables
            candidates={recentCandidates}
            hrUsers={recentHRUsers}
          />
        </Col>
      </Row>

    </div>
  )
}

export default AdminDashboard
