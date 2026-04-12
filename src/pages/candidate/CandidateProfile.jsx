import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import useAuthStore from '../../store/authStore'
import {
  Row, Col, Card, Typography, Tag, Button,
  Avatar, Divider, Skeleton, Result, Space,
} from 'antd'
import {
  EditOutlined, MailOutlined, PhoneOutlined,
  EnvironmentOutlined, CalendarOutlined,
  UserOutlined, TrophyOutlined, BookOutlined,
  RocketOutlined,
} from '@ant-design/icons'
import TagBadge from '../../components/ui/TagBadge'
import PageHeader from '../../components/ui/PageHeader'
import useProfile from '../../hooks/useProfile'

const { Title, Text } = Typography

// ── Sub-component: top summary card ──────────────────────────────────────────
function ProfileSummaryCard({ profile }) {
  const joined = profile.created_at || profile.createdAt
  const { user } = useAuthStore()
  const email = profile.email || user?.email || 'Not provided'
  return (
    <Card className="card-shadow" style={{ marginBottom: 16 }}>
      <Row gutter={[24, 24]} align="middle">
        {/* Avatar + name + bio */}
        <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src={profile.avatar_url || undefined}
            style={{ backgroundColor: '#1677ff', marginBottom: 12 }}
          />
          <Title level={4} style={{ margin: 0 }}>{profile.full_name}</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {profile.bio || 'No bio added yet'}
          </Text>
        </Col>

        {/* Contact info */}
        <Col xs={24} sm={18}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            {[
              { icon: <MailOutlined />,        value: email },
              { icon: <PhoneOutlined />,        value: profile.phone },
              { icon: <EnvironmentOutlined />,  value: profile.location || 'Not specified' },
              { icon: <CalendarOutlined />,     value: joined ? `Joined ${joined}` : 'Joined -' },
            ].map(({ icon, value }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text type="secondary">{icon}</Text>
                <Text>{value}</Text>
              </div>
            ))}
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

// ── Sub-component: skills + education + account details ───────────────────────
function ProfileDetailsSection({ profile }) {
  const rawDob = profile.dob || profile.date_of_birth || profile.dateOfBirth || null
  const formattedDob = rawDob ? dayjs(rawDob).format('DD MMM YYYY') : 'Not specified'
  const memberSince = profile.created_at || profile.createdAt || 'Not specified'
  const gender = profile.gender || profile.sex || profile.gender_identity || 'Not specified'
  return (
    <Row gutter={[16, 16]}>
      {/* Skills */}
      <Col xs={24} md={12}>
        <Card className="card-shadow" style={{ height: '100%' }}>
          <Title level={5}>
            <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} />
            Skills
          </Title>
          {profile.skills?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.skills.map((skill) => (
                <TagBadge key={skill} label={skill} />
              ))}
            </div>
          ) : (
            <Text type="secondary">No skills added yet</Text>
          )}
        </Card>
      </Col>

      {/* Education & Experience */}
      <Col xs={24} md={12}>
        <Card className="card-shadow" style={{ height: '100%' }}>
          <Title level={5}>
            <BookOutlined style={{ marginRight: 8, color: '#1677ff' }} />
            Education
          </Title>
          <Text>{profile.education || 'Not specified'}</Text>

          <Divider style={{ margin: '12px 0' }} />

          <Title level={5} style={{ marginBottom: 4 }}>Experience</Title>
          <Text>{profile.experience_years} years</Text>

          {profile.bio && (
            <>
              <Divider style={{ margin: '12px 0' }}>Bio</Divider>
              <Text type="secondary">{profile.bio}</Text>
            </>
          )}
        </Card>
      </Col>

      {/* Account info */}
      <Col xs={24}>
        <Card className="card-shadow">
          <Row gutter={[16, 16]}>
            {[
              { label: 'Gender',        value: gender },
              { label: 'Date of Birth', value: formattedDob },
              { label: 'Member Since',  value: memberSince },
            ].map(({ label, value }) => (
              <Col key={label} xs={24} sm={8}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>{label}</Text>
                <Text strong>{value}</Text>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

// ── Main page component ───────────────────────────────────────────────────────
function CandidateProfile() {
  const navigate = useNavigate()
  const { profile, loading, error, fetchProfile } = useProfile()

  return (
    <div className="fade-in-up">
      <PageHeader
        title="My Profile"
        subtitle="Your professional profile visible to recruiters"
        actions={
          profile ? (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate('/candidate/profile/edit')}
            >
              Edit Profile
            </Button>
          ) : null
        }
      />

      {/* Loading */}
      {loading && (
        <Card className="card-shadow">
          <Skeleton active avatar={{ size: 80 }} paragraph={{ rows: 6 }} />
        </Card>
      )}

      {/* Error */}
      {error && !loading && (
        <Result
          status="error"
          title="Failed to load profile"
          subTitle={error}
          extra={<Button type="primary" onClick={fetchProfile}>Retry</Button>}
        />
      )}

      {/* ── No Profile State ── */}
      {!loading && !error && !profile && (
        <Card className="card-shadow">
          <div
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              padding:        '48px 24px',
              textAlign:      'center',
            }}
          >
            <div
              style={{
                width:           80,
                height:          80,
                borderRadius:    '50%',
                background:      '#e6f4ff',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                marginBottom:    24,
              }}
            >
              <UserOutlined style={{ fontSize: 36, color: '#1677ff' }} />
            </div>

            <Typography.Title level={4} style={{ margin: 0 }}>
              No Profile Yet
            </Typography.Title>

            <Typography.Text
              type="secondary"
              style={{ display: 'block', margin: '8px 0 24px' }}
            >
              Upload your resume and let AI build
              your profile automatically
            </Typography.Text>

            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={() => navigate('/candidate/profile/setup')}
              style={{ minWidth: 200 }}
            >
              Create Profile with AI
            </Button>

            <Typography.Text
              type="secondary"
              style={{ fontSize: 12, marginTop: 12 }}
            >
              Takes less than 2 minutes
            </Typography.Text>
          </div>
        </Card>
      )}

      {/* Profile content */}
      {profile && !loading && !error && (
        <>
          <ProfileSummaryCard profile={profile} />
          <ProfileDetailsSection profile={profile} />
        </>
      )}
    </div>
  )
}

export default CandidateProfile
