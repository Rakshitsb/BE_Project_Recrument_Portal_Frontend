import { memo } from 'react'
import {
  Form, Input, DatePicker, Select, Radio, Row, Col, Typography, Divider,
} from 'antd'
import {
  UserOutlined, MailOutlined, PhoneOutlined, TagsOutlined, EnvironmentOutlined,
} from '@ant-design/icons'
import DynamicListField from './DynamicListField'

const { Text }     = Typography
const { TextArea } = Input
const { Option }   = Select

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

const ACCOUNT_TYPES = [
  { label: '👤  Job Seeker / Candidate', value: 'candidate' },
  { label: '🧑‍💼  HR / Employer',          value: 'hr' },
]

// ── Education entry field config ──────────────────────────────────────────────
const EDUCATION_FIELDS = [
  {
    name: 'degree',
    label: 'Degree / Qualification',
    placeholder: 'e.g. B.Tech in Computer Science',
    span: 24,
    required: true,
  },
  {
    name: 'institution',
    label: 'Institution / University',
    placeholder: 'e.g. IIT Delhi',
    span: 16,
    required: true,
  },
  {
    name: 'year',
    label: 'Year',
    placeholder: 'e.g. 2022–2026',
    span: 8,
  },
]

// ── Experience entry field config ─────────────────────────────────────────────
const EXPERIENCE_FIELDS = [
  {
    name: 'title',
    label: 'Job Title',
    placeholder: 'e.g. Frontend Developer',
    span: 12,
    required: true,
  },
  {
    name: 'company',
    label: 'Company',
    placeholder: 'e.g. TechCorp',
    span: 12,
  },
  {
    name: 'duration',
    label: 'Duration',
    placeholder: 'e.g. Jan 2023 – Mar 2024',
    span: 12,
  },
  {
    name: 'description',
    label: 'Description',
    placeholder: 'Key responsibilities or achievements...',
    span: 24,
    textarea: true,
    rows: 2,
  },
]

// ── Project entry field config ────────────────────────────────────────────────
const PROJECT_FIELDS = [
  {
    name: 'name',
    label: 'Project Name',
    placeholder: 'e.g. E-Commerce Platform',
    span: 24,
    required: true,
  },
  {
    name: 'description',
    label: 'Description',
    placeholder: 'What did you build and what was your role?',
    span: 24,
    textarea: true,
    rows: 3,
    maxLength: 500,
  },
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
 *
 * Sections:
 *  - Personal Details (name, email, phone, dob, gender, location)
 *  - Skills
 *  - Education (dynamic list — degree, institution, year)
 *  - Work Experience (dynamic list — title, company, duration, description)
 *  - Projects (dynamic list — name, description)
 *  - Bio
 *  - Account Type
 */
const ProfileForm = memo(function ProfileForm() {
  return (
    <>
      {/* ── Personal Details ─────────────────────────────────────── */}
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
          <Form.Item name="location" label="Location">
            <Input prefix={<EnvironmentOutlined />} placeholder="e.g. Pune, India" />
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

      {/* ── Skills ────────────────────────────────────────────────── */}
      {sectionLabel('Skills')}

      <Form.Item
        name="skills"
        tooltip="Select or type your skills"
      >
        <Select
          mode="tags"
          placeholder={<><TagsOutlined /> Add skills</>}
          tokenSeparators={[',']}
          maxTagCount={20}
        >
          {SKILL_OPTIONS.map((s) => (
            <Option key={s} value={s}>{s}</Option>
          ))}
        </Select>
      </Form.Item>

      <Divider style={{ margin: '8px 0 20px' }} />

      {/* ── Education ─────────────────────────────────────────────── */}
      <DynamicListField
        name="education"
        label="Education"
        addLabel="Add Education"
        fields={EDUCATION_FIELDS}
        emptyText="No education added"
        maxItems={5}
      />

      <Divider style={{ margin: '0 0 20px' }} />

      {/* ── Work Experience ───────────────────────────────────────── */}
      <DynamicListField
        name="experience"
        label="Work Experience"
        addLabel="Add Experience"
        fields={EXPERIENCE_FIELDS}
        emptyText="No work experience added"
        maxItems={10}
      />

      <Divider style={{ margin: '0 0 20px' }} />

      {/* ── Projects ──────────────────────────────────────────────── */}
      <DynamicListField
        name="projects"
        label="Projects"
        addLabel="Add Project"
        fields={PROJECT_FIELDS}
        emptyText="No projects added"
        maxItems={10}
      />

      <Divider style={{ margin: '0 0 20px' }} />

      {/* ── Bio ───────────────────────────────────────────────────── */}
      {sectionLabel('Bio')}

      <Form.Item name="bio">
        <TextArea
          placeholder="A short professional summary about yourself..."
          rows={4}
          showCount
          maxLength={1000}
        />
      </Form.Item>

      <Divider style={{ margin: '8px 0 20px' }} />

      {/* ── Account Type ──────────────────────────────────────────── */}
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
