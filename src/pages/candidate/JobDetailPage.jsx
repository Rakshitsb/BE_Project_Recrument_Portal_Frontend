import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  App,
  Alert,
  Avatar,
  Button,
  Card,
  Divider,
  Input,
  Result,
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
import applicationService from '../../services/applicationService'
import jobService from '../../services/jobService'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

// ── Sub-component: Left column ────────────────────────────────────────────────
function JobDetailInfo({ job }) {
  const navigate = useNavigate()

  const companyName = job.company || 'Unknown Company'
  const requiredSkills = job.required_skills || job.tags || []

  const initials = useMemo(
    () =>
      companyName
        ?.split(' ')
        ?.map((w) => w[0])
        ?.join('')
        ?.slice(0, 2)
        ?.toUpperCase() || '?',
    [companyName]
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
          <Text type="secondary" style={{ fontSize: 15 }}>{companyName}</Text>
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
        {requiredSkills.length ? requiredSkills.map((skill) => (
          <TagBadge key={skill} label={skill} />
        )) : (
          <Text type="secondary">Not specified</Text>
        )}
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
          { label: 'Posted On',     value: job.posted_at || job.postedAt || '—' },
          { label: 'Job Type',      value: job.job_type || '—' },
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
    if (job.cover_letter_required && !coverLetter.trim()) {
      message.warning('Cover letter is required for this job.')
      return
    }

    setSubmitting(true)
    try {
      await applicationService.applyToJob({
        job_id: job.id,
        cover_letter: coverLetter,
      })
      setApplied(true)
      message.success('Application submitted successfully!')
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to submit application.'
      message.error(errMsg)
    } finally {
      setSubmitting(false)
    }
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
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await jobService.fetchJobById(jobId)
        if (mounted) setJob(data)
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || err.message || 'Unable to load job.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [jobId])

  return (
    <App>
      <div className="fade-in-up">
        {error && (
          <Result
            status="error"
            title="Unable to load job"
            subTitle={error}
            extra={<Button onClick={() => window.location.reload()}>Retry</Button>}
          />
        )}

        {!error && (loading || !job) ? (
          <Result status="info" title="Loading job details..." />
        ) : (
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
        )}
      </div>
    </App>
  )
}

export default JobDetailPage
