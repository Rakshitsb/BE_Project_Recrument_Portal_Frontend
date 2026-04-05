import { useState, useMemo } from 'react'
import { Row, Col, Button, Tag, Drawer } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import { PageHeader, DataTable, StatusBadge, EmptyState } from '../../components/ui'
import { ApplicationFilters } from '../../components/hr/ApplicationFilters'
import { ApplicantCard }      from '../../components/hr/ApplicantCard'

// ── Mock Data (replace with API calls later) ─────────────────────
const MOCK_JOBS = [
  { id: 'j1', title: 'Senior Backend Developer' },
  { id: 'j2', title: 'Product Designer' },
  { id: 'j3', title: 'DevOps Engineer' },
  { id: 'j4', title: 'Data Analyst' },
]

const MOCK_APPLICATIONS = [
  { id: 'a1',  jobId: 'j1', jobTitle: 'Senior Backend Developer', candidateName: 'Priya Sharma',   candidateEmail: 'priya@email.com',   candidatePhone: '+91 98765 43210', location: 'Pune, India',      skills: ['Node.js', 'PostgreSQL', 'Docker'],         experienceYears: 4, education: 'B.Tech Computer Science', coverLetter: 'I am excited to apply for this role and bring my backend expertise to your team.',     status: 'interview',   appliedDate: '2026-03-28' },
  { id: 'a2',  jobId: 'j1', jobTitle: 'Senior Backend Developer', candidateName: 'Rohan Mehta',    candidateEmail: 'rohan@email.com',   candidatePhone: '+91 87654 32109', location: 'Mumbai, India',     skills: ['Java', 'Spring Boot', 'Redis'],             experienceYears: 5, education: 'M.Tech Software Engineering', coverLetter: 'With 5 years of backend experience, I am confident I can add immediate value.',         status: 'applied',     appliedDate: '2026-03-30' },
  { id: 'a3',  jobId: 'j2', jobTitle: 'Product Designer',         candidateName: 'Anita Verma',    candidateEmail: 'anita@email.com',   candidatePhone: '+91 76543 21098', location: 'Bangalore, India',  skills: ['Figma', 'User Research', 'Prototyping'],   experienceYears: 3, education: 'B.Des Interaction Design',   coverLetter: 'Design is my passion. I would love to shape experiences that delight users.',          status: 'shortlisted', appliedDate: '2026-03-25' },
  { id: 'a4',  jobId: 'j2', jobTitle: 'Product Designer',         candidateName: 'Karan Patel',    candidateEmail: 'karan@email.com',   candidatePhone: '+91 65432 10987', location: 'Hyderabad, India',  skills: ['Adobe XD', 'Sketch', 'CSS'],               experienceYears: 2, education: 'B.Sc Visual Design',         coverLetter: '',                                                                                     status: 'rejected',    appliedDate: '2026-03-22' },
  { id: 'a5',  jobId: 'j3', jobTitle: 'DevOps Engineer',          candidateName: 'Sneha Kulkarni', candidateEmail: 'sneha@email.com',   candidatePhone: '+91 54321 09876', location: 'Remote',            skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'], experienceYears: 4, education: 'B.Tech Information Technology', coverLetter: 'Cloud infrastructure is where I thrive. I am eager to optimise your pipelines.',      status: 'under_review', appliedDate: '2026-03-27' },
  { id: 'a6',  jobId: 'j3', jobTitle: 'DevOps Engineer',          candidateName: 'Amit Singh',     candidateEmail: 'amit@email.com',   candidatePhone: '+91 43210 98765', location: 'Delhi, India',      skills: ['GCP', 'Ansible', 'Linux'],                 experienceYears: 6, education: 'B.E. Computer Engineering',  coverLetter: 'I have 6 years managing large-scale cloud environments and automated deployments.',   status: 'selected',    appliedDate: '2026-03-20' },
  { id: 'a7',  jobId: 'j4', jobTitle: 'Data Analyst',             candidateName: 'Divya Rao',      candidateEmail: 'divya@email.com',  candidatePhone: '+91 32109 87654', location: 'Chennai, India',    skills: ['Python', 'SQL', 'Tableau'],                experienceYears: 2, education: 'M.Sc Statistics',            coverLetter: 'Data storytelling is my strength. I can help translate numbers into actionable insight.', status: 'interview',   appliedDate: '2026-03-29' },
  { id: 'a8',  jobId: 'j4', jobTitle: 'Data Analyst',             candidateName: 'Vikram Nair',    candidateEmail: 'vikram@email.com', candidatePhone: '+91 21098 76543', location: 'Kochi, India',      skills: ['Excel', 'Power BI', 'R'],                  experienceYears: 3, education: 'B.Sc Mathematics',           coverLetter: '',                                                                                     status: 'applied',     appliedDate: '2026-04-01' },
  { id: 'a9',  jobId: 'j1', jobTitle: 'Senior Backend Developer', candidateName: 'Pooja Desai',    candidateEmail: 'pooja@email.com',  candidatePhone: '+91 10987 65432', location: 'Ahmedabad, India',  skills: ['Go', 'gRPC', 'Kafka'],                     experienceYears: 5, education: 'B.Tech Computer Science', coverLetter: 'Distributed systems are my specialty. I look forward to scaling your backend architecture.', status: 'shortlisted', appliedDate: '2026-03-31' },
  { id: 'a10', jobId: 'j2', jobTitle: 'Product Designer',         candidateName: 'Nikhil Joshi',   candidateEmail: 'nikhil@email.com', candidatePhone: '+91 09876 54321', location: 'Pune, India',       skills: ['Figma', 'Motion Design', 'HTML', 'CSS'],  experienceYears: 4, education: 'B.Des Product Design',       coverLetter: 'I bring both visual and interaction design expertise, plus frontend implementation skills.', status: 'under_review', appliedDate: '2026-04-02' },
]
// ─────────────────────────────────────────────────────────────────

/**
 * Applications
 * HR page for reviewing and managing all candidate applications.
 * Supports filtering by job and status, inline profile panel, and a mobile drawer.
 */
export function Applications() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS)
  const [selectedJobId,  setSelectedJobId]  = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedApp,    setSelectedApp]    = useState(null)
  const [drawerOpen,     setDrawerOpen]     = useState(false)

  // ── Derived: filtered list ────────────────────────────────────────
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchJob    = !selectedJobId    || app.jobId  === selectedJobId
      const matchStatus = !selectedStatus   || app.status === selectedStatus
      return matchJob && matchStatus
    })
  }, [applications, selectedJobId, selectedStatus])

  // ── Handlers ──────────────────────────────────────────────────────
  const handleView = (app) => {
    setSelectedApp(app)
    setDrawerOpen(true)
  }

  const handleStatusChange = (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    )
    setSelectedApp((prev) => (prev?.id === appId ? { ...prev, status: newStatus } : prev))
  }

  // ── Table columns ─────────────────────────────────────────────────
  const columns = [
    { title: 'Candidate', dataIndex: 'candidateName', key: 'candidateName' },
    { title: 'Job',       dataIndex: 'jobTitle',       key: 'jobTitle' },
    { title: 'Applied',   dataIndex: 'appliedDate',    key: 'appliedDate' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Action', key: 'action',
      render: (_, record) => (
        <Button type="text" size="small" onClick={() => handleView(record)}>View</Button>
      ),
    },
  ]

  return (
    <div className="fade-in-up">

      <PageHeader
        title="Applications"
        subtitle="Review and manage candidate applications"
        actions={<Tag color="blue">{filteredApps.length} Applications</Tag>}
      />

      <ApplicationFilters
        jobs={MOCK_JOBS}
        selectedJobId={selectedJobId}
        selectedStatus={selectedStatus}
        onJobChange={setSelectedJobId}
        onStatusChange={setSelectedStatus}
      />

      <Row gutter={16}>
        <Col xs={24} lg={14}>
          <DataTable
            columns={columns}
            dataSource={filteredApps}
            loading={false}
            emptyText="No applications match the current filters."
            extraProps={{
              onRow: (record) => ({ onClick: () => handleView(record), style: { cursor: 'pointer' } }),
            }}
          />
        </Col>

        <Col xs={0} lg={10}>
          {selectedApp ? (
            <ApplicantCard applicant={selectedApp} onStatusChange={handleStatusChange} />
          ) : (
            <EmptyState icon={<UserOutlined />} message="Select an applicant to view their profile" />
          )}
        </Col>
      </Row>

      <Drawer
        title={selectedApp?.candidateName}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={480}
        placement="right"
        destroyOnClose={false}
      >
        {selectedApp && (
          <ApplicantCard applicant={selectedApp} onStatusChange={handleStatusChange} />
        )}
      </Drawer>

    </div>
  )
}

export default Applications
