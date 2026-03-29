import { Row, Col, Typography, Card, List, Avatar, Tag, Progress } from 'antd'
import {
  SolutionOutlined, TeamOutlined, ClockCircleOutlined, CheckCircleOutlined,
} from '@ant-design/icons'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'

const { Title, Text } = Typography

const recentApplications = [
  { id: 1, candidate: 'Alice Johnson', role: 'Senior React Developer', status: 'interview', time: '1h ago' },
  { id: 2, candidate: 'Bob Smith',     role: 'Backend Engineer',       status: 'pending',   time: '3h ago' },
  { id: 3, candidate: 'Carol White',   role: 'UI/UX Designer',         status: 'reviewed',  time: '1d ago' },
  { id: 4, candidate: 'Dan Lee',       role: 'DevOps Engineer',        status: 'accepted',  time: '2d ago' },
]

function HRDashboard() {
  return (
    <div className="fade-in-up">
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>HR Dashboard</Title>
        <Text type="secondary">Recruitment overview and metrics</Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Jobs"
            value={8}
            icon={<SolutionOutlined />}
            color="#1890ff"
            trend="2 closing soon"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Applicants"
            value={143}
            icon={<TeamOutlined />}
            color="#722ed1"
            trend="↑ 12 this week"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Review"
            value={31}
            icon={<ClockCircleOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Hired This Month"
            value={6}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            trend="Goal: 10"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Applications */}
        <Col xs={24} lg={14}>
          <Card title="Recent Applications" className="card-shadow">
            <List
              dataSource={recentApplications}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  actions={[<StatusBadge key="status" status={item.status} />]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: '#722ed1' }}>
                        {item.candidate[0]}
                      </Avatar>
                    }
                    title={item.candidate}
                    description={
                      <span>
                        {item.role} ·{' '}
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.time}
                        </Text>
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Hiring Funnel */}
        <Col xs={24} lg={10}>
          <Card title="Hiring Funnel" className="card-shadow">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Applied',   count: 143, percent: 100, color: '#1890ff' },
                { label: 'Screened',  count: 72,  percent: 50,  color: '#722ed1' },
                { label: 'Interview', count: 28,  percent: 20,  color: '#faad14' },
                { label: 'Offered',   count: 10,  percent: 7,   color: '#52c41a' },
                { label: 'Hired',     count: 6,   percent: 4,   color: '#13c2c2' },
              ].map((stage) => (
                <div key={stage.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>{stage.label}</Text>
                    <Text strong>{stage.count}</Text>
                  </div>
                  <Progress
                    percent={stage.percent}
                    strokeColor={stage.color}
                    showInfo={false}
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default HRDashboard
