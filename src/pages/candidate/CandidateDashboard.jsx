import { useEffect, useMemo, useState } from 'react'
import { Row, Col, Typography, Card, List, Tag, Avatar, Skeleton, Empty, Result } from 'antd'
import {
  FileSearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from '@ant-design/icons'
import useAuthStore from '../../store/authStore'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import useApiCall from '../../hooks/useApiCall'
import applicationService from '../../services/applicationService'

const { Title, Text } = Typography

function CandidateDashboard() {
  const { user } = useAuthStore()
  const [applications, setApplications] = useState([])

  const {
    execute: loadApplications,
    loading,
    error,
  } = useApiCall(applicationService.getMyApplications)

  useEffect(() => {
    loadApplications()
      .then((result) => {
        setApplications(Array.isArray(result?.data) ? result.data : [])
      })
      .catch(() => {
        setApplications([])
      })
  }, [loadApplications])

  const stats = useMemo(() => {
    const totalApplied = applications.length
    const interviewStatuses = new Set(['interview', 'selected'])
    const pendingStatuses = new Set(['applied', 'under_review', 'shortlisted', 'pending_review', 'pending'])

    const interviews = applications.filter((a) => interviewStatuses.has(a.status)).length
    const pending = applications.filter((a) => pendingStatuses.has(a.status)).length

    return {
      totalApplied,
      interviews,
      pending,
      saved: 0, // No saved-jobs endpoint yet
    }
  }, [applications])

  const recentApplications = useMemo(() => {
    const withDate = applications.map((app) => {
      const dateStr = app.applied_at || app.created_at || ''
      const date = dateStr ? new Date(dateStr) : null
      const now = new Date()
      const daysAgo = date ? Math.max(0, Math.round((now - date) / (1000 * 60 * 60 * 24))) : null
      return { ...app, daysAgo, company: app.company || app.company_name || 'Company' }
    })
    return withDate
      .sort((a, b) => new Date(b.applied_at || b.created_at || 0) - new Date(a.applied_at || a.created_at || 0))
      .slice(0, 5)
  }, [applications])

  const renderRecentList = () => {
    if (loading) {
      return (
        <List
          dataSource={Array.from({ length: 3 })}
          renderItem={(_, idx) => (
            <List.Item key={idx}>
              <List.Item.Meta
                avatar={<Skeleton.Avatar active />}
                title={<Skeleton.Input active size="small" style={{ width: 180 }} />}
                description={<Skeleton.Input active size="small" style={{ width: 120 }} />}
              />
            </List.Item>
          )}
        />
      )
    }

    if (!loading && recentApplications.length === 0) {
      return <Empty description="No applications yet" />
    }

    return (
      <List
        dataSource={recentApplications}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[<StatusBadge key="status" status={item.status} />]}
          >
            <List.Item.Meta
              avatar={
                <Avatar style={{ backgroundColor: item.logoBg || '#1890ff' }}>
                  {(item.company?.[0] || 'C').toUpperCase()}
                </Avatar>
              }
              title={item.job_title}
              description={(
                <span>
                  {item.company} ·{' '}
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.daysAgo === null ? 'Just now' : `${item.daysAgo}d ago`}
                  </Text>
                </span>
              )}
            />
          </List.Item>
        )}
      />
    )
  }

  return (
    <div className="fade-in-up">
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          👋 Hello, {user?.name || 'Candidate'}!
        </Title>
        <Text type="secondary">Here's your job search overview</Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Jobs Applied"
            value={stats.totalApplied}
            icon={<FileSearchOutlined />}
            color="blue"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Interviews"
            value={stats.interviews}
            icon={<CheckCircleOutlined />}
            color="green"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Reviews"
            value={stats.pending}
            icon={<ClockCircleOutlined />}
            color="orange"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Saved Jobs"
            value={stats.saved}
            icon={<FireOutlined />}
            color="purple"
          />
        </Col>
      </Row>

      {/* Error state */}
      {error && (
        <Result
          status="error"
          title="Couldn't load your dashboard"
          subTitle={error}
        />
      )}

      {/* Recent Activity */}
      {!error && (
        <Card
          title="Recent Applications"
          extra={<Tag color="blue">Last 30 days</Tag>}
          className="card-shadow"
        >
          {renderRecentList()}
        </Card>
      )}
    </div>
  )
}

export default CandidateDashboard
