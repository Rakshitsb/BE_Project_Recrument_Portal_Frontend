import { useEffect, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  Input,
  Select,
  DatePicker,
  Card,
  Button,
  Row,
  Col,
  Divider,
  Typography,
  Skeleton,
  Result,
  App,
} from 'antd'
import {
  SaveOutlined,
  ArrowLeftOutlined,
  TagsOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

import useProfile from '../../hooks/useProfile'
import PageHeader from '../../components/ui/PageHeader'
import DynamicListField from '../../components/ui/DynamicListField'
import AvatarUpload from '../../components/ui/AvatarUpload'
import profileService from '../../services/profileService'
import useAuthStore from '../../store/authStore'

const { Text } = Typography
const { TextArea } = Input
const { Option } = Select

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
]

const SKILL_OPTIONS = [
  'React',
  'Vue.js',
  'Angular',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Python',
  'Java',
  'CSS',
  'HTML',
  'AWS',
  'Docker',
  'Figma',
  'SQL',
  'MongoDB',
]

const toArray = (value) => (Array.isArray(value) ? value : [])

const normalizeExperience = (value) =>
  toArray(value).map((item) => ({
    title: item?.title || item?.role || '',
    company: item?.company || '',
    duration: item?.duration || '',
    description: item?.description || '',
  }))

const normalizeProjects = (value) =>
  toArray(value).map((item) => ({
    name: item?.name || '',
    description: item?.description || '',
  }))

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

function EditProfile() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const updateUser = useAuthStore((s) => s.updateUser)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarProgress, setAvatarProgress] = useState(0)

  const { profile, loading, error, updating, fetchProfile, updateProfile } = useProfile()

  const mergedSkillOptions = useMemo(() => {
    const fromProfile = toArray(profile?.skills).map((s) => String(s).trim()).filter(Boolean)
    return Array.from(new Set([...SKILL_OPTIONS, ...fromProfile]))
  }, [profile])

  useEffect(() => {
    if (!profile) return

    const rawEducation = profile.education
    const educationText = Array.isArray(rawEducation)
      ? rawEducation
          .map((e) => [e?.degree, e?.institution, e?.year].filter(Boolean).join(', '))
          .filter(Boolean)
          .join(' | ')
      : rawEducation || ''

    const dobValue = profile.dob || profile.date_of_birth || profile.dateOfBirth || null

    form.setFieldsValue({
      full_name: profile.full_name || profile.fullName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      location: profile.location || '',
      gender: profile.gender || profile.sex || profile.gender_identity || undefined,
      dob: dobValue ? dayjs(dobValue) : null,
      skills: toArray(profile.skills),
      education: educationText,
      experience_years: profile.experience_years ?? profile.experienceYears ?? 0,
      experience: normalizeExperience(profile.experience),
      projects: normalizeProjects(profile.projects),
      resume_url: profile.resume_url || profile.resumeUrl || '',
      bio: profile.bio || '',
    })
  }, [profile, form])

  const handleSubmit = useCallback(
    async (values) => {
      try {
        const payload = {
          full_name: values.full_name || '',
          email: values.email || null,
          phone: values.phone || '',
          location: values.location || '',
          gender: values.gender || null,
          dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
          skills: toArray(values.skills),
          experience_years: Number.parseFloat(values.experience_years) || 0,
          education: typeof values.education === 'string' ? values.education : '',
          experience: normalizeExperience(values.experience),
          projects: normalizeProjects(values.projects),
          resume_url: values.resume_url || null,
          bio: values.bio || null,
        }

        await updateProfile(payload)
        message.success('Profile updated successfully!')
        navigate('/candidate/profile')
      } catch {
        message.error('Failed to update profile. Please try again.')
      }
    },
    [updateProfile, navigate, message],
  )

  const handleAvatarUpload = useCallback(
    async (file) => {
      try {
        setAvatarUploading(true)
        setAvatarProgress(0)
        const result = await profileService.uploadAvatar(file, setAvatarProgress)
        updateUser({ avatarUrl: result.url || result.secure_url })
        fetchProfile()
        message.success('Profile photo updated.')
      } catch {
        message.error('Failed to upload profile photo. Please try again.')
      } finally {
        setAvatarUploading(false)
        setAvatarProgress(0)
      }
    },
    [fetchProfile, message, updateUser],
  )

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

      {loading && (
        <Card className="card-shadow">
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      )}

      {error && !loading && (
        <Result
          status="error"
          title="Failed to load profile"
          subTitle={error}
          extra={
            <Button type="primary" onClick={fetchProfile}>
              Retry
            </Button>
          }
        />
      )}

      {!loading && !error && (
        <Card className="card-shadow">
          <Form form={form} layout="vertical" requiredMark={false} size="large" onFinish={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <AvatarUpload
                avatarUrl={profile?.avatar_url || profile?.avatarUrl}
                onUpload={handleAvatarUpload}
                uploading={avatarUploading}
                progress={avatarProgress}
              />
            </div>
            {sectionLabel('Personal Details')}
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="full_name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Full name is required' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="e.g. Alice Johnson" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Email is required' },
                    { type: 'email', message: 'Enter a valid email' },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="you@example.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Phone is required' }]}
                >
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
                  <Select placeholder="Select gender" allowClear>
                    {GENDER_OPTIONS.map((g) => (
                      <Option key={g.value} value={g.value}>
                        {g.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="dob" label="Date of Birth">
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD MMM YYYY"
                    disabledDate={(d) => d && d.isAfter(dayjs())}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: '8px 0 20px' }} />

            {sectionLabel('Professional Details')}
            <Form.Item name="skills" label="Skills">
              <Select
                mode="tags"
                placeholder={
                  <>
                    <TagsOutlined /> Add skills
                  </>
                }
                tokenSeparators={[',']}
                maxTagCount={12}
              >
                {mergedSkillOptions.map((s) => (
                  <Option key={s} value={s}>
                    {s}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="education" label="Education">
              <TextArea rows={3} showCount maxLength={500} placeholder="Degree, institution, passing year" />
            </Form.Item>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item name="experience_years" label="Years of Experience">
                  <Input type="number" min={0} max={50} placeholder="e.g. 2.5" suffix="years" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="resume_url" label="Resume URL">
                  <Input prefix={<LinkOutlined />} placeholder="https://..." />
                </Form.Item>
              </Col>
            </Row>

            <DynamicListField
              name="experience"
              label="Experience"
              addLabel="Add Experience"
              emptyText="No work experience added"
              fields={[
                { name: 'title', label: 'Role', placeholder: 'e.g. Software Intern', span: 12 },
                { name: 'company', label: 'Company', placeholder: 'e.g. ABC Tech', span: 12 },
                { name: 'duration', label: 'Duration', placeholder: 'e.g. Jan 2025 - Mar 2026', span: 12 },
                {
                  name: 'description',
                  label: 'Description',
                  placeholder: 'What you worked on',
                  textarea: true,
                  rows: 2,
                  span: 24,
                },
              ]}
            />

            <DynamicListField
              name="projects"
              label="Projects"
              addLabel="Add Project"
              emptyText="No projects added"
              fields={[
                { name: 'name', label: 'Project Name', placeholder: 'e.g. Recruitment Analytics', span: 12 },
                {
                  name: 'description',
                  label: 'Description',
                  placeholder: 'Brief project summary',
                  textarea: true,
                  rows: 2,
                  span: 24,
                },
              ]}
            />

            <Form.Item name="bio" label="Bio">
              <TextArea rows={3} showCount maxLength={500} placeholder="A short bio about yourself" />
            </Form.Item>

            <div
              style={{
                borderTop: '1px solid #f0f0f0',
                paddingTop: 16,
                marginTop: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
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
                  {updating ? 'Saving...' : 'Save Changes'}
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
