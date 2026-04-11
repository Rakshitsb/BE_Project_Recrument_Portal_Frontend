import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Row, Col, Card, Typography, Tag, Button, Avatar,
  Select, Empty, Skeleton, Result, App,
} from 'antd'
import {
  EyeOutlined, DeleteOutlined, EnvironmentOutlined,
  DollarOutlined, CalendarOutlined,
} from '@ant-design/icons'
import StatusBadge from '../../components/ui/StatusBadge'
import ConfirmModal from '../../components/ui/ConfirmModal'
import PageHeader from '../../components/ui/PageHeader'
import useApplications from '../../hooks/useApplications'

const { Title, Text } = Typography

// ── Sub-component: single application card ────────────────────────────────────
function ApplicationCard({ app, onView, onWithdraw, withdrawingId }) {
  const initials = app.company[0].toUpperCase()

  return (
    <Card
      hoverable
      className="card-shadow"
      actions={[
        <Button
          key="view"
          type="text"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => onView(app.job_id)}
        >
          View Job
        </Button>,
        <Button
          key="withdraw"
          type="text"
          danger
          icon={<DeleteOutlined />}
          size="small"
          loading={withdrawingId === app.id}
          onClick={() => onWithdraw(app.id)}
        >
          Withdraw
        </Button>,
      ]}
    >
      {/* Header row */}
      <div className="flex items-start gap-3" style={{ marginBottom: 12 }}>
        <Avatar size={48} style={{ backgroundColor: app.logoBg, fontWeight: 700, flexShrink: 0 }}>
          {initials}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Title level={5} style={{ margin: 0 }} ellipsis>{app.job_title}</Title>
              <Text type="secondary" style={{ fontSize: 13 }}>{app.company}</Text>
            </div>
            <StatusBadge status={app.status} />
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-col gap-1">
        <Text style={{ fontSize: 13 }}>
          <EnvironmentOutlined style={{ marginRight: 6, color: '#8c8c8c' }} />
          {app.location}
        </Text>
        <Text style={{ fontSize: 13 }}>
          <DollarOutlined style={{ marginRight: 6, color: '#52c41a' }} />
          {app.salary_range}
        </Text>
        <Text style={{ fontSize: 13 }}>
          <CalendarOutlined style={{ marginRight: 6, color: '#8c8c8c' }} />
          Applied {app.applied_at}
        </Text>
      </div>
    </Card>
  )
}

// ── Main page component ───────────────────────────────────────────────────────
function MyApplications() {
  const navigate = useNavigate()
  const { message } = App.useApp()

  const { applications, loading, error, withdrawingId, fetchApplications, withdrawApplication } =
    useApplications()

  const [statusFilter, setStatusFilter]   = useState('all')
  const [confirmOpen, setConfirmOpen]     = useState(false)
  const [selectedAppId, setSelectedAppId] = useState(null)

  const filtered = statusFilter === 'all'
    ? applications
    : applications.filter((a) => a.status === statusFilter)

  const openWithdrawModal = useCallback((id) => {
    setSelectedAppId(id)
    setConfirmOpen(true)
  }, [])

  const handleWithdraw = async () => {
    try {
      await withdrawApplication(selectedAppId)
      message.success('Application withdrawn')
      setConfirmOpen(false)
      setSelectedAppId(null)
    } catch {
      message.error('Failed to withdraw application')
    }
  }

  return (
    <App>
      <div className="fade-in-up">
        <PageHeader
          title="My Applications"
          subtitle="Track and manage your job applications"
          actions={<Tag color="blue">{applications.length} Total</Tag>}
        />

        {/* Status filter */}
        <div style={{ marginBottom: 20 }}>
          <Select
            defaultValue="all"
            style={{ width: 180 }}
            onChange={setStatusFilter}
            options={[
              { value: 'all',          label: 'All Statuses' },
              { value: 'applied',      label: 'Applied' },
              { value: 'under_review', label: 'Under Review' },
              { value: 'shortlisted',  label: 'Shortlisted' },
              { value: 'interview',    label: 'Interview' },
              { value: 'selected',     label: 'Selected' },
              { value: 'rejected',     label: 'Rejected' },
            ]}
          />
        </div>

        {/* Error state */}
        {error && (
          <Result
            status="error"
            title="Failed to load applications"
            subTitle={error}
            extra={<Button type="primary" onClick={fetchApplications}>Retry</Button>}
          />
        )}

        {/* Loading skeletons */}
        {!error && loading && (
          <Row gutter={[16, 16]}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Col key={i} xs={24} sm={12} lg={8}>
                <Card><Skeleton active paragraph={{ rows: 3 }} /></Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Application cards */}
        {!error && !loading && (
          filtered.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filtered.map((app) => (
                <Col key={app.id} xs={24} sm={12} lg={8}>
                  <ApplicationCard
                    app={app}
                    onView={(jobId) => navigate(`/candidate/jobs/${jobId}`)}
                    onWithdraw={openWithdrawModal}
                    withdrawingId={withdrawingId}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No applications found" />
          )
        )}

        {/* Confirm withdraw modal */}
        <ConfirmModal
          open={confirmOpen}
          title="Withdraw Application"
          description="Are you sure you want to withdraw this application? This cannot be undone."
          danger
          loading={withdrawingId === selectedAppId}
          onConfirm={handleWithdraw}
          onCancel={() => { setConfirmOpen(false); setSelectedAppId(null) }}
        />
      </div>
    </App>
  )
}

export default MyApplications
