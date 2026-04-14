import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Row,
  Col,
  Typography,
  Card,
  List,
  Tag,
  Avatar,
  Empty,
  Button,
  Skeleton,
  Result,
} from 'antd'
import {
  FileSearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from '@ant-design/icons'

import useAuthStore from '../../store/authStore'
import useApiCall from '../../hooks/useApiCall'
import applicationService from '../../services/applicationService'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'

const { Title, Text } = Typography

const getRelativeDateLabel = (dateValue) => {
  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) return 'Applied recently'

  const now = new Date()
  const msDiff = now - parsedDate
  const dayDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24))

  if (dayDiff <= 0) return 'Applied today'
  if (dayDiff === 1) return 'Applied 1 day ago'
  if (dayDiff < 30) return `Applied ${dayDiff} days ago`

  return `Applied on ${parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}`
}

function CandidateDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const {
    execute: loadApplications,
    loading,
    error,
    data,
  } = useApiCall(applicationService.getMyApplications)

  const fetchApplications = useCallback(async () => {
    await loadApplications()
  }, [loadApplications])

  useEffect(() => {
    fetchApplications().catch(() => {})
  }, [fetchApplications])

  const applications = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data
    return []
  }, [data])

  const stats = useMemo(() => {
    const total = applications.length
    const interviews = applications.filter((app) => app.status === 'interview').length
    const pending = applications.filter((app) =>
      ['applied', 'under_review', 'shortlisted'].includes(app.status)
    ).length
    const selected = applications.filter((app) => app.status === 'selected').length

    return { total, interviews, pending, selected }
  }, [applications])

  const recentApplications = useMemo(
    () =>
      [...applications]
        .sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at))
        .slice(0, 5),
    [applications],
  )

  return (
    <div className="fade-in-up">
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Hello, {user?.name || 'Candidate'}!
        </Title>
        <Text type="secondary">Here is your job search overview</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Jobs Applied"
            value={stats.total}
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
            title="Selected"
            value={stats.selected}
            icon={<FireOutlined />}
            color="purple"
          />
        </Col>
      </Row>

      <Card
        title="Recent Applications"
        extra={<Tag color="blue">Last 30 days</Tag>}
        className="card-shadow"
      >
        {error && (
          <Result
            status="error"
            title="Could not load your applications"
            subTitle={error}
            extra={
              <Button type="primary" onClick={fetchApplications}>
                Retry
              </Button>
            }
          />
        )}

        {!error && loading && <Skeleton active paragraph={{ rows: 4 }} />}

        {!error && !loading && recentApplications.length === 0 && (
          <Empty
            description="No applications yet. Start applying to see updates here."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/candidate/jobs')}>
              Browse Jobs
            </Button>
          </Empty>
        )}

        {!error && !loading && recentApplications.length > 0 && (
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
                      {(item.company || 'H')[0]}
                    </Avatar>
                  }
                  title={item.job_title}
                  description={
                    <span>
                      {item.company} -{' '}
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {getRelativeDateLabel(item.applied_at)}
                      </Text>
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  )
}

export default CandidateDashboard
