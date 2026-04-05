import { useMemo, useState } from 'react'
import { Col, Input, Row, Select, Space, Tag, Typography } from 'antd'

import { PageHeader }               from '../../components/ui'
import { AdminApplicationsTable }   from '../../components/admin/AdminApplicationsTable'

// ── Mock Data (replace with API calls later) ──────────────────────────────

/** Jobs available for filtering (subset used across applications). */
const MOCK_JOBS = [
  { id: 'j1', title: 'Senior React Developer' },
  { id: 'j3', title: 'Product Manager – Fintech' },
  { id: 'j4', title: 'UI/UX Designer' },
  { id: 'j6', title: 'Android Developer' },
  { id: 'j9', title: 'Backend Engineer – Go' },
]

/** Twelve application records spanning all six statuses. */
const MOCK_APPLICATIONS = [
  {
    id: 'a1', jobTitle: 'Senior React Developer', jobId: 'j1',
    candidateName: 'Arjun Mehta', candidateEmail: 'arjun.mehta@gmail.com',
    hrName: 'Rajesh Kapoor', company: 'Infosys Ltd',
    status: 'applied', appliedDate: '2024-02-12', experienceYears: 3, location: 'Bengaluru',
  },
  {
    id: 'a2', jobTitle: 'Senior React Developer', jobId: 'j1',
    candidateName: 'Priya Nair', candidateEmail: 'priya.nair@outlook.com',
    hrName: 'Rajesh Kapoor', company: 'Infosys Ltd',
    status: 'under_review', appliedDate: '2024-02-13', experienceYears: 5, location: 'Pune',
  },
  {
    id: 'a3', jobTitle: 'Product Manager – Fintech', jobId: 'j3',
    candidateName: 'Rohan Sharma', candidateEmail: 'rohan.sharma@yahoo.in',
    hrName: 'Amit Bhatia', company: 'Razorpay',
    status: 'shortlisted', appliedDate: '2024-02-08', experienceYears: 6, location: 'Delhi',
  },
  {
    id: 'a4', jobTitle: 'Product Manager – Fintech', jobId: 'j3',
    candidateName: 'Sneha Iyer', candidateEmail: 'sneha.iyer@proton.me',
    hrName: 'Amit Bhatia', company: 'Razorpay',
    status: 'interview', appliedDate: '2024-02-09', experienceYears: 7, location: 'Mumbai',
  },
  {
    id: 'a5', jobTitle: 'UI/UX Designer', jobId: 'j4',
    candidateName: 'Kavitha Rajan', candidateEmail: 'kavitha.rajan@gmail.com',
    hrName: 'Preethi Subramaniam', company: 'Freshworks Inc',
    status: 'selected', appliedDate: '2024-01-22', experienceYears: 2, location: 'Chennai',
  },
  {
    id: 'a6', jobTitle: 'UI/UX Designer', jobId: 'j4',
    candidateName: 'Vikram Patel', candidateEmail: 'vikram.patel@hotmail.com',
    hrName: 'Preethi Subramaniam', company: 'Freshworks Inc',
    status: 'rejected', appliedDate: '2024-01-23', experienceYears: 1, location: 'Ahmedabad',
  },
  {
    id: 'a7', jobTitle: 'Android Developer', jobId: 'j6',
    candidateName: 'Ananya Kulkarni', candidateEmail: 'ananya.k@gmail.com',
    hrName: 'Nisha Agarwal', company: "BYJU'S",
    status: 'applied', appliedDate: '2024-02-20', experienceYears: 2, location: 'Bengaluru',
  },
  {
    id: 'a8', jobTitle: 'Android Developer', jobId: 'j6',
    candidateName: 'Siddharth Rao', candidateEmail: 'sid.rao@outlook.com',
    hrName: 'Nisha Agarwal', company: "BYJU'S",
    status: 'under_review', appliedDate: '2024-02-21', experienceYears: 3, location: 'Hyderabad',
  },
  {
    id: 'a9', jobTitle: 'Backend Engineer – Go', jobId: 'j9',
    candidateName: 'Meenal Joshi', candidateEmail: 'meenal.joshi@gmail.com',
    hrName: 'Sanjay Pillai', company: 'Swiggy',
    status: 'shortlisted', appliedDate: '2024-02-24', experienceYears: 4, location: 'Bengaluru',
  },
  {
    id: 'a10', jobTitle: 'Backend Engineer – Go', jobId: 'j9',
    candidateName: 'Rahul Deshmukh', candidateEmail: 'rahul.deshmukh@yahoo.in',
    hrName: 'Sanjay Pillai', company: 'Swiggy',
    status: 'interview', appliedDate: '2024-02-25', experienceYears: 3, location: 'Pune',
  },
  {
    id: 'a11', jobTitle: 'Backend Engineer – Go', jobId: 'j9',
    candidateName: 'Divya Menon', candidateEmail: 'divya.menon@proton.me',
    hrName: 'Sanjay Pillai', company: 'Swiggy',
    status: 'selected', appliedDate: '2024-02-26', experienceYears: 5, location: 'Bengaluru',
  },
  {
    id: 'a12', jobTitle: 'Senior React Developer', jobId: 'j1',
    candidateName: 'Gaurav Tiwari', candidateEmail: 'gaurav.tiwari@gmail.com',
    hrName: 'Rajesh Kapoor', company: 'Infosys Ltd',
    status: 'rejected', appliedDate: '2024-02-14', experienceYears: 2, location: 'Noida',
  },
]

const STATUS_OPTIONS = [
  { value: 'applied',      label: 'Applied' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted',  label: 'Shortlisted' },
  { value: 'interview',    label: 'Interview' },
  { value: 'selected',     label: 'Selected' },
  { value: 'rejected',     label: 'Rejected' },
]

// ── Component ──────────────────────────────────────────────────────────────

/**
 * AdminApplications
 * Admin overview of all candidate applications across the platform.
 * Read-only — admin observes and audits; no status mutations.
 */
export function AdminApplications() {
  const [applications]                    = useState(MOCK_APPLICATIONS)
  const [selectedJobId,  setSelectedJobId]  = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [searchText,     setSearchText]     = useState('')

  // ── Derived filtered list ─────────────────────────────────────────────
  const filteredApps = useMemo(() => {
    const q = searchText.toLowerCase()
    return applications.filter((app) => {
      const matchSearch = !q
        || app.candidateName.toLowerCase().includes(q)
        || app.company.toLowerCase().includes(q)
      const matchJob    = !selectedJobId    || app.jobId  === selectedJobId
      const matchStatus = !selectedStatus   || app.status === selectedStatus
      return matchSearch && matchJob && matchStatus
    })
  }, [applications, searchText, selectedJobId, selectedStatus])

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="Applications Overview"
        subtitle="All candidate applications across the platform"
        actions={
          <Space>
            <Tag color="blue">{applications.length} Total</Tag>
            <Tag color="green">
              {applications.filter((a) => a.status === 'selected').length} Selected
            </Tag>
            <Tag color="red">
              {applications.filter((a) => a.status === 'rejected').length} Rejected
            </Tag>
          </Space>
        }
      />

      <Row gutter={12} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Input.Search
            placeholder="Search by candidate or company"
            style={{ width: 260 }}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col>
          <Select
            placeholder="Filter by Job"
            allowClear
            style={{ width: 220 }}
            options={MOCK_JOBS.map((j) => ({ value: j.id, label: j.title }))}
            onChange={(val) => setSelectedJobId(val ?? null)}
          />
        </Col>
        <Col>
          <Select
            placeholder="Filter by Status"
            allowClear
            style={{ width: 180 }}
            options={STATUS_OPTIONS}
            onChange={(val) => setSelectedStatus(val ?? null)}
          />
        </Col>
        <Col style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Text type="secondary">{filteredApps.length} results</Typography.Text>
        </Col>
      </Row>

      <AdminApplicationsTable applications={filteredApps} />
    </div>
  )
}
