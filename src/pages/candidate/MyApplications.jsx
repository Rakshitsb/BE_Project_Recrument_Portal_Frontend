import { Table, Typography, Button, Tag, Space } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import StatusBadge from '../../components/ui/StatusBadge'

const { Title, Text } = Typography

const mockApplications = [
  { id: 1, role: 'Senior React Developer', company: 'TechCorp',    status: 'interview', applied: '2026-03-20', salary: '$80k–$120k' },
  { id: 2, role: 'Frontend Engineer',       company: 'StartupXYZ',  status: 'reviewed',  applied: '2026-03-18', salary: '$70k–$100k' },
  { id: 3, role: 'UI/UX Developer',         company: 'Acme Inc',    status: 'pending',   applied: '2026-03-15', salary: '$65k–$90k' },
  { id: 4, role: 'Full Stack Engineer',     company: 'GlobalTech',  status: 'accepted',  applied: '2026-03-10', salary: '$90k–$140k' },
  { id: 5, role: 'React Native Dev',        company: 'MobileFirst', status: 'rejected',  applied: '2026-03-05', salary: '$60k–$80k' },
]

const columns = [
  {
    title: 'Position',
    dataIndex: 'role',
    key: 'role',
    render: (text, record) => (
      <div>
        <Text strong>{text}</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 13 }}>{record.company}</Text>
      </div>
    ),
  },
  {
    title: 'Salary Range',
    dataIndex: 'salary',
    key: 'salary',
  },
  {
    title: 'Applied On',
    dataIndex: 'applied',
    key: 'applied',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <StatusBadge status={status} />,
    filters: [
      { text: 'Pending',   value: 'pending' },
      { text: 'Reviewed',  value: 'reviewed' },
      { text: 'Interview', value: 'interview' },
      { text: 'Accepted',  value: 'accepted' },
      { text: 'Rejected',  value: 'rejected' },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space>
        <Button type="text" icon={<EyeOutlined />} size="small">
          View
        </Button>
      </Space>
    ),
  },
]

function MyApplications() {
  return (
    <div className="fade-in-up">
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>My Applications</Title>
        <Text type="secondary">Track your job application statuses</Text>
      </div>

      <Table
        dataSource={mockApplications}
        columns={columns}
        rowKey="id"
        className="card-shadow"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default MyApplications
