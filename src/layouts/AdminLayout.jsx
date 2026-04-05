import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Button, Typography, theme } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  SolutionOutlined,
  FileTextOutlined,
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

// ── Admin sidebar menu ────────────────────────────────────────────
const adminMenuItems = [
  { key: '/admin',              icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/admin/users',        icon: <TeamOutlined />,      label: 'Users' },
  { key: '/admin/jobs',         icon: <SolutionOutlined />,  label: 'Jobs' },
  { key: '/admin/applications', icon: <FileTextOutlined />,  label: 'Applications' },
]

/**
 * AdminLayout
 * Ant Design Sider + Header shell for admin-role pages.
 * Provides dark sidebar, collapse toggle, bell notification icon,
 * and a user avatar dropdown with profile and logout actions.
 */
export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, logout } = useAuth()
  const { token } = theme.useToken()

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
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
        theme="dark"
      >
        <div className="sidebar-logo">
          {!collapsed && <h2>⚙️ HireBase Admin</h2>}
          {collapsed  && <h2>⚙️</h2>}
        </div>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[location.pathname]}
          items={adminMenuItems}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar
                  style={{ backgroundColor: token.colorPrimary }}
                  icon={<UserOutlined />}
                  size="small"
                />
                <Text strong style={{ fontSize: 14 }}>
                  {user?.name || 'Admin'}
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
