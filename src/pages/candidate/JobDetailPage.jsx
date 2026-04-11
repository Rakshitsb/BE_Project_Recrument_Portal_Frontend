import { useEffect, useMemo, useState } from 'react'
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
  Skeleton,
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
import useApiCall from '../../hooks/useApiCall'
import { getJobById } from '../../services/jobService'
import applicationService from '../../services/applicationService'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

function JobDetailInfo({ job }) {
  const navigate = useNavigate()

  const initials = useMemo(
    () =>
      job.company
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [job.company]
  )

  return (
    <Card className="card-shadow">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20, paddingLeft: 0 }}
      >
        Back to Jobs
      </Button>

      <div className="flex items-start gap-4" style={{ marginBottom: 20 }}>
        <Avatar size={64} style={{ backgroundColor: job.logoBg, fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
          {initials}
        </Avatar>
        <div>
          <Title level={3} style={{ margin: 0 }}>{job.title}</Title>
          <Text type="secondary" style={{ fontSize: 15 }}>{job.company}</Text>
          {job.isActive && (
            <div style={{ marginTop: 4 }}>
              <StatusBadge status="active" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2" style={{ marginBottom: 20 }}>
        <Tag icon={<EnvironmentOutlined />}>{job.location}</Tag>
        <Tag color="blue">{job.jobType}</Tag>
        <Tag icon={<ClockCircleOutlined />}>{job.experienceRequired}+ yrs exp</Tag>
        <Tag icon={<DollarOutlined />}>{job.salaryRange}</Tag>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      <Title level={5} style={{ marginBottom: 8 }}>About the Role</Title>
      <Paragraph style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(0,0,0,0.72)' }}>
        {job.description}
      </Paragraph>

      <Divider style={{ margin: '16px 0' }} />

      <Title level={5} style={{ marginBottom: 12 }}>Required Skills</Title>
      <div className="flex flex-wrap gap-2" style={{ marginBottom: 20 }}>
        {job.tags.map((skill) => (
          <TagBadge key={skill} label={skill} />
        ))}
      </div>

      <Divider style={{ margin: '16px 0' }} />

      <Title level={5} style={{ marginBottom: 12 }}>Job Details</Title>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px 24px',
        }}
      >
        {[
          { label: 'Industry', value: job.industry },
          { label: 'Company Size', value: job.size },
          { label: 'Posted On', value: job.postedAt },
          { label: 'Job Type', value: job.jobType },
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

function ApplyCard({ job }) {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const { execute: submitApplication } = useApiCall(applicationService.applyToJob)

  const [coverLetter, setCoverLetter] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      await submitApplication({ job_id: job.id, cover_letter: coverLetter })
      setApplied(true)
      message.success('Application submitted successfully!')
    } catch {
      message.error('Failed to submit application')
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
      {job.coverLetterRequired && (
        <Alert
          type="info"
          message="This job requires a cover letter"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {job.coverLetterRequired && (
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 6 }}>Cover Letter</Text>
          <TextArea
            rows={5}
            maxLength={1000}
            showCount
            placeholder="Tell us why you're a great fit for this role..."
            value={coverLetter}
            onChange={(event) => setCoverLetter(event.target.value)}
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

function JobDetailPage() {
  const { jobId } = useParams()
  const {
    execute: loadJob,
    loading,
    error,
    data: job,
  } = useApiCall(getJobById)

  useEffect(() => {
    if (jobId) {
      loadJob(jobId)
    }
  }, [jobId, loadJob])

  return (
    <App>
      <div className="fade-in-up">
        {loading && (
          <Card className="card-shadow">
            <Skeleton active paragraph={{ rows: 10 }} />
          </Card>
        )}

        {error && !loading && (
          <Result
            status="error"
            title="Failed to load job details"
            subTitle={error}
            extra={<Button type="primary" onClick={() => loadJob(jobId)}>Retry</Button>}
          />
        )}

        {!loading && !error && job && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              alignItems: 'start',
            }}
          >
            <div style={{ gridColumn: 'span 2' }}>
              <JobDetailInfo job={job} />
            </div>

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
