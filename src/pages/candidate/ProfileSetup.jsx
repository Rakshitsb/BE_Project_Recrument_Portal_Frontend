import { useCallback, useMemo } from 'react'
import {
  Form, Button, Card, Typography, Steps, Row, Col, Divider, Tag, App,
} from 'antd'
import {
  UploadOutlined, UserOutlined, CheckCircleOutlined, SaveOutlined,
} from '@ant-design/icons'
import FileUpload   from '../../components/ui/FileUpload'
import AvatarUpload from '../../components/ui/AvatarUpload'
import ProfileForm  from '../../components/ui/ProfileForm'
import useProfileSetup from '../../hooks/useProfileSetup'
import useProfileStore from '../../store/profileStore'

const { Title, Text, Paragraph } = Typography

// ── Step indicator config ─────────────────────────────────────────
const STEPS = [
  { title: 'Upload Resume',    icon: <UploadOutlined /> },
  { title: 'Review Details',   icon: <UserOutlined /> },
  { title: 'Save Profile',     icon: <CheckCircleOutlined /> },
]

function ProfileSetup() {
  const [form] = Form.useForm()
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
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* ── Page Title ── */}
      <div style={{ textAlign: 'center', marginBottom: 28, color: '#fff' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✨</div>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>
          Set Up Your Profile
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0' }}>
          Upload your resume and we'll fill in the details for you
        </Paragraph>
      </div>

      {/* ── Step Progress ── */}
      <Card
        style={{ width: '100%', maxWidth: 760, borderRadius: 16, marginBottom: 20 }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <Steps current={activeStep} items={STEPS} size="small" />
      </Card>

      {/* ── Main Card ── */}
      <Card
        style={{ width: '100%', maxWidth: 760, borderRadius: 16 }}
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
              {submitting ? 'Saving…' : 'Save Profile'}
            </Button>
          </div>
        </Form>
      </Card>

      {/* ── Footer note ── */}
      <Text style={{ color: 'rgba(255,255,255,0.6)', marginTop: 20, fontSize: 13 }}>
        🔒 Your data is secure and will never be shared without consent
      </Text>
    </div>
  )
}

export default ProfileSetup
