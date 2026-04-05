import { Avatar, Card, Col, Descriptions, Divider, Row, Statistic, Typography } from 'antd'
import {
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { Title, Text, Link } = Typography

/**
 * IconLabel — small helper that renders an icon + text in a flex row.
 * @param {object} props
 * @param {ReactNode} props.icon
 * @param {string}    props.text
 */
function IconLabel({ icon, text }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {icon}
      {text}
    </span>
  )
}

/**
 * HRProfileCard
 * Read-only view of an HR user's personal and company information.
 *
 * @param {object} props
 * @param {object} props.profile - HR profile data object
 */
export function HRProfileCard({ profile }) {
  return (
    <Row gutter={16}>

      {/* ── Left: Personal Info ─────────────────────────────────── */}
      <Col xs={24} lg={10}>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1677ff', marginBottom: 12 }}
            />
            <Title level={4} style={{ margin: 0 }}>{profile.name}</Title>
            <Text type="secondary">{profile.designation}</Text>
          </div>

          <Divider />

          <Descriptions column={1} size="small">
            <Descriptions.Item
              label={<IconLabel icon={<MailOutlined />} text="Email" />}
            >
              {profile.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={<IconLabel icon={<PhoneOutlined />} text="Phone" />}
            >
              {profile.phone}
            </Descriptions.Item>
            <Descriptions.Item
              label={<IconLabel icon={<CalendarOutlined />} text="Joined" />}
            >
              {profile.joinedDate}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>

      {/* ── Right: Company Info + Quick Stats ───────────────────── */}
      <Col xs={24} lg={14}>
        <Card>
          <Title level={5} style={{ marginTop: 0 }}>Company Information</Title>

          <Descriptions column={2} size="small" bordered={false}>
            <Descriptions.Item label="Company">{profile.company}</Descriptions.Item>
            <Descriptions.Item label="Industry">{profile.industry}</Descriptions.Item>
            <Descriptions.Item label="Location">{profile.companyLocation}</Descriptions.Item>
            <Descriptions.Item label="Company Size">{profile.companySize}</Descriptions.Item>
            <Descriptions.Item label="Website">
              {profile.companyWebsite
                ? <Link href={profile.companyWebsite} target="_blank">{profile.companyWebsite}</Link>
                : <Text type="secondary">Not provided</Text>
              }
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Jobs Posted"  value={8} />
            </Col>
            <Col span={8}>
              <Statistic title="Applicants"   value={47} />
            </Col>
            <Col span={8}>
              <Statistic title="Hired"        value={3} />
            </Col>
          </Row>
        </Card>
      </Col>

    </Row>
  )
}
