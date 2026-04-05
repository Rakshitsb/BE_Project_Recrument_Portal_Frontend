import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'

import { DataTable }   from '../ui/DataTable'
import { StatusBadge } from '../ui/StatusBadge'

/**
 * RecentApplicants
 * Displays a table of the most recent job applicants inside a Card.
 * Navigates to /hr/applications when "View All" is clicked.
 *
 * @param {object}  props
 * @param {Array}   props.applicants - Array of applicant objects to display
 */
export function RecentApplicants({ applicants }) {
  const navigate = useNavigate()

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Applied',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
    },
  ]

  const cardExtra = (
    <a onClick={() => navigate('/hr/applications')} style={{ cursor: 'pointer' }}>
      View All
    </a>
  )

  return (
    <Card title="Recent Applicants" extra={cardExtra}>
      <DataTable
        columns={columns}
        dataSource={applicants}
        loading={false}
        emptyText="No recent applicants"
        extraProps={{ pagination: false }}
      />
    </Card>
  )
}
