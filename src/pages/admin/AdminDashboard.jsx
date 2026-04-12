import { useEffect, useState } from 'react'
import { Row, Col, Button, Space, Skeleton, Alert } from 'antd'
import { TeamOutlined, SolutionOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { PageHeader }          from '../../components/ui'
import { PlatformStats }       from '../../components/admin/PlatformStats'
import { RecentActivityFeed }  from '../../components/admin/RecentActivityFeed'
import { AdminQuickTables }    from '../../components/admin/AdminQuickTables'
import { adminService } from '../../services'

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
    hiredThisMonth:    applications.filter((a) => a.status === 'selected').length,
  }

  const recentCandidates = candidates.slice(0, 5)
  const recentHRUsers    = hrUsers.slice(0, 4)

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
          <RecentActivityFeed activities={[]} />
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
