import { useEffect, useState } from 'react'
import { Space, Tag, Tabs, Skeleton, Alert, App } from 'antd'
import { UserOutlined, IdcardOutlined } from '@ant-design/icons'

import { PageHeader, ConfirmModal } from '../../components/ui'
import { CandidateTable }  from '../../components/admin/CandidateTable'
import { HRTable }         from '../../components/admin/HRTable'
import { UserDetailModal } from '../../components/admin/UserDetailModal'
import { adminService } from '../../services'

/**
 * UserManagement
 * Admin page to browse, inspect, and delete candidate and HR users.
 */
export function UserManagement() {
  const { message } = App.useApp()

  const [candidates,   setCandidates]   = useState([])
  const [hrUsers,      setHRUsers]      = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [activeTab,    setActiveTab]    = useState('candidates')
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [confirmOpen,  setConfirmOpen]  = useState(false)
  const [deleteType,   setDeleteType]   = useState(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const [c, h] = await Promise.all([
          adminService.getCandidates(),
          adminService.getHRs(),
        ])
        setCandidates(c)
        setHRUsers(h)
      } catch {
        setError('Failed to load users. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  /** Open the detail modal for a user. */
  function handleView(user, type) {
    setSelectedUser(user)
    setActiveTab(type)
    setModalOpen(true)
  }

  /** Prime the confirm-delete dialog. */
  function handleDelete(user, type) {
    setDeleteTarget(user)
    setDeleteType(type)
    setConfirmOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deleteTarget || !deleteType) return
    const targetUserId = deleteTarget.userId ?? deleteTarget.id
    if (!targetUserId) {
      message.error('Unable to determine which user to delete.')
      setConfirmOpen(false)
      setDeleteTarget(null)
      setDeleteType(null)
      return
    }
    setDeleteLoading(true)
    try {
      if (deleteType === 'candidate') {
        await adminService.deleteCandidate(targetUserId)
        setCandidates((prev) => prev.filter((c) => c.id !== deleteTarget.id))
        message.success('Candidate deleted successfully')
      } else if (deleteType === 'hr') {
        await adminService.deleteHR(targetUserId)
        setHRUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
        message.success('HR user deleted successfully')
      }
    } catch {
      message.error('Failed to delete user. Please try again.')
    } finally {
      setDeleteLoading(false)
      setConfirmOpen(false)
      setDeleteTarget(null)
      setDeleteType(null)
    }
  }

  const tabItems = [
    {
      key:   'candidates',
      label: <span><UserOutlined style={{ marginRight: 6 }} />Candidates</span>,
      children: (
        <CandidateTable
          candidates={candidates}
          onView={(u) => handleView(u, 'candidates')}
          onDelete={(u) => handleDelete(u, 'candidate')}
        />
      ),
    },
    {
      key:   'hr',
      label: <span><IdcardOutlined style={{ marginRight: 6 }} />HR Users</span>,
      children: (
        <HRTable
          hrUsers={hrUsers}
          onView={(u) => handleView(u, 'hr')}
          onDelete={(u) => handleDelete(u, 'hr')}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Manage all candidates and HR users on the platform"
        actions={
          <Space>
            <Tag color="blue">{candidates.length} Candidates</Tag>
            <Tag color="purple">{hrUsers.length} HR Users</Tag>
          </Space>
        }
      />

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      )}

      <UserDetailModal
        open={modalOpen}
        user={selectedUser}
        userType={activeTab}
        onClose={() => { setModalOpen(false); setSelectedUser(null) }}
      />

      <ConfirmModal
        open={confirmOpen}
        danger
        loading={deleteLoading}
        title="Delete User"
        description="This will permanently delete the user and all their associated data including jobs, applications, and profiles. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleteLoading) {
            setConfirmOpen(false)
            setDeleteTarget(null)
            setDeleteType(null)
          }
        }}
      />
    </div>
  )
}

export default UserManagement
