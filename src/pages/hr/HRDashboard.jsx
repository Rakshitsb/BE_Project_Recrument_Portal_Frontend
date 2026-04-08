import { useEffect } from 'react'
import { Row, Col, Button, Skeleton, Result } from 'antd'
import {
  SolutionOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { StatCard, PageHeader }    from '../../components/ui'
import { RecentApplicants }        from '../../components/hr/RecentApplicants'
import { JobActivityList }         from '../../components/hr/JobActivityList'
import useAuth                     from '../../hooks/useAuth'
import useApiCall                  from '../../hooks/useApiCall'
import { jobService }              from '../../services'

/**
 * HRDashboard
 * Main overview page for the HR role.
 * Fetches live jobs via jobService.getMyJobs() and derives stats.
 * Shows loading skeleton while fetching, error+retry if fetch fails.
 */
export function HRDashboard() {
  const navigate         = useNavigate()
  const { user }         = useAuth()
  const { execute, loading, error, data } = useApiCall(jobService.getMyJobs)

  useEffect(() => { execute() }, [])

  // ── Derived data ───────────────────────────────────────────────
  const jobs = data || []

  const stats = [
    {
      title: 'Total Jobs Posted',
      value: jobs.length,
      color: 'blue',
      icon: <SolutionOutlined />,
    },
    {
      title: 'Active Jobs',
      value: jobs.filter((j) => j.isActive).length,
      color: 'green',
      icon: <CheckCircleOutlined />,
    },
    {
      title: 'Total Applicants',
      value: jobs.reduce((sum, j) => sum + (j.applicants || 0), 0),
      color: 'purple',
      icon: <TeamOutlined />,
    },
    {
      title: 'Positions Filled',
      value: 0,
      color: 'orange',
      icon: <CalendarOutlined />,
    },
  ]

  // ── Header actions ─────────────────────────────────────────────
  const headerActions = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => navigate('/hr/jobs')}
    >
      Post New Job
    </Button>
  )

  // ── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fade-in-up">
        <PageHeader
          title="Dashboard"
          subtitle={`Welcome back, ${user?.name || 'HR Manager'}`}
          actions={headerActions}
        />
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────
  if (error) {
    return (
      <Result
        status="error"
        title="Failed to load dashboard"
        subTitle={error}
        extra={<Button onClick={() => execute()}>Retry</Button>}
      />
    )
  }

  // ── Main render ────────────────────────────────────────────────
  return (
    <div className="fade-in-up">

      {/* ── Page Header ── */}
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name || 'HR Manager'}`}
        actions={headerActions}
      />

      {/* ── Stats Row ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat) => (
          <Col key={stat.title} xs={24} sm={12} lg={6}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          </Col>
        ))}
      </Row>

      {/* ── Content Row ── */}
      <Row gutter={16}>
        <Col xs={24} lg={14}>
          <RecentApplicants applicants={[]} />
        </Col>

        <Col xs={24} lg={10}>
          <JobActivityList jobs={jobs} />
        </Col>
      </Row>

    </div>
  )
}

export default HRDashboard
