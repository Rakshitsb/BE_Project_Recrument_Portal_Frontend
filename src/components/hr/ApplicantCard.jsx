import { Avatar, Card, Descriptions, Divider, Select, Tag, Tooltip, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import { StatusBadge } from '../ui/StatusBadge'

const { Paragraph, Text, Title } = Typography

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'selected', label: 'Selected' },
  { value: 'rejected', label: 'Rejected' },
]

const NA = () => <Text type="secondary" italic>Not available</Text>

const isMissing = (value) => !value || value === '-'

function getAllowedStatusOptions(currentStatus) {
  const workflowOrder = ['applied', 'under_review', 'shortlisted', 'interview']
  const terminalStatuses = ['selected', 'rejected']

  if (terminalStatuses.includes(currentStatus)) {
    return STATUS_OPTIONS.filter((option) => option.value === currentStatus)
  }

  return STATUS_OPTIONS.filter((option) => {
    if (terminalStatuses.includes(option.value)) return true
    if (!workflowOrder.includes(currentStatus) || !workflowOrder.includes(option.value)) return false
    return workflowOrder.indexOf(option.value) >= workflowOrder.indexOf(currentStatus)
  })
}

export function ApplicantCard({ applicant, onStatusChange, statusUpdating = false }) {
  const isFallbackName = applicant.candidateName?.startsWith('Candidate ')
  const showExperienceFallback = applicant.experienceYears === '-' || applicant.experienceYears === ''
  const allowedStatusOptions = getAllowedStatusOptions(applicant.status)

  return (
    <Card>
      <div className="mb-1 flex flex-col items-center text-center">
        {isFallbackName ? (
          <Tooltip title="Full candidate profile not yet available">
            <Avatar size="large" className="mb-2.5 bg-neutral-500">?</Avatar>
          </Tooltip>
        ) : (
          <Avatar size="large" icon={<UserOutlined />} className="mb-2.5 bg-blue-600" />
        )}

        <Title level={5} className="!m-0">{applicant.candidateName}</Title>
        <Text type="secondary" className="block text-xs">
          {isMissing(applicant.candidateEmail) ? <NA /> : applicant.candidateEmail}
        </Text>
        <Text type="secondary" className="block text-xs">
          {isMissing(applicant.candidatePhone) ? <NA /> : applicant.candidatePhone}
        </Text>
      </div>

      <Divider className="!my-3" />

      <Descriptions column={1} size="small">
        <Descriptions.Item label="Job Applied">{applicant.jobTitle}</Descriptions.Item>
        <Descriptions.Item label="Location">
          {isMissing(applicant.location) ? <NA /> : applicant.location}
        </Descriptions.Item>
        <Descriptions.Item label="Experience">
          {showExperienceFallback ? <NA /> : `${applicant.experienceYears} years`}
        </Descriptions.Item>
        <Descriptions.Item label="Education">
          {isMissing(applicant.education) ? <NA /> : applicant.education}
        </Descriptions.Item>
        <Descriptions.Item label="Applied On">{applicant.appliedDate}</Descriptions.Item>
      </Descriptions>

      <Divider className="!my-3" />

      <Text strong>Skills</Text>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {applicant.skills?.length
          ? applicant.skills.map((skill) => <Tag key={skill} color="blue">{skill}</Tag>)
          : <Text type="secondary" italic>No skills listed</Text>}
      </div>

      <Divider className="!my-3" />

      <Text strong>Cover Letter</Text>
      {applicant.coverLetter ? (
        <Paragraph ellipsis={{ rows: 3, expandable: true }} className="!mb-0 !mt-1.5">
          {applicant.coverLetter}
        </Paragraph>
      ) : (
        <Text type="secondary" italic className="mt-1.5 block">
          No cover letter provided
        </Text>
      )}

      <Divider className="!my-3" />

      <Text strong>Update Status</Text>
      <Select
        value={applicant.status}
        loading={statusUpdating}
        disabled={statusUpdating}
        onChange={(value) => onStatusChange(applicant.id, value)}
        className="mt-1.5 w-full"
      >
        {allowedStatusOptions.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            <StatusBadge status={option.value} />
          </Select.Option>
        ))}
      </Select>
    </Card>
  )
}
