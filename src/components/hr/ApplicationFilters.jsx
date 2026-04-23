import { Col, Row, Select } from 'antd'

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'selected', label: 'Selected' },
  { value: 'rejected', label: 'Rejected' },
]

export function ApplicationFilters({
  jobs,
  selectedJobId,
  selectedStatus,
  onJobChange,
  onStatusChange,
  jobsLoading = false,
  actions = null,
}) {
  return (
    <Row gutter={12} wrap className="mb-4">
      <Col>
        <Select
          placeholder="Filter by Job"
          allowClear
          loading={jobsLoading}
          disabled={jobsLoading}
          style={{ width: 220 }}
          value={selectedJobId ?? undefined}
          onChange={onJobChange}
          options={jobs.map((job) => ({ value: job.id, label: job.title }))}
        />
      </Col>

      <Col>
        <Select
          placeholder="Filter by Status"
          allowClear
          value={selectedStatus ?? undefined}
          style={{ width: 200 }}
          onChange={(value) => onStatusChange(value ?? null)}
          options={STATUS_OPTIONS}
        />
      </Col>

      {actions ? (
        <Col flex="auto" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {actions}
        </Col>
      ) : null}
    </Row>
  )
}
