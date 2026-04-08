import { Avatar, Card, Descriptions, Divider, Select, Tag, Tooltip, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import { StatusBadge } from '../ui/StatusBadge'

const { Title, Text, Paragraph } = Typography

const STATUS_OPTIONS = [
  { value: 'applied',      label: 'Applied' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted',  label: 'Shortlisted' },
  { value: 'interview',    label: 'Interview' },
  { value: 'selected',     label: 'Selected' },
  { value: 'rejected',     label: 'Rejected' },
]

/** Renders muted italic fallback for missing/placeholder fields. */
const NA = () => <Text type="secondary" italic>Not available</Text>

/** Returns true when a field value is a placeholder or empty. */
const isMissing = (val) => !val || val === '—'

/**
 * ApplicantCard
 * Detailed profile card for a single applicant.
 * Degrades gracefully when candidate detail fields are missing (Phase 1).
 *
 * @param {object}   props
 * @param {object}   props.applicant       - The applicant data object
 * @param {Function} props.onStatusChange  - Called with (appId, newStatus) on update
 * @param {boolean}  props.statusUpdating  - Disables status Select during API call
 */
export function ApplicantCard({ applicant, onStatusChange, statusUpdating = false }) {
  const isFallbackName = applicant.candidateName?.startsWith('Candidate ')

  return (
    <Card>

      {/* ── Section 1: Header ── */}
      <div className="flex flex-col items-center" style={{ textAlign: 'center', marginBottom: 4 }}>
        {isFallbackName ? (
          <Tooltip title="Full candidate profile not yet available">
            <Avatar size="large" style={{ backgroundColor: '#8c8c8c', marginBottom: 10 }}>?</Avatar>
          </Tooltip>
        ) : (
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1677ff', marginBottom: 10 }}
          />
        )}

        <Title level={5} style={{ margin: 0 }}>{applicant.candidateName}</Title>

        <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
          {isMissing(applicant.candidateEmail) ? <NA /> : applicant.candidateEmail}
        </Text>

        <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
          {isMissing(applicant.candidatePhone) ? <NA /> : applicant.candidatePhone}
        </Text>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {/* ── Section 2: Details ── */}
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Job Applied">{applicant.jobTitle}</Descriptions.Item>
        <Descriptions.Item label="Location">
          {isMissing(applicant.location) ? <NA /> : applicant.location}
        </Descriptions.Item>
        <Descriptions.Item label="Experience">
          {applicant.experienceYears === '—' ? <NA /> : `${applicant.experienceYears} years`}
        </Descriptions.Item>
        <Descriptions.Item label="Education">
          {isMissing(applicant.education) ? <NA /> : applicant.education}
        </Descriptions.Item>
        <Descriptions.Item label="Applied On">{applicant.appliedDate}</Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: '12px 0' }} />

      {/* ── Section 3: Skills ── */}
      <Text strong>Skills</Text>
      <div className="flex flex-wrap" style={{ gap: 4, marginTop: 6 }}>
        {applicant.skills?.length
          ? applicant.skills.map((skill) => <Tag key={skill} color="blue">{skill}</Tag>)
          : <Text type="secondary" italic>No skills listed</Text>
        }
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {/* ── Section 4: Cover Letter ── */}
      <Text strong>Cover Letter</Text>
      {applicant.coverLetter ? (
        <Paragraph
          ellipsis={{ rows: 3, expandable: true }}
          style={{ marginTop: 6, marginBottom: 0 }}
        >
          {applicant.coverLetter}
        </Paragraph>
      ) : (
        <Text type="secondary" italic style={{ display: 'block', marginTop: 6 }}>
          No cover letter provided
        </Text>
      )}

      <Divider style={{ margin: '12px 0' }} />

      {/* ── Section 5: Status Update ── */}
      <Text strong>Update Status</Text>
      <Select
        value={applicant.status}
        loading={statusUpdating}
        disabled={statusUpdating}
        onChange={(val) => onStatusChange(applicant.id, val)}
        style={{ width: '100%', marginTop: 6 }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <Select.Option key={opt.value} value={opt.value}>
            <StatusBadge status={opt.value} />
          </Select.Option>
        ))}
      </Select>

    </Card>
  )
}
