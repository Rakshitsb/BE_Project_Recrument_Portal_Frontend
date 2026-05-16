import { Avatar, Button, Descriptions, Divider, Modal, Tag, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import { StatusBadge } from '../ui/StatusBadge'
import { CandidateDetail } from './CandidateDetail'
import { HRDetail }        from './HRDetail'

const { Title, Text } = Typography

/**
 * UserDetailModal
 * Displays full profile details for a selected candidate or HR user.
 *
 * @param {object}   props
 * @param {boolean}  props.open     - Modal visibility
 * @param {object}   props.user     - Selected user object (candidate or HR)
 * @param {string}   props.userType - 'candidates' | 'hr'
 * @param {Function} props.onClose  - Close handler
 */
export function UserDetailModal({ open, user, userType, onClose }) {
  if (!user) return null

  const footer = (
    <Button onClick={onClose}>Close</Button>
  )

  return (
    <Modal
      open={open}
      title={user.name}
      width={600}
      footer={footer}
      onCancel={onClose}
      centered
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        style={{
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            6,
          padding:        '8px 0 4px',
          textAlign:      'center',
        }}
      >
        <Avatar size={64} src={user.avatarUrl || undefined} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
        <Title level={4} style={{ margin: 0 }}>{user.name}</Title>
        <Text type="secondary">{user.email}</Text>
        <Text type="secondary">{user.phone}</Text>
        <StatusBadge status={user.status} />
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* ── Body — delegate to type-specific sub-component ─────────── */}
      {userType === 'candidates'
        ? <CandidateDetail candidate={user} />
        : <HRDetail        hrUser={user} />
      }
    </Modal>
  )
}
