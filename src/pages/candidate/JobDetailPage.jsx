import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  App,
  Alert,
  Avatar,
  Button,
  Card,
  Divider,
  Input,
  Tag,
  Typography,
} from 'antd'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from '@ant-design/icons'
import TagBadge from '../../components/ui/TagBadge'
import StatusBadge from '../../components/ui/StatusBadge'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

// ── TODO: replace with jobService.getJobById(jobId) ──
const mockJob = {
  id: '1',
  title: 'Senior React Engineer',
  company: 'TechNova Labs',
  description:
    'We are looking for a Senior React Engineer to lead the web platform team building customer-facing dashboards. You will work closely with product and design to ship high-quality features at scale.',
  location: 'Remote',
  job_type: 'Full-Time',
  experience_required: 3,
  salary_range: '$80k–$120k',
  required_skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'AWS'],
  cover_letter_required: true,
  is_active: true,
  posted_at: '2026-03-20',
  company_size: '201-500',
  industry: 'Technology',
  logoBg: '#1677ff',
}

// ── Sub-component: Left column ────────────────────────────────────────────────
function JobDetailInfo({ job }) {
  const navigate = useNavigate()

  const initials = useMemo(
    () =>
      job.company
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [job.company]
  )

  return (
    <Card className="card-shadow">
      {/* Back button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20, paddingLeft: 0 }}
      >
        Back to Jobs
      </Button>

      {/* Company header */}
      <div className="flex items-start gap-4" style={{ marginBottom: 20 }}>
        <Avatar size={64} style={{ backgroundColor: job.logoBg, fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
          {initials}
        </Avatar>
        <div>
          <Title level={3} style={{ margin: 0 }}>{job.title}</Title>
          <Text type="secondary" style={{ fontSize: 15 }}>{job.company}</Text>
          {job.is_active && (
            <div style={{ marginTop: 4 }}>
              <StatusBadge status="active" />
            </div>
          )}
        </div>
      </div>

      {/* Meta tags row */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: 20 }}>
        <Tag icon={<EnvironmentOutlined />}>{job.location}</Tag>
        <Tag color="blue">{job.job_type}</Tag>
        <Tag icon={<ClockCircleOutlined />}>{job.experience_required}+ yrs exp</Tag>
        <Tag icon={<DollarOutlined />}>{job.salary_range}</Tag>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* Description */}
      <Title level={5} style={{ marginBottom: 8 }}>About the Role</Title>
      <Paragraph style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(0,0,0,0.72)' }}>
        {job.description}
      </Paragraph>

      <Divider style={{ margin: '16px 0' }} />

      {/* Required Skills */}
      <Title level={5} style={{ marginBottom: 12 }}>Required Skills</Title>
      <div className="flex flex-wrap gap-2" style={{ marginBottom: 20 }}>
        {job.required_skills.map((skill) => (
          <TagBadge key={skill} label={skill} />
        ))}
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* Job Details grid */}
      <Title level={5} style={{ marginBottom: 12 }}>Job Details</Title>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px 24px',
        }}
      >
        {[
          { label: 'Industry',      value: job.industry },
          { label: 'Company Size',  value: job.company_size },
          { label: 'Posted On',     value: job.posted_at },
          { label: 'Job Type',      value: job.job_type },
        ].map(({ label, value }) => (
          <div key={label}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>{label}</Text>
            <Text strong style={{ fontSize: 14 }}>{value}</Text>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Sub-component: Right column ───────────────────────────────────────────────
function ApplyCard({ job }) {
  const navigate = useNavigate()
  const { message } = App.useApp()

  const [coverLetter, setCoverLetter] = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [applied, setApplied]         = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    setApplied(true)
    message.success('Application submitted successfully!')
  }

  return (
    <Card
      title="Apply for this role"
      className="card-shadow"
      style={{ position: 'sticky', top: 96 }}
    >
      {job.cover_letter_required && (
        <Alert
          type="info"
          message="This job requires a cover letter"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {job.cover_letter_required && (
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 6 }}>Cover Letter</Text>
          <TextArea
            rows={5}
            maxLength={1000}
            showCount
            placeholder="Tell us why you're a great fit for this role..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            disabled={applied}
          />
        </div>
      )}

      {applied ? (
        <Tag
          icon={<CheckCircleOutlined />}
          color="green"
          style={{ width: '100%', textAlign: 'center', padding: '8px 0', fontSize: 14 }}
        >
          Application Submitted
        </Tag>
      ) : (
        <Button
          type="primary"
          block
          size="large"
          icon={<SendOutlined />}
          loading={submitting}
          onClick={handleSubmit}
        >
          Submit Application
        </Button>
      )}

      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Already applied?{' '}
          <span
            style={{ color: '#1677ff', cursor: 'pointer' }}
            onClick={() => navigate('/candidate/applications')}
          >
            Check My Applications
          </span>
        </Text>
      </div>
    </Card>
  )
}

// ── Main page component ───────────────────────────────────────────────────────
function JobDetailPage() {
  const { jobId } = useParams()

  // ── TODO: replace with jobService.getJobById(jobId) ──
  const job = mockJob

  return (
    <App>
      <div className="fade-in-up">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {/* Left — 2/3 width */}
          <div style={{ gridColumn: 'span 2' }}>
            <JobDetailInfo job={job} />
          </div>

          {/* Right — 1/3 width */}
          <div style={{ gridColumn: 'span 1' }}>
            <ApplyCard job={job} />
          </div>
        </div>
      </div>
    </App>
  )
}

export default JobDetailPage
