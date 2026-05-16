import { Avatar, Space, Tag, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import { DataTable }   from '../ui/DataTable'
import { StatusBadge } from '../ui/StatusBadge'

const { Text } = Typography

/**
 * AdminApplicationsTable
 * Read-only table of all candidate applications across the platform.
 * Admin observes only — no status updates or actions.
 *
 * @param {object} props
 * @param {Array}  props.applications - Filtered application records to display
 */
export function AdminApplicationsTable({ applications }) {
  const columns = [
    {
      title:     'Candidate',
      dataIndex: 'candidateName',
      key:       'candidateName',
      render: (name, record) => (
        <Space size={8}>
          <Avatar size="small" src={record.candidateAvatarUrl || undefined} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title:     'Email',
      dataIndex: 'candidateEmail',
      key:       'candidateEmail',
      render: (email) => (
        <Text ellipsis copyable style={{ maxWidth: 180 }}>
          {email}
        </Text>
      ),
    },
    {
      title:     'Job Title',
      dataIndex: 'jobTitle',
      key:       'jobTitle',
    },
    {
      title:     'Company',
      dataIndex: 'company',
      key:       'company',
      render: (company, record) => (
        <Space size={8}>
          <Avatar size="small" src={record.companyLogoUrl || undefined} icon={<UserOutlined />} />
          <Text>{company}</Text>
        </Space>
      ),
    },
    {
      title:     'HR Name',
      dataIndex: 'hrName',
      key:       'hrName',
    },
    {
      title:     'Experience',
      dataIndex: 'experienceYears',
      key:       'experienceYears',
      align:     'center',
      render:    (yrs) => `${yrs} yrs`,
    },
    {
      title:     'Applied On',
      dataIndex: 'appliedDate',
      key:       'appliedDate',
    },
    {
      title:  'Status',
      key:    'status',
      render: (_, record) => <StatusBadge status={record.status} />,
    },
  ]

  return (
    <DataTable
      columns={columns}
      dataSource={applications}
      emptyText="No applications match the current filters"
    />
  )
}
