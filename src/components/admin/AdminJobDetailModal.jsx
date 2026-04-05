import { Button, Descriptions, Divider, Modal, Tag, Typography } from 'antd'

import { StatusBadge } from '../ui/StatusBadge'

const { Text, Paragraph } = Typography

const JOB_TYPE_COLOR = {
  'Full-Time': 'blue',
  'Part-Time': 'orange',
  'Contract':  'gold',
  'Remote':    'cyan',
}

/**
 * AdminJobDetailModal
 * Full detail view for a platform job posting.
 * Read-only — admin cannot edit or change job state.
 *
 * @param {object}   props
 * @param {boolean}  props.open    - Modal visibility
 * @param {object}   props.job     - Job data object (null-safe guarded)
 * @param {Function} props.onClose - Close handler
 */
export function AdminJobDetailModal({ open, job, onClose }) {
  if (!job) return null

  const footer = <Button onClick={onClose}>Close</Button>

  return (
    <Modal
      open={open}
      title={job.title}
      width={640}
      footer={footer}
      onCancel={onClose}
      centered
    >
      {/* ── Section 1: Meta Info ─────────────────────────────────── */}
      <Descriptions column={2} size="small" bordered={false}>
        <Descriptions.Item label="Company">{job.company}</Descriptions.Item>
        <Descriptions.Item label="HR Manager">{job.hrName}</Descriptions.Item>
        <Descriptions.Item label="Location">{job.location}</Descriptions.Item>
        <Descriptions.Item label="Job Type">
          <Tag color={JOB_TYPE_COLOR[job.jobType] ?? 'default'}>{job.jobType}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Experience">
          {job.experienceRequired} years
        </Descriptions.Item>
        <Descriptions.Item label="Salary">
          {job.salaryRange || 'Not specified'}
        </Descriptions.Item>
        <Descriptions.Item label="Posted On">{job.postedDate}</Descriptions.Item>
        <Descriptions.Item label="Applicants">{job.applicants}</Descriptions.Item>
        <Descriptions.Item label="Cover Letter">
          {job.coverLetterRequired ? 'Required' : 'Not Required'}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <StatusBadge status={job.isActive ? 'active' : 'inactive'} />
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* ── Section 2: Required Skills ───────────────────────────── */}
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        Required Skills
      </Text>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {job.requiredSkills.map((skill) => (
          <Tag key={skill} color="blue">{skill}</Tag>
        ))}
      </div>

      <Divider />

      {/* ── Section 3: Job Description ───────────────────────────── */}
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        Job Description
      </Text>
      <Paragraph
        ellipsis={{ rows: 4, expandable: true }}
        style={{ marginBottom: 0 }}
      >
        {job.description}
      </Paragraph>
    </Modal>
  )
}
