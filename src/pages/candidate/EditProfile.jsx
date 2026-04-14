import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form, Input, Select, DatePicker, Card,
  Button, Row, Col, Divider, Typography,
  Skeleton, Result, App,
} from 'antd'
import {
  SaveOutlined, ArrowLeftOutlined, TagsOutlined,
  UserOutlined, MailOutlined, PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import useProfile from '../../hooks/useProfile'
import PageHeader from '../../components/ui/PageHeader'

const { Text } = Typography
const { TextArea } = Input
const { Option } = Select

const GENDER_OPTIONS = [
  { label: 'Male',              value: 'male' },
  { label: 'Female',            value: 'female' },
  { label: 'Non-binary',        value: 'non-binary' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
]

const SKILL_OPTIONS = [
  'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript',
  'Node.js', 'Python', 'Java', 'CSS', 'HTML',
  'AWS', 'Docker', 'Figma', 'SQL', 'MongoDB',
]

// ── Same helper as ProfileForm.jsx ────────────────────────────────────────────
const sectionLabel = (text) => (
  <Text
    strong
    style={{
      display: 'block',
      fontSize: 13,
      color: '#595959',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      marginBottom: 12,
    }}
  >
    {text}
  </Text>
)

// ── Main page component ───────────────────────────────────────────────────────
function EditProfile() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [form] = Form.useForm()

  const { profile, loading, error, updating, fetchProfile, updateProfile } = useProfile()

  // Pre-fill form when profile data loads
  useEffect(() => {
    if (!profile) return
    // Normalize education: array → readable string for the plain textarea
    const rawEd = profile.education
    const educationStr = Array.isArray(rawEd)
      ? rawEd.map((e) => [e.degree, e.institution, e.year].filter(Boolean).join(', ')).join(' | ')
      : rawEd || ''

    form.setFieldsValue({
      full_name:        profile.full_name || profile.fullName,
      email:            profile.email,
      phone:            profile.phone,
      location:         profile.location,
      gender:           profile.gender || profile.sex || profile.gender_identity,
      dob:              profile.dob || profile.date_of_birth || profile.dateOfBirth
                        ? dayjs(profile.dob || profile.date_of_birth || profile.dateOfBirth)
                        : null,
      skills:           profile.skills,
      education:        educationStr,
      experience_years: profile.experience_years,
      bio:              profile.bio,
    })
  }, [profile])

  const handleSubmit = useCallback(async (values) => {
    try {
      // ── Build exact payload matching CandidateProfileUpdate schema ──
      const payload = {
        full_name:        values.full_name        || '',
        email:            values.email            || null,
        phone:            values.phone             || '',
        location:         values.location          || '',
        gender:           values.gender            || null,
        dob:              values.dob
                          ? values.dob.format('YYYY-MM-DD')
                          : null,
        skills:           values.skills            || [],
        experience_years: parseFloat(values.experience_years) || 0,
        education:        typeof values.education === 'string'
                          ? values.education
                          : Array.isArray(values.education)
                            ? values.education.map((e) => [e.degree, e.institution, e.year].filter(Boolean).join(', ')).join(' | ')
                            : '',
        bio:              values.bio               || null,
        resume_url:       null,
      }
      await updateProfile(payload)
      message.success('Profile updated successfully!')
      navigate('/candidate/profile')
    } catch {
      message.error('Failed to update profile. Please try again.')
    }
  }, [updateProfile, navigate, message])

  return (
    <div className="fade-in-up">
      <PageHeader
          title="Edit Profile"
          subtitle="Update your professional details"
          actions={
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              Back
            </Button>
          }
        />

        {/* Loading */}
        {loading && (
          <Card className="card-shadow">
            <Skeleton active paragraph={{ rows: 8 }} />
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

        {/* Edit form */}
        {!loading && !error && (
          <Card className="card-shadow">
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              size="large"
              onFinish={handleSubmit}
            >
              {/* ── Personal Details ─────────────────────────────── */}
              {sectionLabel('Personal Details')}
              <Row gutter={[16, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="full_name" label="Full Name"
                    rules={[{ required: true, message: 'Full name is required' }]}>
                    <Input prefix={<UserOutlined />} placeholder="e.g. Alice Johnson" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="email" label="Email Address"
                    rules={[
                      { required: true, message: 'Email is required' },
                      { type: 'email', message: 'Enter a valid email' },
                    ]}>
                    <Input prefix={<MailOutlined />} placeholder="you@example.com" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="phone" label="Phone Number"
                    rules={[{ required: true, message: 'Phone is required' }]}>
                    <Input prefix={<PhoneOutlined />} placeholder="+91 98765 43210" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="location" label="Location">
                    <Input prefix={<EnvironmentOutlined />} placeholder="e.g. Pune, Maharashtra" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="gender" label="Gender">
                    <Select placeholder="Select gender">
                      {GENDER_OPTIONS.map((g) => (
                        <Option key={g.value} value={g.value}>{g.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="dob" label="Date of Birth">
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD MMM YYYY"
                      disabledDate={(d) => d && d.isAfter(new Date())}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ margin: '8px 0 20px' }} />

              {/* ── Professional Details ──────────────────────────── */}
              {sectionLabel('Professional Details')}
              <Form.Item name="skills" label="Skills">
                <Select
                  mode="tags"
                  placeholder={<><TagsOutlined /> Add skills</>}
                  tokenSeparators={[',']}
                  maxTagCount={12}
                >
                  {SKILL_OPTIONS.map((s) => (
                    <Option key={s} value={s}>{s}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="education" label="Education">
                <TextArea rows={2} showCount maxLength={300}
                  placeholder="e.g. B.Tech Computer Science" />
              </Form.Item>
              <Row gutter={[16, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="experience_years" label="Years of Experience">
                    <Input type="number" min={0} max={50}
                      placeholder="e.g. 2.5" suffix="years" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="bio" label="Bio">
                <TextArea rows={3} showCount maxLength={500}
                  placeholder="A short bio about yourself" />
              </Form.Item>

              {/* ── Submit footer ─────────────────────────────────── */}
              <div style={{
                borderTop: '1px solid #f0f0f0',
                paddingTop: 16,
                marginTop: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Changes will be visible to recruiters immediately
                </Text>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button onClick={() => navigate(-1)}>Cancel</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={updating}
                    style={{ minWidth: 140 }}
                  >
                    {updating ? 'Saving…' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </Form>
          </Card>
        )}
      </div>
  )
}

export default EditProfile
