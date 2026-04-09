import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form, Button, Card, Typography, Steps, Row, Col, Divider, Tag, App,
} from 'antd'
import {
  UploadOutlined, UserOutlined, CheckCircleOutlined, SaveOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import FileUpload   from '../../components/ui/FileUpload'
import AvatarUpload from '../../components/ui/AvatarUpload'
import ProfileForm  from '../../components/ui/ProfileForm'
import PageHeader   from '../../components/ui/PageHeader'
import useProfileSetup from '../../hooks/useProfileSetup'
import useProfileStore from '../../store/profileStore'

const { Title, Text } = Typography

// ── Step indicator config ─────────────────────────────────────────
const STEPS = [
  { title: 'Upload Resume',    icon: <UploadOutlined /> },
  { title: 'Review Details',   icon: <UserOutlined /> },
  { title: 'Save Profile',     icon: <CheckCircleOutlined /> },
]

function ProfileSetup() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { profileData } = useProfileStore()

  const {
    handleResumeUpload,
    handleAvatarUpload,
    handleSubmit,
    resumeUploading,
    avatarUploading,
    submitting,
    resumeParsed,
  } = useProfileSetup(form)

  // Determine active step for the progress indicator
  const activeStep = useMemo(() => {
    if (!resumeParsed) return 0
    return 1
  }, [resumeParsed])

  const onFinishFailed = useCallback(({ errorFields }) => {
    form.scrollToField(errorFields[0]?.name)
  }, [form])

  return (
    <div className="fade-in-up">
      <PageHeader
        title="Create Profile with AI"
        subtitle="Upload your resume and we'll fill in the details automatically"
        actions={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/candidate/profile')}
          >
            Back
          </Button>
        }
      />

      {/* ── Step Progress ── */}
      <Card
        style={{ marginBottom: 20 }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <Steps current={activeStep} items={STEPS} size="small" />
      </Card>

      {/* ── Main Card ── */}
      <Card
        style={{ borderRadius: 16 }}
        bodyStyle={{ padding: '32px 36px' }}
      >
        {/* ── Avatar + Resume side by side ── */}
        <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 28 }}>
          <Col xs={24} sm={8} style={{ display: 'flex', justifyContent: 'center' }}>
            <AvatarUpload
              avatarUrl={profileData.avatarUrl}
              onUpload={handleAvatarUpload}
              uploading={avatarUploading}
            />
          </Col>

          <Col xs={24} sm={16}>
            <div style={{ marginBottom: 8 }}>
              <Title level={5} style={{ margin: 0 }}>
                <UploadOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                Upload Resume
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                We'll extract your details automatically
              </Text>
            </div>
            <FileUpload
              onUpload={handleResumeUpload}
              uploading={resumeUploading}
              parsed={resumeParsed}
            />
          </Col>
        </Row>

        <Divider>
          <Tag color="blue" style={{ fontSize: 12, padding: '2px 12px' }}>
            {resumeParsed ? '✅ Auto-filled — review below' : 'Profile Details'}
          </Tag>
        </Divider>

        {/* ── Profile Form ── */}
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          size="large"
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          initialValues={{ accountType: 'candidate' }}
        >
          <ProfileForm />

          {/* ── Submit ── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
              paddingTop: 16,
              borderTop: '1px solid #f0f0f0',
            }}
          >
            <Text type="secondary" style={{ fontSize: 13 }}>
              You can update this later from your profile settings
            </Text>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              icon={<SaveOutlined />}
              size="large"
              style={{ minWidth: 160, fontWeight: 600, borderRadius: 8 }}
            >
              {submitting ? 'Creating…' : 'Create Profile'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default ProfileSetup
