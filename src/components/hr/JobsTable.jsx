import { Tag, Switch, Button, Space, Typography } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { DataTable } from '../ui/DataTable'

const { Text } = Typography

/**
 * JobsTable
 * Displays all job listings in a DataTable with status toggles and action buttons.
 * Pure display component — all mutations are handled via callback props.
 *
 * @param {object}   props
 * @param {Array}    props.jobs           - Array of job objects to display
 * @param {Function} props.onEdit         - Called with the job object when Edit is clicked
 * @param {Function} props.onDelete       - Called with the job object when Delete is clicked
 * @param {Function} props.onToggleActive - Called with jobId when the active Switch changes
 */
export function JobsTable({ jobs, onEdit, onDelete, onToggleActive }) {
  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Type',
      dataIndex: 'jobType',
      key: 'jobType',
      render: (type) => <Tag>{type}</Tag>,
    },
    {
      title: 'Experience',
      dataIndex: 'experienceRequired',
      key: 'experienceRequired',
      render: (yrs) => `${yrs} yrs`,
    },
    {
      title: 'Salary',
      dataIndex: 'salaryRange',
      key: 'salaryRange',
    },
    {
      title: 'Applicants',
      dataIndex: 'applicants',
      key: 'applicants',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          size="small"
          onChange={() => onToggleActive(record.id)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
          />
        </Space>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      dataSource={jobs}
      loading={false}
      emptyText="No jobs posted yet. Click 'Post New Job' to get started."
    />
  )
}
