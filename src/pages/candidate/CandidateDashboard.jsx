import { Row, Col, Typography, Card, List, Tag, Avatar } from 'antd'
import {
  FileSearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from '@ant-design/icons'
import useAuthStore from '../../store/authStore'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'

const { Title, Text } = Typography

const recentActivity = [
  { id: 1, company: 'TechCorp', role: 'Frontend Engineer',   status: 'interview', daysAgo: 1 },
  { id: 2, company: 'StartupXYZ', role: 'React Developer',    status: 'reviewed',  daysAgo: 3 },
  { id: 3, company: 'Acme Inc',   role: 'UI Engineer',         status: 'pending',   daysAgo: 5 },
  { id: 4, company: 'GlobalTech', role: 'Full Stack Dev',      status: 'accepted',  daysAgo: 7 },
]

function CandidateDashboard() {
  const { user } = useAuthStore()

  return (
    <div className="fade-in-up">
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          👋 Hello, {user?.name || 'Candidate'}!
        </Title>
        <Text type="secondary">Here's your job search overview</Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Jobs Applied"
            value={12}
            icon={<FileSearchOutlined />}
            color="#1890ff"
            trend="↑ 3 this week"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Interviews"
            value={4}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            trend="↑ 1 scheduled"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Reviews"
            value={6}
            icon={<ClockCircleOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Saved Jobs"
            value={18}
            icon={<FireOutlined />}
            color="#ff4d4f"
          />
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card
        title="Recent Applications"
        extra={<Tag color="blue">Last 30 days</Tag>}
        className="card-shadow"
      >
        <List
          dataSource={recentActivity}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[<StatusBadge key="status" status={item.status} />]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: '#1890ff' }}>
                    {item.company[0]}
                  </Avatar>
                }
                title={item.role}
                description={
                  <span>
                    {item.company} ·{' '}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.daysAgo}d ago
                    </Text>
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default CandidateDashboard
