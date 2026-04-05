import { Row, Col, Select } from 'antd'

const STATUS_OPTIONS = [
  { value: 'applied',      label: 'Applied' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted',  label: 'Shortlisted' },
  { value: 'interview',    label: 'Interview' },
  { value: 'selected',     label: 'Selected' },
  { value: 'rejected',     label: 'Rejected' },
]

/**
 * ApplicationFilters
 * Provides job and status filter dropdowns for the Applications page.
 * Pure display component — all state lives in the parent.
 *
 * @param {object}        props
 * @param {Array}         props.jobs             - Array of { id, title } for the job dropdown
 * @param {string|null}   props.selectedJobId    - Currently selected job filter value
 * @param {string|null}   props.selectedStatus   - Currently selected status filter value
 * @param {Function}      props.onJobChange      - Called with job id or undefined on clear
 * @param {Function}      props.onStatusChange   - Called with status string or undefined on clear
 */
export function ApplicationFilters({
  jobs,
  selectedJobId,
  selectedStatus,
  onJobChange,
  onStatusChange,
}) {
  return (
    <Row gutter={12} wrap style={{ marginBottom: 16 }}>
      <Col>
        <Select
          placeholder="Filter by Job"
          allowClear
          value={selectedJobId ?? undefined}
          style={{ width: 220 }}
          onChange={(val) => onJobChange(val ?? null)}
          options={jobs.map((j) => ({ value: j.id, label: j.title }))}
        />
      </Col>

      <Col>
        <Select
          placeholder="Filter by Status"
          allowClear
          value={selectedStatus ?? undefined}
          style={{ width: 200 }}
          onChange={(val) => onStatusChange(val ?? null)}
          options={STATUS_OPTIONS}
        />
      </Col>
    </Row>
  )
}
