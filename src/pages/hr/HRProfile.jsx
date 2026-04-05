import { useRef, useState } from 'react'
import { Button, Space, message } from 'antd'
import { EditOutlined, SaveOutlined } from '@ant-design/icons'

import { PageHeader }        from '../../components/ui'
import { HRProfileCard }     from '../../components/hr/HRProfileCard'
import { HRProfileEditForm } from '../../components/hr/HRProfileEditForm'

// ── Mock Data (replace with API calls later) ──────────────────────────────
const MOCK_PROFILE = {
  name:            'Rohan Mehta',
  email:           'rohan@techcorp.com',
  phone:           '+91 98765 43210',
  designation:     'Senior HR Manager',
  company:         'TechCorp India',
  companyLocation: 'Pune, Maharashtra',
  industry:        'IT & Software',
  companySize:     '201-500',
  companyWebsite:  'https://techcorp.in',
  joinedDate:      'January 2024',
}

// ── Component ─────────────────────────────────────────────────────────────

/**
 * HRProfile
 * Shows the HR user's profile in read-only or editable mode.
 * The parent-controlled "Save Changes" button triggers the form via a ref.
 */
export function HRProfile() {
  const [editMode, setEditMode] = useState(false)
  const [profile,  setProfile]  = useState(MOCK_PROFILE)
  const formRef = useRef(null)

  // ── Handlers ─────────────────────────────────────────────────────
  function handleSave(values) {
    setProfile((prev) => ({ ...prev, ...values }))
    setEditMode(false)
    message.success('Profile updated successfully!')
  }

  function handleCancel() {
    setEditMode(false)
  }

  // ── Header actions ────────────────────────────────────────────────
  const viewActions = (
    <Button
      icon={<EditOutlined />}
      onClick={() => setEditMode(true)}
    >
      Edit Profile
    </Button>
  )

  const editActions = (
    <Space>
      <Button onClick={handleCancel}>Cancel</Button>
      <Button
        type="primary"
        icon={<SaveOutlined />}
        onClick={() => formRef.current?.submit()}
      >
        Save Changes
      </Button>
    </Space>
  )

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal and company information"
        actions={editMode ? editActions : viewActions}
      />

      {editMode
        ? (
          <HRProfileEditForm
            ref={formRef}
            profile={profile}
            onSave={handleSave}
          />
        )
        : <HRProfileCard profile={profile} />
      }
    </div>
  )
}
