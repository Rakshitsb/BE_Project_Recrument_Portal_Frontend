import { Row, Col, Button, Space } from 'antd'
import { TeamOutlined, SolutionOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { PageHeader }          from '../../components/ui'
import { PlatformStats }       from '../../components/admin/PlatformStats'
import { RecentActivityFeed }  from '../../components/admin/RecentActivityFeed'
import { AdminQuickTables }    from '../../components/admin/AdminQuickTables'

// ── Mock Data (replace with API calls later) ─────────────────────
const STATS = {
  totalCandidates:   124,
  totalHR:            18,
  totalJobs:          43,
  totalApplications: 289,
  activeJobs:         31,
  hiredThisMonth:     12,
}

const ACTIVITIES = [
  { id: 'a1', type: 'new_candidate', message: 'Priya Sharma registered as a candidate',          timestamp: '2 hours ago',  actor: 'Priya Sharma' },
  { id: 'a2', type: 'application',   message: 'Rohan Mehta applied for Backend Developer',        timestamp: '3 hours ago',  actor: 'Rohan Mehta' },
  { id: 'a3', type: 'new_hr',        message: 'Meera Joshi joined as HR Manager at Infosys',     timestamp: '5 hours ago',  actor: 'Meera Joshi' },
  { id: 'a4', type: 'new_job',       message: 'DevOps Engineer posting created by TCS HR',        timestamp: 'Yesterday',    actor: 'Amit Kulkarni' },
  { id: 'a5', type: 'hired',         message: 'Sneha Patel was hired for Product Designer role', timestamp: 'Yesterday',    actor: 'Sneha Patel' },
  { id: 'a6', type: 'application',   message: 'Vikram Nair applied for Data Analyst',             timestamp: '2 days ago',   actor: 'Vikram Nair' },
  { id: 'a7', type: 'new_candidate', message: 'Anita Desai created a candidate profile',          timestamp: '3 days ago',   actor: 'Anita Desai' },
  { id: 'a8', type: 'hired',         message: 'Karan Singh accepted the Frontend Developer offer', timestamp: '3 days ago',  actor: 'Karan Singh' },
]

const RECENT_CANDIDATES = [
  { id: 'c1', name: 'Priya Sharma',    email: 'priya@mail.com',   location: 'Pune',      skills: ['React', 'TypeScript', 'Node.js'], joinedDate: '2026-04-03' },
  { id: 'c2', name: 'Rohan Mehta',     email: 'rohan@mail.com',   location: 'Mumbai',    skills: ['Java', 'Spring Boot'],            joinedDate: '2026-04-02' },
  { id: 'c3', name: 'Anita Desai',     email: 'anita@mail.com',   location: 'Bangalore', skills: ['Python', 'SQL', 'Tableau'],       joinedDate: '2026-04-01' },
  { id: 'c4', name: 'Vikram Nair',     email: 'vikram@mail.com',  location: 'Kochi',     skills: ['AWS', 'Terraform'],               joinedDate: '2026-03-31' },
  { id: 'c5', name: 'Divya Rao',       email: 'divya@mail.com',   location: 'Chennai',   skills: ['Figma', 'User Research'],         joinedDate: '2026-03-30' },
]

const RECENT_HR_USERS = [
  { id: 'h1', name: 'Meera Joshi',    email: 'meera@infosys.com', company: 'Infosys',  designation: 'HR Manager',             joinedDate: '2026-04-02' },
  { id: 'h2', name: 'Amit Kulkarni',  email: 'amit@tcs.com',      company: 'TCS',      designation: 'Talent Acquisition Lead', joinedDate: '2026-04-01' },
  { id: 'h3', name: 'Neha Bansal',    email: 'neha@wipro.com',    company: 'Wipro',    designation: 'Recruitment Specialist', joinedDate: '2026-03-29' },
  { id: 'h4', name: 'Rajesh Sharma',  email: 'rajesh@hcl.com',    company: 'HCL',      designation: 'HR Business Partner',    joinedDate: '2026-03-27' },
]
// ─────────────────────────────────────────────────────────────────

/**
 * AdminDashboard
 * Platform-wide overview for admin users.
 * Shows aggregate stats, a live activity feed, and quick-access user tables.
 */
export function AdminDashboard() {
  const navigate = useNavigate()

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

      <PlatformStats stats={STATS} />

      <Row gutter={16}>
        <Col xs={24} lg={14}>
          <RecentActivityFeed activities={ACTIVITIES} />
        </Col>

        <Col xs={24} lg={10}>
          <AdminQuickTables
            candidates={RECENT_CANDIDATES}
            hrUsers={RECENT_HR_USERS}
          />
        </Col>
      </Row>

    </div>
  )
}

export default AdminDashboard
