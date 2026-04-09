import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Row, Col, Card, Input, Select, Tag, Button, Typography, Space, Empty,
} from 'antd'
import {
  SearchOutlined, EnvironmentOutlined, DollarOutlined,
  ClockCircleOutlined, HeartOutlined, SendOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const mockJobs = [
  {
    id: 1, title: 'Senior React Developer', company: 'TechCorp',
    location: 'Remote', salary: '$80k–$120k', type: 'Full-time',
    tags: ['React', 'TypeScript', 'Node.js'], posted: '2 days ago',
  },
  {
    id: 2, title: 'Frontend Engineer', company: 'StartupXYZ',
    location: 'New York, NY', salary: '$70k–$100k', type: 'Full-time',
    tags: ['React', 'CSS', 'Figma'], posted: '4 days ago',
  },
  {
    id: 3, title: 'UI/UX Developer', company: 'Acme Inc',
    location: 'San Francisco, CA', salary: '$65k–$90k', type: 'Contract',
    tags: ['Vue.js', 'Tailwind', 'UX'], posted: '1 week ago',
  },
  {
    id: 4, title: 'Full Stack Engineer', company: 'GlobalTech',
    location: 'Remote', salary: '$90k–$140k', type: 'Full-time',
    tags: ['React', 'Python', 'AWS'], posted: '3 days ago',
  },
]

function JobCard({ job }) {
  const navigate = useNavigate()
  return (
    <Card
      className="card-shadow fade-in-up"
      hoverable
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/candidate/jobs/${job.id}`)}
      actions={[
        <Button key="save" type="text" icon={<HeartOutlined />}>Save</Button>,
        <Button
          key="apply"
          type="primary"
          icon={<SendOutlined />}
          size="small"
          onClick={(e) => { e.stopPropagation(); navigate(`/candidate/jobs/${job.id}`) }}
        >
          Apply
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 12 }}>
        <Title level={5} style={{ margin: 0 }}>{job.title}</Title>
        <Text type="secondary">{job.company}</Text>
      </div>
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <Text>
          <EnvironmentOutlined style={{ marginRight: 6, color: '#8c8c8c' }} />
          {job.location}
        </Text>
        <Text>
          <DollarOutlined style={{ marginRight: 6, color: '#52c41a' }} />
          {job.salary}
        </Text>
        <Text>
          <ClockCircleOutlined style={{ marginRight: 6, color: '#8c8c8c' }} />
          {job.posted}
        </Text>
      </Space>
      <div style={{ marginTop: 12 }}>
        <Tag color="blue">{job.type}</Tag>
        {job.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </Card>
  )
}

function JobListings() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = mockJobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || j.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="fade-in-up">
      <Title level={3} style={{ marginBottom: 4 }}>Browse Jobs</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
        {filtered.length} opportunities available
      </Text>

      {/* Filters */}
      <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={16}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by job title or company..."
            size="large"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            size="large"
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: '100%' }}
          >
            <Option value="all">All Types</Option>
            <Option value="Full-time">Full-time</Option>
            <Option value="Contract">Contract</Option>
            <Option value="Part-time">Part-time</Option>
          </Select>
        </Col>
      </Row>

      {/* Job Grid */}
      {filtered.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filtered.map((job) => (
            <Col key={job.id} xs={24} sm={12} lg={8}>
              <JobCard job={job} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No jobs found matching your search" />
      )}
    </div>
  )
}

export default JobListings
