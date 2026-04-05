import { Avatar, Card, Descriptions, Divider, Select, Tag, Typography } from 'antd'
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

/**
 * ApplicantCard
 * Detailed profile card for a single applicant.
 * Displays contact info, job details, skills, cover letter, and a live status updater.
 *
 * @param {object}   props
 * @param {object}   props.applicant       - The applicant data object
 * @param {Function} props.onStatusChange  - Called with (appId, newStatus) on status update
 */
export function ApplicantCard({ applicant, onStatusChange }) {
  return (
    <Card>

      {/* ── Section 1: Header ── */}
      <div className="flex flex-col items-center" style={{ textAlign: 'center', marginBottom: 4 }}>
        <Avatar
          size="large"
          icon={<UserOutlined />}
          style={{ backgroundColor: '#1677ff', marginBottom: 10 }}
        />
        <Title level={5} style={{ margin: 0 }}>
          {applicant.candidateName}
        </Title>
        <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
          {applicant.candidateEmail}
        </Text>
        <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
          {applicant.candidatePhone}
        </Text>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {/* ── Section 2: Details ── */}
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Job Applied">{applicant.jobTitle}</Descriptions.Item>
        <Descriptions.Item label="Location">{applicant.location}</Descriptions.Item>
        <Descriptions.Item label="Experience">{applicant.experienceYears} years</Descriptions.Item>
        <Descriptions.Item label="Education">{applicant.education}</Descriptions.Item>
        <Descriptions.Item label="Applied On">{applicant.appliedDate}</Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: '12px 0' }} />

      {/* ── Section 3: Skills ── */}
      <Text strong>Skills</Text>
      <div className="flex flex-wrap" style={{ gap: 4, marginTop: 6 }}>
        {applicant.skills.map((skill) => (
          <Tag key={skill} color="blue">{skill}</Tag>
        ))}
      </div>

      {/* ── Section 4: Cover Letter ── */}
      {applicant.coverLetter && (
        <>
          <Divider style={{ margin: '12px 0' }} />
          <Text strong>Cover Letter</Text>
          <Paragraph
            ellipsis={{ rows: 3, expandable: true }}
            style={{ marginTop: 6, marginBottom: 0 }}
          >
            {applicant.coverLetter}
          </Paragraph>
        </>
      )}

      <Divider style={{ margin: '12px 0' }} />

      {/* ── Section 5: Status Update ── */}
      <Text strong>Update Status</Text>
      <Select
        value={applicant.status}
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
