import { useCallback, useEffect, useMemo, useState } from 'react'
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
  Drawer,
  Skeleton,
  Space,
  Result,
} from 'antd'
import {
  FileSearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  MessageOutlined,
  RobotOutlined,
} from '@ant-design/icons'

import useAuthStore from '../../store/authStore'
import useApiCall from '../../hooks/useApiCall'
import applicationService from '../../services/applicationService'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import ChatWindow from '../../components/chat/ChatWindow'

const { Title, Text } = Typography

const statusColorMap = {
  shortlisted: 'blue',
  interview: 'purple',
  selected: 'success',
}

const StatusTag = ({ status }) => (
  <Tag color={statusColorMap[status] || 'default'}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </Tag>
)

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
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeChat, setActiveChat] = useState(null)
  // activeChat shape: { jobId: string, jobTitle: string }

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

  // Filter applications eligible for chatbot
  const CHAT_STATUSES = ['shortlisted', 'interview', 'selected']

  const chatEligibleApplications = (applications || []).filter(
    (app) => CHAT_STATUSES.includes(app.status)
  )

  // Open drawer for a specific job
  const openChatDrawer = (jobId, jobTitle, companyLogoUrl = '') => {
    setActiveChat({ jobId, jobTitle, companyLogoUrl })
    setDrawerOpen(true)
  }

  const closeChatDrawer = () => {
    setDrawerOpen(false)
    // Delay clearing activeChat so ChatWindow doesn't flash
    // empty state while the drawer animates closed
    setTimeout(() => setActiveChat(null), 300)
  }

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
                    <Avatar src={item.companyLogoUrl || undefined} style={{ backgroundColor: item.logoBg || '#1890ff' }}>
                      {!item.companyLogoUrl && (item.company || 'H')[0]}
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

      {/* ══════════════════════════════════════════
          AI JOB ASSISTANTS SECTION
          Only renders when at least one eligible application exists
          ══════════════════════════════════════════ */}
      {chatEligibleApplications.length > 0 && (
        <Card
          style={{ marginTop: 24 }}
          title={
            <Space>
              <RobotOutlined style={{ color: '#1890ff', fontSize: 18 }} />
              <Title level={5} style={{ margin: 0 }}>
                AI Job Assistants
              </Title>
            </Space>
          }
          extra={
            <Text type="secondary" style={{ fontSize: 12 }}>
              Available for shortlisted applications
            </Text>
          }
        >
          <List
            dataSource={chatEligibleApplications}
            renderItem={(app) => (
              <List.Item
                key={app.job_id}
                style={{
                  padding: '12px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}
                actions={[
                  <Button
                    key="chat"
                    type="primary"
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={() =>
                      openChatDrawer(
                        app.job_id,
                        app.job_title || 'Job',
                        app.companyLogoUrl || ''
                      )
                    }
                  >
                    Chat
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#e6f4ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircleOutlined
                        style={{ color: '#1890ff', fontSize: 18 }}
                      />
                    </div>
                  }
                  title={
                    <Space>
                      <Text strong>{app.job_title || 'Job'}</Text>
                      <StatusTag status={app.status} />
                    </Space>
                  }
                  description={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {app.company_name
                        ? `${app.company_name} · `
                        : ''}
                      AI assistant ready to answer your questions
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* ══════════════════════════════════════════
          CHAT DRAWER
          Renders outside the section so it overlays the full page
          ══════════════════════════════════════════ */}
      <Drawer
        title={
          <Space>
            <RobotOutlined style={{ color: '#1890ff' }} />
            <span>AI Assistant</span>
            {activeChat?.jobTitle && (
              <Text type="secondary" style={{ fontSize: 13 }}>
                — {activeChat.jobTitle}
              </Text>
            )}
          </Space>
        }
        placement="right"
        width={Math.min(480, window.innerWidth)}
        open={drawerOpen}
        onClose={closeChatDrawer}
        destroyOnClose={false}
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column' }}
      >
        {activeChat ? (
          <ChatWindow
            jobId={activeChat.jobId}
            jobTitle={activeChat.jobTitle}
            companyLogoUrl={activeChat.companyLogoUrl}
          />
        ) : (
          <Empty
            style={{ marginTop: 80 }}
            description="Select a job to start chatting"
          />
        )}
      </Drawer>
    </div>
  )
}

export default CandidateDashboard
