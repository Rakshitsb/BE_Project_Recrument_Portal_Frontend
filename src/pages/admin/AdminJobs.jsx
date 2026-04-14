import { useEffect, useMemo, useState } from 'react'
import { Col, Input, Row, Select, Space, Tag, Typography, Skeleton, Alert } from 'antd'

import { PageHeader }          from '../../components/ui'
import { AdminJobsTable }      from '../../components/admin/AdminJobsTable'
import { AdminJobDetailModal } from '../../components/admin/AdminJobDetailModal'
import { adminService } from '../../services'

const JOB_TYPE_OPTIONS = ['Full-Time', 'Part-Time', 'Contract', 'Remote'].map(
  (t) => ({ value: t, label: t }),
)

const STATUS_OPTIONS = [
  { value: 'active',   label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

/**
 * AdminJobs
 * Admin overview of all platform job postings with search, type,
 * and status filters plus a detail modal.
 */
export function AdminJobs() {
  const [jobs,         setJobs]         = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)

  const [searchText,   setSearchText]   = useState('')
  const [filterType,   setFilterType]   = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)
  const [selectedJob,  setSelectedJob]  = useState(null)
  const [modalOpen,    setModalOpen]    = useState(false)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await adminService.getJobs()
        setJobs(data)
      } catch {
        setError('Failed to load jobs. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const filteredJobs = useMemo(() => {
    const q = searchText.toLowerCase()
    return jobs.filter((job) => {
      const matchSearch = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q)
      const matchType   = !filterType   || job.jobType === filterType
      const matchStatus = !filterStatus || (filterStatus === 'active' ? job.isActive : !job.isActive)
      return matchSearch && matchType && matchStatus
    })
  }, [jobs, searchText, filterType, filterStatus])

  function handleView(job) {
    setSelectedJob(job)
    setModalOpen(true)
  }

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
        </>
      )}

      <AdminJobDetailModal
        open={modalOpen}
        job={selectedJob}
        onClose={() => { setModalOpen(false); setSelectedJob(null) }}
      />
    </div>
  )
}

export default AdminJobs
