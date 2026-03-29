import { useState } from 'react'
import { Table, Button, Avatar, Typography, Space, Select, Input } from 'antd'
import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import StatusBadge from '../../components/ui/StatusBadge'

const { Title, Text } = Typography
const { Option } = Select

const mockApplications = [
  { id: 1, name: 'Alice Johnson',  role: 'Senior React Developer', status: 'interview', applied: '2026-03-22', experience: '5 yrs' },
  { id: 2, name: 'Bob Smith',      role: 'Backend Engineer',       status: 'pending',   applied: '2026-03-21', experience: '3 yrs' },
  { id: 3, name: 'Carol White',    role: 'UI/UX Designer',         status: 'reviewed',  applied: '2026-03-20', experience: '4 yrs' },
  { id: 4, name: 'Dan Lee',        role: 'DevOps Engineer',        status: 'accepted',  applied: '2026-03-18', experience: '7 yrs' },
  { id: 5, name: 'Eva Rodriguez',  role: 'Product Manager',        status: 'rejected',  applied: '2026-03-15', experience: '6 yrs' },
  { id: 6, name: 'Frank Kim',      role: 'Senior React Developer', status: 'pending',   applied: '2026-03-14', experience: '2 yrs' },
]

function Applications() {
  const [search,     setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockApplications.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const columns = [
    {
      title: 'Applicant',
      key: 'applicant',
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }}>{record.name[0]}</Avatar>
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.experience}</Text>
          </div>
        </Space>
      ),
    },
    { title: 'Applied For',  dataIndex: 'role',    key: 'role' },
    { title: 'Applied On',   dataIndex: 'applied', key: 'applied' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Action', key: 'action',
      render: () => (
        <Button type="primary" ghost size="small" icon={<EyeOutlined />}>
          Review
        </Button>
      ),
    },
  ]

  return (
    <div className="fade-in-up">
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>All Applications</Title>
        <Text type="secondary">Review and manage candidate applications</Text>
      </div>

      {/* Filters */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search applicants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280 }}
        />
        <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 160 }}>
          <Option value="all">All Statuses</Option>
          <Option value="pending">Pending</Option>
          <Option value="reviewed">Reviewed</Option>
          <Option value="interview">Interview</Option>
          <Option value="accepted">Accepted</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
      </Space>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        className="card-shadow"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default Applications
