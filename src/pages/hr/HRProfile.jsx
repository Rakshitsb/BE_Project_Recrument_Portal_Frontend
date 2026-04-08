import { useRef, useState, useEffect } from 'react'
import { Button, Space, Skeleton, Result, App } from 'antd'
import { EditOutlined, SaveOutlined } from '@ant-design/icons'

import { PageHeader }        from '../../components/ui'
import { HRProfileCard }     from '../../components/hr/HRProfileCard'
import { HRProfileEditForm } from '../../components/hr/HRProfileEditForm'
import useApiCall            from '../../hooks/useApiCall'
import { hrProfileService }  from '../../services'

/**
 * HRProfile
 * Shows the HR user's profile in read-only or editable mode.
 * Fetches profile from GET /hr/profile on mount.
 * Saves changes via PUT /hr/profile.
 */
export function HRProfile() {
  const { message } = App.useApp()
  const formRef = useRef(null)

  const [editMode, setEditMode] = useState(false)
  const [profile,  setProfile]  = useState(null)

  // ── API hooks ──────────────────────────────────────────────────
  const { execute: fetchProfile, loading: fetchLoading, error, data } =
    useApiCall(hrProfileService.getProfile)

  const { execute: saveProfile, loading: saveLoading } =
    useApiCall(hrProfileService.updateProfile)

  // ── Fetch on mount ─────────────────────────────────────────────
  useEffect(() => { fetchProfile() }, [])

  // ── Sync API data into local state ─────────────────────────────
  useEffect(() => {
    if (data) setProfile(data)
  }, [data])

  // ── Handlers ──────────────────────────────────────────────────
  const handleSave = async (values) => {
    try {
      await saveProfile(values)
      setProfile((prev) => ({ ...prev, ...values }))
      setEditMode(false)
      message.success('Profile updated successfully!')
    } catch {
      // error already shown by useApiCall
    }
  }

  const handleCancel = () => setEditMode(false)

  // ── Header actions ─────────────────────────────────────────────
  const viewActions = (
    <Button icon={<EditOutlined />} onClick={() => setEditMode(true)}>
      Edit Profile
    </Button>
  )

  const editActions = (
    <Space>
      <Button onClick={handleCancel} disabled={saveLoading}>
        Cancel
      </Button>
      <Button
        type="primary"
        icon={<SaveOutlined />}
        loading={saveLoading}
        onClick={() => formRef.current?.submit()}
      >
        Save Changes
      </Button>
    </Space>
  )

  // ── Loading state ──────────────────────────────────────────────
  if (fetchLoading && !profile) {
    return (
      <div>
        <PageHeader
          title="My Profile"
          subtitle="Manage your personal and company information"
        />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────
  if (error && !profile) {
    return (
      <Result
        status="error"
        title="Failed to load profile"
        subTitle={error}
        extra={<Button onClick={() => fetchProfile()}>Retry</Button>}
      />
    )
  }

  // ── Main render ────────────────────────────────────────────────
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

export default HRProfile
