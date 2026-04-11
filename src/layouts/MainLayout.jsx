import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Button, Typography } from 'antd'
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
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const { Header, Sider, Content } = Layout
const { Text } = Typography

// ── Menu configs per role ─────────────────────────────────────────
const candidateMenuItems = [
  { key: '/candidate',              icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/candidate/jobs',         icon: <SearchOutlined />,    label: 'Browse Jobs' },
  { key: '/candidate/applications', icon: <FileTextOutlined />,  label: 'My Applications' },
  { key: '/candidate/profile',      icon: <UserOutlined />,      label: 'My Profile' },
]

const hrMenuItems = [
  { key: '/hr',              icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/hr/jobs',         icon: <SolutionOutlined />,  label: 'Manage Jobs' },
  { key: '/hr/applications', icon: <TeamOutlined />,      label: 'Applications' },
]

/**
 * MainLayout
 * Ant Design sidebar + header shell for authenticated pages.
 * Supports role-based menu rendering.
 */
function MainLayout({ role }) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, logout } = useAuth()

  const menuItems = role === 'hr' ? hrMenuItems : candidateMenuItems

  const userMenuItems = [
    {
      key:   'profile',
      icon:  <UserOutlined />,
      label: 'Profile',
      ...(role === 'hr' ? { onClick: () => navigate('/hr/profile') } : {}),
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
          selectedKeys={[location.pathname]}
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
            <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
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
