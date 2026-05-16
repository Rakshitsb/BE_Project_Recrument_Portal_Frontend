import { Avatar, Card, Col, Descriptions, Divider, Row, Statistic, Typography } from 'antd'
import {
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { Title, Text, Link } = Typography

function IconLabel({ icon, text }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {icon}
      {text}
    </span>
  )
}

export function HRProfileCard({ profile }) {
  if (!profile) return null

  return (
    <Row gutter={16}>
      <Col xs={24} lg={10}>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <Avatar
              size={64}
              src={profile.avatarUrl || profile.avatar_url || undefined}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1677ff', marginBottom: 12 }}
            />
            <Title level={4} style={{ margin: 0 }}>{profile.name || 'Unnamed HR'}</Title>
            <Text type="secondary">{profile.designation || 'No designation added'}</Text>
          </div>

          <Divider />

          <Descriptions column={1} size="small">
            <Descriptions.Item label={<IconLabel icon={<MailOutlined />} text="Email" />}>
              {profile.email || 'Not provided'}
            </Descriptions.Item>
            <Descriptions.Item label={<IconLabel icon={<PhoneOutlined />} text="Phone" />}>
              {profile.phone || 'Not provided'}
            </Descriptions.Item>
            <Descriptions.Item label={<IconLabel icon={<CalendarOutlined />} text="Joined" />}>
              {profile.joinedDate || profile.createdAt || 'Not available'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>

      <Col xs={24} lg={14}>
        <Card>
          <Title level={5} style={{ marginTop: 0 }}>Company Information</Title>

          <Descriptions column={2} size="small" bordered={false}>
            <Descriptions.Item label="Company">{profile.company || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Industry">{profile.industry || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Location">{profile.companyLocation || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Company Size">{profile.companySize || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Website">
              {profile.companyWebsite ? (
                <Link href={profile.companyWebsite} target="_blank">{profile.companyWebsite}</Link>
              ) : (
                <Text type="secondary">Not provided</Text>
              )}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Jobs Posted" value={8} />
            </Col>
            <Col span={8}>
              <Statistic title="Applicants" value={47} />
            </Col>
            <Col span={8}>
              <Statistic title="Hired" value={3} />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}
