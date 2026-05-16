import { Avatar, Button, Space, Tag, Typography } from 'antd'
import { UserOutlined, EyeOutlined } from '@ant-design/icons'

import { DataTable }   from '../ui/DataTable'
import { StatusBadge } from '../ui/StatusBadge'

const { Link, Text } = Typography

const JOB_TYPE_COLOR = {
  'Full-Time': 'blue',
  'Part-Time': 'orange',
  'Contract':  'gold',
  'Remote':    'cyan',
}

/**
 * AdminJobsTable
 * Read-only table of all platform job postings.
 * Clicking a job title or the eye button opens the detail modal.
 *
 * @param {object}   props
 * @param {Array}    props.jobs   - Filtered job records to display
 * @param {Function} props.onView - Called with a job object
 */
export function AdminJobsTable({ jobs, onView }) {
  const columns = [
    {
      title:     'Job Title',
      dataIndex: 'title',
      key:       'title',
      render: (title, record) => (
        <Link strong onClick={() => onView(record)}>
          {title}
        </Link>
      ),
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
      render: (name, record) => (
        <Space size={8}>
          <Avatar size="small" src={record.companyLogoUrl || undefined} icon={<UserOutlined />} />
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title:     'Location',
      dataIndex: 'location',
      key:       'location',
    },
    {
      title:     'Type',
      dataIndex: 'jobType',
      key:       'jobType',
      render: (type) => (
        <Tag color={JOB_TYPE_COLOR[type] ?? 'default'}>{type}</Tag>
      ),
    },
    {
      title:     'Experience',
      dataIndex: 'experienceRequired',
      key:       'experienceRequired',
      align:     'center',
      render:    (yrs) => `${yrs} yrs`,
    },
    {
      title:     'Applicants',
      dataIndex: 'applicants',
      key:       'applicants',
      align:     'center',
      render:    (count) => <Tag color="blue">{count}</Tag>,
    },
    {
      title:  'Status',
      key:    'status',
      render: (_, record) => (
        <StatusBadge status={record.isActive ? 'active' : 'inactive'} />
      ),
    },
    {
      title:  'Actions',
      key:    'actions',
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => onView(record)}
        />
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      dataSource={jobs}
      emptyText="No jobs match the current filters"
    />
  )
}
