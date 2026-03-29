import { memo } from 'react'
import {
  Form, Input, DatePicker, Select, Radio, Row, Col, Typography, Divider,
} from 'antd'
import {
  UserOutlined, MailOutlined, PhoneOutlined, TagsOutlined,
} from '@ant-design/icons'

const { Text } = Typography
const { TextArea } = Input
const { Option } = Select

const GENDER_OPTIONS = [
  { label: 'Male',               value: 'male' },
  { label: 'Female',             value: 'female' },
  { label: 'Non-binary',         value: 'non-binary' },
  { label: 'Prefer not to say',  value: 'prefer-not-to-say' },
]

const SKILL_OPTIONS = [
  'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript',
  'Node.js', 'Python', 'Java', 'CSS', 'HTML',
  'AWS', 'Docker', 'Figma', 'SQL', 'MongoDB',
]

const ACCOUNT_TYPES = [
  { label: '👤  Job Seeker / Candidate', value: 'candidate' },
  { label: '🧑‍💼  HR / Employer',          value: 'hr' },
]

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

/**
 * ProfileForm
 * Renders only Form.Items — does NOT wrap in its own <Form>.
 * The parent ProfileSetup owns the <Form> and form instance,
 * so onFinish fires correctly on submit.
 */
const ProfileForm = memo(function ProfileForm() {
  return (
    <>
      {/* ── Personal Details ────────────────────────────────────── */}
      {sectionLabel('Personal Details')}

      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="fullName"
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
          <Form.Item name="dob" label="Date of Birth">
            <DatePicker
              style={{ width: '100%' }}
              format="DD MMM YYYY"
              placeholder="Select date"
              disabledDate={(d) => d && d.isAfter(new Date())}
            />
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
      </Row>

      <Divider style={{ margin: '8px 0 20px' }} />

      {/* ── Professional Details ─────────────────────────────────── */}
      {sectionLabel('Professional Details')}

      <Form.Item
        name="skills"
        label="Skills"
        tooltip="Select or type your skills"
      >
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
        <TextArea
          placeholder="e.g. B.Tech Computer Science — IIT Delhi (2018–2022)"
          rows={2}
          showCount
          maxLength={300}
        />
      </Form.Item>

      <Form.Item name="experience" label="Work Experience">
        <TextArea
          placeholder="e.g. 2 years at TechCorp as Frontend Developer"
          rows={3}
          showCount
          maxLength={500}
        />
      </Form.Item>

      <Divider style={{ margin: '8px 0 20px' }} />

      {/* ── Account Type ─────────────────────────────────────────── */}
      {sectionLabel('Account Type')}

      <Form.Item name="accountType" rules={[{ required: true }]}>
        <Radio.Group style={{ width: '100%' }}>
          <Row gutter={[12, 12]}>
            {ACCOUNT_TYPES.map((type) => (
              <Col xs={24} sm={12} key={type.value}>
                <Radio.Button
                  value={type.value}
                  style={{
                    width: '100%',
                    height: 'auto',
                    padding: '12px 16px',
                    borderRadius: 8,
                    textAlign: 'center',
                    lineHeight: 1.5,
                    whiteSpace: 'normal',
                  }}
                >
                  {type.label}
                </Radio.Button>
              </Col>
            ))}
          </Row>
        </Radio.Group>
      </Form.Item>
    </>
  )
})

export default ProfileForm
