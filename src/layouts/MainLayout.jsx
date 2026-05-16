import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Button, Typography, Badge, Popover, Empty, List, Modal } from 'antd'
import {
  DashboardOutlined,
  FileTextOutlined,
  SearchOutlined,
  TeamOutlined,
  SolutionOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  VideoCameraOutlined,
  RobotOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getChatSession, getChatSessions } from '../services/chatbotService'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const getNotificationStorageKey = (user) =>
  `hirebase_candidate_chat_seen_counts_${user?.id || user?.email || 'current'}`

const getInterviewAlertStorageKey = (user) =>
  `hirebase_candidate_interview_alerted_messages_${user?.id || user?.email || 'current'}`

function readSeenCounts(user) {
  try {
    const raw = localStorage.getItem(getNotificationStorageKey(user))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeSeenCounts(user, counts) {
  try {
    localStorage.setItem(getNotificationStorageKey(user), JSON.stringify(counts))
  } catch {
    // Ignore storage failures; notifications can still work for this page session.
  }
}

function readAlertedInterviewIds(user) {
  try {
    const raw = localStorage.getItem(getInterviewAlertStorageKey(user))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAlertedInterviewIds(user, ids) {
  try {
    localStorage.setItem(getInterviewAlertStorageKey(user), JSON.stringify(ids))
  } catch {
    // Ignore storage failures; the modal still works for this page session.
  }
}

function isInterviewInviteMessage(message) {
  return (
    message?.role === 'hr' &&
    (
      message?.modal_payload?.type === 'interview_invite' ||
      message?.message_type === 'interview_invite'
    )
  )
}

function getMessageIdentity(session, message, index) {
  return String(
    message?.id ||
    message?._id ||
    message?.modal_payload?.interview_id ||
    `${session.id || session.job_id}-interview-invite-${index}`,
  )
}

// ── Menu configs per role ─────────────────────────────────────────
const candidateMenuItems = [
  { key: '/candidate',              icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/candidate/jobs',         icon: <SearchOutlined />,    label: 'Browse Jobs' },
  { key: '/candidate/applications', icon: <FileTextOutlined />,  label: 'My Applications' },
  { key: '/candidate/chatbot',      icon: <MessageOutlined />,   label: 'AI Chatbot' },
  { key: '/candidate/profile',      icon: <UserOutlined />,      label: 'My Profile' },
]

const hrMenuItems = [
  { key: '/hr',              icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/hr/jobs',         icon: <SolutionOutlined />,  label: 'Manage Jobs' },
  { key: '/hr/applications', icon: <TeamOutlined />,      label: 'Applications' },
  { key: '/hr/chatbot',      icon: <MessageOutlined />,   label: 'Candidate Chats' },
  { key: '/hr/interviews',   icon: <VideoCameraOutlined />, label: 'Interviews' },
  { key: '/hr/interviewers', icon: <RobotOutlined />,       label: 'Interviewers' },
]

/**
 * MainLayout
 * Ant Design sidebar + header shell for authenticated pages.
 * Supports role-based menu rendering.
 */
function MainLayout({ role }) {
  const [collapsed, setCollapsed] = useState(false)
  const [chatSessions, setChatSessions] = useState([])
  const [seenChatCounts, setSeenChatCounts] = useState({})
  const [notificationOpen, setNotificationOpen] = useState(false)
  const seenInitializedRef = useRef(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, logout } = useAuth()

  const menuItems = role === 'hr' ? hrMenuItems : candidateMenuItems
  const selectedMenuKey =
    location.pathname.startsWith('/hr/interviews/')
      ? '/hr/interviews'
      : role === 'candidate' && (location.pathname === '/jobs' || location.pathname.startsWith('/candidate/jobs'))
      ? '/candidate/jobs'
      : location.pathname

  const userMenuItems = [
    {
      key:   'profile',
      icon:  <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate(role === 'hr' ? '/hr/profile' : '/candidate/profile'),
    },
    { type: 'divider' },
    {
      key:     'logout',
      icon:    <LogoutOutlined />,
      label:   'Logout',
      danger:  true,
      onClick: logout,
    },
  ]

  const refreshCandidateNotifications = useCallback(async () => {
    if (role !== 'candidate') return

    try {
      const data = await getChatSessions()
      const sessions = Array.isArray(data) ? data : []
      const storedCounts = readSeenCounts(user)
      setChatSessions(sessions)

      if (!seenInitializedRef.current) {
        if (storedCounts) {
          setSeenChatCounts(storedCounts)
        } else {
          const baselineCounts = Object.fromEntries(
            sessions.map((session) => [session.id, session.message_count || 0]),
          )
          setSeenChatCounts(baselineCounts)
          writeSeenCounts(user, baselineCounts)
        }

        seenInitializedRef.current = true
      }

      if (!storedCounts) return

      const alertedIds = readAlertedInterviewIds(user)
      const alertedIdSet = new Set(alertedIds)

      for (const session of sessions) {
        const messageCount = session.message_count || 0
        const seenCount = storedCounts[session.id] || 0

        if (messageCount <= seenCount || !session.job_id) continue

        try {
          const fullSession = await getChatSession(session.job_id)
          const messages = Array.isArray(fullSession?.messages) ? fullSession.messages : []
          const newMessages = messages.slice(Math.max(seenCount, 0))
          const inviteIndex = newMessages.findIndex(isInterviewInviteMessage)
          const inviteMessage = inviteIndex >= 0 ? newMessages[inviteIndex] : null

          if (!inviteMessage) continue

          const inviteId = getMessageIdentity(session, inviteMessage, seenCount + inviteIndex)
          if (alertedIdSet.has(inviteId)) continue

          alertedIdSet.add(inviteId)
          writeAlertedInterviewIds(user, Array.from(alertedIdSet))

          Modal.confirm({
            centered: true,
            title: 'Interview Invitation Received',
            content: inviteMessage.content || 'You have received an important interview invitation from HR.',
            okText: inviteMessage?.modal_payload?.interview_link ? 'Join Interview' : 'Open Chat',
            cancelText: 'Later',
            onOk: () => {
              if (inviteMessage?.modal_payload?.interview_link) {
                window.open(inviteMessage.modal_payload.interview_link, '_blank')
                return
              }
              navigate('/candidate/chatbot')
            },
          })
        } catch {
          // Keep polling notifications even if one full chat lookup fails.
        }
      }
    } catch {
      // Keep the bell quiet if the background refresh fails.
    }
  }, [navigate, role, user])

  useEffect(() => {
    if (role !== 'candidate') return

    const initialRefresh = setTimeout(refreshCandidateNotifications, 0)
    const interval = setInterval(refreshCandidateNotifications, 30000)
    return () => {
      clearTimeout(initialRefresh)
      clearInterval(interval)
    }
  }, [refreshCandidateNotifications, role])

  const unreadChatNotifications = useMemo(
    () => chatSessions
      .map((session) => {
        const messageCount = session.message_count || 0
        const seenCount = seenChatCounts[session.id] || 0
        return {
          ...session,
          unreadCount: Math.max(messageCount - seenCount, 0),
        }
      })
      .filter((session) => session.unreadCount > 0),
    [chatSessions, seenChatCounts],
  )

  const unreadNotificationCount = unreadChatNotifications.reduce(
    (total, session) => total + session.unreadCount,
    0,
  )

  const markChatNotificationsSeen = useCallback(() => {
    if (role !== 'candidate') return

    const nextCounts = Object.fromEntries(
      chatSessions.map((session) => [session.id, session.message_count || 0]),
    )
    setSeenChatCounts(nextCounts)
    writeSeenCounts(user, nextCounts)
  }, [chatSessions, role, user])

  useEffect(() => {
    if (role === 'candidate' && location.pathname.startsWith('/candidate/chatbot')) {
      const markSeenTimer = setTimeout(markChatNotificationsSeen, 0)
      return () => clearTimeout(markSeenTimer)
    }
  }, [location.pathname, markChatNotificationsSeen, role])

  const notificationContent = (
    <div style={{ width: 320 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text strong>Notifications</Text>
        {unreadNotificationCount > 0 && (
          <Button type="link" size="small" onClick={markChatNotificationsSeen}>
            Mark all read
          </Button>
        )}
      </div>

      {unreadChatNotifications.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No new messages" />
      ) : (
        <List
          dataSource={unreadChatNotifications}
          renderItem={(session) => (
            <List.Item
              style={{ cursor: 'pointer', padding: '10px 0' }}
              onClick={() => {
                markChatNotificationsSeen()
                setNotificationOpen(false)
                navigate('/candidate/chatbot')
              }}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<MessageOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                title={
                  <Text strong>
                    {session.unreadCount} new message{session.unreadCount === 1 ? '' : 's'}
                  </Text>
                }
                description={
                  <Text type="secondary">
                    {session.job_title || 'AI Chatbot'}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  )

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <Sider
        className="main-sidebar"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
        trigger={null}
      >
        <div className="sidebar-logo">
          {!collapsed && <h2>🚀 HireBase</h2>}
          {collapsed && <h2>🚀</h2>}
        </div>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectedMenuKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>

      <Layout>
        {/* ── Header ── */}
        <Header className="main-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18 }}
          />

          <div className="header-actions">
            {role === 'candidate' ? (
              <Popover
                trigger="click"
                placement="bottomRight"
                open={notificationOpen}
                onOpenChange={setNotificationOpen}
                content={notificationContent}
              >
                <Badge count={unreadNotificationCount} size="small" offset={[-2, 4]}>
                  <Button
                    type="text"
                    aria-label="Open notifications"
                    icon={<BellOutlined style={{ fontSize: 18 }} />}
                  />
                </Badge>
              </Popover>
            ) : (
              <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
            )}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              >
                <Avatar
                  style={{ backgroundColor: '#1890ff' }}
                  icon={<UserOutlined />}
                  size="small"
                />
                <Text strong style={{ fontSize: 14 }}>
                  {user?.name || 'User'}
                </Text>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* ── Content ── */}
        <Content className="page-container">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
