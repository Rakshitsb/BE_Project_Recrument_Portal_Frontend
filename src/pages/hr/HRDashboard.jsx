import { Row, Col, Button } from 'antd'
import {
  SolutionOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { StatCard, PageHeader }       from '../../components/ui'
import { RecentApplicants }           from '../../components/hr/RecentApplicants'
import { JobActivityList }            from '../../components/hr/JobActivityList'
import useAuth                        from '../../hooks/useAuth'

// ── Mock Data (replace with API calls later) ─────────────────────

const STATS = [
  { title: 'Total Jobs Posted',    value: 8,  color: 'blue',   icon: <SolutionOutlined />  },
  { title: 'Total Applicants',     value: 47, color: 'purple', icon: <TeamOutlined />       },
  { title: 'Interviews Scheduled', value: 6,  color: 'orange', icon: <CalendarOutlined />   },
  { title: 'Positions Filled',     value: 3,  color: 'green',  icon: <CheckCircleOutlined /> },
]

const RECENT_APPLICANTS = [
  { id: 1, name: 'Priya Sharma',    jobTitle: 'Senior React Developer', status: 'interview',   appliedDate: '2026-04-01' },
  { id: 2, name: 'Rohan Mehta',     jobTitle: 'Backend Engineer',       status: 'applied',     appliedDate: '2026-04-02' },
  { id: 3, name: 'Anita Verma',     jobTitle: 'UX Designer',            status: 'shortlisted', appliedDate: '2026-04-02' },
  { id: 4, name: 'Karan Patel',     jobTitle: 'DevOps Engineer',        status: 'selected',    appliedDate: '2026-03-30' },
  { id: 5, name: 'Sneha Kulkarni',  jobTitle: 'Data Analyst',           status: 'rejected',    appliedDate: '2026-03-28' },
]

const JOB_ACTIVITY = [
  { id: 1, title: 'Senior React Developer', applicants: 18, isActive: true,  postedDate: '2026-03-20' },
  { id: 2, title: 'Backend Engineer',       applicants: 12, isActive: true,  postedDate: '2026-03-22' },
  { id: 3, title: 'UX Designer',            applicants: 9,  isActive: false, postedDate: '2026-03-25' },
  { id: 4, title: 'Data Analyst',           applicants: 8,  isActive: true,  postedDate: '2026-03-28' },
]

// ─────────────────────────────────────────────────────────────────

/**
 * HRDashboard
 * Main overview page for the HR role.
 * Displays key recruiting stats, recent applicants, and job activity.
 */
export function HRDashboard() {
  const navigate     = useNavigate()
  const { user }     = useAuth()

  const headerActions = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => navigate('/hr/jobs')}
    >
      Post New Job
    </Button>
  )

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
        {STATS.map((stat) => (
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
          <RecentApplicants applicants={RECENT_APPLICANTS} />
        </Col>

        <Col xs={24} lg={10}>
          <JobActivityList jobs={JOB_ACTIVITY} />
        </Col>
      </Row>

    </div>
  )
}

export default HRDashboard
