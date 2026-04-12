import { useEffect, useMemo, useState } from 'react'
import { Col, Input, Row, Select, Space, Tag, Typography, Skeleton, Alert } from 'antd'

import { PageHeader }               from '../../components/ui'
import { AdminApplicationsTable }   from '../../components/admin/AdminApplicationsTable'
import { adminService } from '../../services'

const STATUS_OPTIONS = [
  { value: 'applied',      label: 'Applied' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted',  label: 'Shortlisted' },
  { value: 'interview',    label: 'Interview' },
  { value: 'selected',     label: 'Selected' },
  { value: 'rejected',     label: 'Rejected' },
]

/**
 * AdminApplications
 * Admin overview of all candidate applications across the platform.
 * Read-only — admin observes and audits; no status mutations.
 */
export function AdminApplications() {
  const [applications,   setApplications]   = useState([])
  const [jobs,           setJobs]           = useState([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState(null)

  const [selectedJobId,  setSelectedJobId]  = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [searchText,     setSearchText]     = useState('')

  useEffect(() => {
    async function fetchAll() {
      try {
        const [apps, jobList] = await Promise.all([
          adminService.getApplications(),
          adminService.getJobs(),
        ])
        setApplications(apps)
        setJobs(jobList)
      } catch {
        setError('Failed to load applications. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const filteredApps = useMemo(() => {
    const q = searchText.toLowerCase()
    return applications.filter((app) => {
      const matchSearch = !q
        || app.candidateName.toLowerCase().includes(q)
        || app.jobTitle.toLowerCase().includes(q)
        || (app.company || '').toLowerCase().includes(q)
      const matchJob    = !selectedJobId    || app.jobId  === selectedJobId
      const matchStatus = !selectedStatus   || app.status === selectedStatus
      return matchSearch && matchJob && matchStatus
    })
  }, [applications, searchText, selectedJobId, selectedStatus])

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

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <>
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
                options={jobs.map((j) => ({ value: j.id, label: j.title }))}
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
        </>
      )}
    </div>
  )
}

export default AdminApplications
