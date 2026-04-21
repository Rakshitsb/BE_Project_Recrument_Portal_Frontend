import { useCallback, useEffect, useMemo, useState } from 'react'
import { Avatar, Badge, Button, Card, Empty, List, Result, Skeleton, Space, Tag, Typography } from 'antd'
import { LockOutlined, MessageOutlined, ReloadOutlined, RobotOutlined, StopOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons'

import ChatWindow from '../../components/chat/ChatWindow'
import { getChatSessions, getHRSessions } from '../../services/chatbotService'
import useAuthStore from '../../store/authStore'

const { Text, Title, Paragraph } = Typography

function formatSessionTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getSessionTitle(session, role) {
  if (role === 'hr') {
    return session.candidate_name || `Candidate ${String(session.candidate_id || '').slice(-6) || 'Chat'}`
  }
  return session.job_title || `Job ${String(session.job_id || '').slice(-6) || 'Chat'}`
}

function getSessionSubtitle(session, role) {
  if (role === 'hr') {
    return session.job_title || `Job ID: ${session.job_id || 'Not available'}`
  }
  if (!session.is_enabled) return 'Access disabled by HR'
  return session.company_name || 'AI assistant enabled'
}

// Keyframe injection helper (runs once)
const DISABLED_PANEL_STYLE_ID = 'disabled-chat-panel-styles'
function injectDisabledPanelStyles() {
  if (document.getElementById(DISABLED_PANEL_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = DISABLED_PANEL_STYLE_ID
  style.textContent = `
    @keyframes dcp-float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-8px); }
    }
    @keyframes dcp-glow-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.25), 0 8px 32px rgba(255, 77, 79, 0.18); }
      50%       { box-shadow: 0 0 0 14px rgba(255, 77, 79, 0), 0 8px 32px rgba(255, 77, 79, 0.35); }
    }
    @keyframes dcp-shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    @keyframes dcp-fade-up {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes dcp-spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .dcp-card {
      animation: dcp-fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    .dcp-icon-wrap {
      animation: dcp-float 3.2s ease-in-out infinite, dcp-glow-pulse 3.2s ease-in-out infinite;
    }
    .dcp-shimmer-bar {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 800px 100%;
      animation: dcp-shimmer 1.8s infinite linear;
      border-radius: 4px;
      height: 8px;
    }
    .dcp-orbit {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1.5px dashed rgba(255, 77, 79, 0.2);
      animation: dcp-spin-slow 12s linear infinite;
    }
  `
  document.head.appendChild(style)
}

// ── Premium Disabled state panel shown in the right pane for candidates ────
function DisabledChatPanel({ session }) {
  injectDisabledPanelStyles()
  const jobLabel = session?.job_title || `Job ${String(session?.job_id || '').slice(-6)}`
  const companyLabel = session?.company_name || null

  return (
    <div
      style={{
        height: '100%',
        minHeight: 520,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 60% 30%, #fff0f0 0%, #fafafa 55%, #f0f4ff 100%)',
        padding: 32,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background blobs */}
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 220, height: 220, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,77,79,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -40,
        width: 260, height: 260, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(24,144,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Glass card */}
      <div
        className="dcp-card"
        style={{
          textAlign: 'center',
          maxWidth: 420,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 20,
          border: '1px solid rgba(255, 77, 79, 0.15)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
          padding: '44px 36px 36px',
          position: 'relative',
        }}
      >
        {/* Floating lock icon */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 28 }}>
          {/* Orbit ring */}
          <div style={{ position: 'absolute', inset: -12 }}>
            <div className="dcp-orbit" />
          </div>
          {/* Icon circle */}
          <div
            className="dcp-icon-wrap"
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fff1f0 0%, #ffe4e4 100%)',
              border: '2px solid rgba(255, 77, 79, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <LockOutlined style={{ fontSize: 38, color: '#ff4d4f' }} />
          </div>
        </div>

        {/* Status badge */}
        <div style={{ marginBottom: 14 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 14px',
              borderRadius: 999,
              background: 'linear-gradient(90deg, #fff1f0, #ffe4e4)',
              border: '1px solid #ffccc7',
              fontSize: 12,
              fontWeight: 600,
              color: '#cf1322',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#ff4d4f',
              display: 'inline-block',
              boxShadow: '0 0 0 3px rgba(255,77,79,0.25)',
            }} />
            Bot Disabled
          </span>
        </div>

        {/* Heading */}
        <Title
          level={4}
          style={{ marginBottom: 8, color: '#1a1a2e', fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          Your HR has disabled the chatbot
        </Title>

        {/* Subtitle / job+company label */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Tag
            style={{
              borderRadius: 8,
              fontSize: 12,
              padding: '3px 12px',
              background: '#f0f4ff',
              border: '1px solid #d6e4ff',
              color: '#2f54eb',
              fontWeight: 500,
            }}
          >
            {jobLabel}
          </Tag>
          {companyLabel && (
            <Tag
              style={{
                borderRadius: 8,
                fontSize: 12,
                padding: '3px 12px',
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                color: '#389e0d',
                fontWeight: 500,
              }}
            >
              {companyLabel}
            </Tag>
          )}
        </div>

        {/* Message */}
        <Paragraph
          style={{
            fontSize: 14,
            lineHeight: 1.75,
            color: '#595959',
            marginBottom: 0,
          }}
        >
          The HR team has temporarily paused AI chatbot access for this position.
          You cannot send or receive messages until they re-enable it.
        </Paragraph>

        {/* Shimmer loading bar (decorative — conveys "waiting" state) */}
        <div style={{ margin: '24px auto 20px', maxWidth: 220 }}>
          <div className="dcp-shimmer-bar" style={{ marginBottom: 8, opacity: 0.7 }} />
          <div className="dcp-shimmer-bar" style={{ width: '70%', margin: '0 auto', opacity: 0.45 }} />
        </div>

        {/* Info box */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #fffbe6 0%, #fff7d6 100%)',
            border: '1px solid #ffe58f',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <WarningOutlined style={{ color: '#d48806', fontSize: 15, marginTop: 2, flexShrink: 0 }} />
          <Text style={{ fontSize: 12, color: '#7c5900', lineHeight: 1.6 }}>
            Please check back later or reach out to your HR coordinator
            directly if you have any urgent questions.
          </Text>
        </div>
      </div>
    </div>
  )
}

function ChatbotInbox() {
  const { role } = useAuthStore()
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isHR = role === 'hr'

  const loadSessions = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = isHR ? await getHRSessions() : await getChatSessions()
      const list = Array.isArray(data) ? data : []
      setSessions(list)
      setActiveSessionId((current) => {
        if (current && list.some((session) => session.id === current)) return current
        return list[0]?.id || null
      })
    } catch {
      setError('Failed to load chatbot sessions. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [isHR])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) || null,
    [activeSessionId, sessions],
  )

  // For the sidebar count — show all for HR, but split enabled/disabled for candidates
  const enabledCount = sessions.filter((s) => s.is_enabled).length

  return (
    <div className="fade-in-up">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            AI Chatbot
          </Title>
          <Text type="secondary">
            {isHR
              ? 'Manage all candidate conversations from one place'
              : 'All your shortlisted job assistants in one inbox'}
          </Text>
        </div>
        <Button icon={<ReloadOutlined />} loading={loading} onClick={loadSessions}>
          Refresh
        </Button>
      </div>

      {error && (
        <Result
          status="error"
          title="Could not load chats"
          subTitle={error}
          extra={<Button type="primary" onClick={loadSessions}>Retry</Button>}
        />
      )}

      {!error && (
        <Card bodyStyle={{ padding: 0 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 340px) minmax(0, 1fr)',
              minHeight: 'calc(100vh - 210px)',
            }}
          >
            {/* ── Sidebar ── */}
            <div
              style={{
                borderRight: '1px solid #f0f0f0',
                background: '#fff',
                minHeight: 520,
              }}
            >
              <div
                style={{
                  padding: 16,
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Space>
                  <RobotOutlined style={{ color: '#1890ff' }} />
                  <Text strong>Chats</Text>
                </Space>
                <Space size={4}>
                  {!isHR && sessions.length > 0 && (
                    <Tag color="default" style={{ marginRight: 0 }}>
                      {enabledCount} active
                    </Tag>
                  )}
                  <Tag color="blue">{sessions.length}</Tag>
                </Space>
              </div>

              {loading ? (
                <div style={{ padding: 16 }}>
                  <Skeleton active paragraph={{ rows: 8 }} />
                </div>
              ) : sessions.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={isHR ? 'No candidate chats yet' : 'No AI assistants available yet'}
                  style={{ marginTop: 56 }}
                />
              ) : (
                <List
                  dataSource={sessions}
                  renderItem={(session) => {
                    const selected = activeSessionId === session.id
                    const isDisabled = !session.is_enabled

                    return (
                      <List.Item
                        onClick={() => setActiveSessionId(session.id)}
                        style={{
                          cursor: 'pointer',
                          padding: '14px 16px',
                          background: selected
                            ? isDisabled ? '#fff2f0' : '#e6f4ff'
                            : '#fff',
                          borderBottom: '1px solid #f5f5f5',
                          opacity: isDisabled && !isHR ? 0.75 : 1,
                          transition: 'background 0.15s',
                        }}
                      >
                        <List.Item.Meta
                          avatar={
                            <Badge
                              dot={session.is_enabled}
                              color={session.is_enabled ? 'green' : 'red'}
                              offset={[-2, 2]}
                            >
                              <Avatar
                                icon={
                                  !isHR && isDisabled
                                    ? <StopOutlined />
                                    : isHR
                                    ? <UserOutlined />
                                    : <RobotOutlined />
                                }
                                style={{
                                  backgroundColor: selected
                                    ? isDisabled ? '#ff4d4f' : '#1890ff'
                                    : isDisabled ? '#d9d9d9' : '#8c8c8c',
                                }}
                              />
                            </Badge>
                          }
                          title={
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: 8,
                              }}
                            >
                              <Text
                                strong={!isDisabled || isHR}
                                ellipsis
                                style={{
                                  maxWidth: 160,
                                  color: isDisabled && !isHR ? '#8c8c8c' : undefined,
                                }}
                              >
                                {getSessionTitle(session, role)}
                              </Text>
                              <Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                                {formatSessionTime(session.updated_at)}
                              </Text>
                            </div>
                          }
                          description={
                            <div>
                              <Text
                                type="secondary"
                                ellipsis
                                style={{
                                  display: 'block',
                                  color: isDisabled && !isHR ? '#ff4d4f' : undefined,
                                  fontSize: 12,
                                }}
                              >
                                {getSessionSubtitle(session, role)}
                              </Text>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {session.message_count || 0} message{(session.message_count || 0) === 1 ? '' : 's'}
                              </Text>
                            </div>
                          }
                        />
                      </List.Item>
                    )
                  }}
                />
              )}
            </div>

            {/* ── Right pane ── */}
            <div style={{ minWidth: 0, minHeight: 520 }}>
              {activeSession ? (
                // Show disabled panel for candidates whose session is off
                !isHR && !activeSession.is_enabled ? (
                  <DisabledChatPanel session={activeSession} />
                ) : (
                  <ChatWindow
                    mode={isHR ? 'hr' : 'candidate'}
                    jobId={activeSession.job_id}
                    candidateId={activeSession.candidate_id}
                    jobTitle={getSessionSubtitle(activeSession, role)}
                  />
                )
              ) : (
                <div
                  style={{
                    height: '100%',
                    minHeight: 520,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fafafa',
                  }}
                >
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Select a chat to start"
                  >
                    <MessageOutlined style={{ color: '#1890ff', fontSize: 24 }} />
                  </Empty>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ChatbotInbox
