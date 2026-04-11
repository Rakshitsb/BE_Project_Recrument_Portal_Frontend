import { useRef, useState, useEffect } from 'react'
import { Button, Card, Space, Skeleton, Result, App } from 'antd'
import { EditOutlined, SaveOutlined } from '@ant-design/icons'

import { PageHeader } from '../../components/ui'
import { HRProfileCard } from '../../components/hr/HRProfileCard'
import { HRProfileEditForm } from '../../components/hr/HRProfileEditForm'
import useApiCall from '../../hooks/useApiCall'
import { hrProfileService } from '../../services'

export function HRProfile() {
  const { message } = App.useApp()
  const formRef = useRef(null)

  const [editMode, setEditMode] = useState(false)

  const { execute: fetchProfile, loading: fetchLoading, error, data } =
    useApiCall(hrProfileService.getProfile)

  const { execute: createProfile, loading: createLoading } =
    useApiCall(hrProfileService.createProfile)

  const { execute: updateProfile, loading: updateLoading } =
    useApiCall(hrProfileService.updateProfile)

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const profile = data ?? null
  const saveLoading = createLoading || updateLoading

  const handleSave = async (values) => {
    try {
      if (profile?.id) {
        await updateProfile(values)
      } else {
        await createProfile(values)
      }
      await fetchProfile()
      setEditMode(false)
      message.success(profile?.id ? 'Profile updated successfully!' : 'Profile created successfully!')
    } catch {
      // error already handled in useApiCall
    }
  }

  const handleCancel = () => setEditMode(false)

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

  if (error) {
    return (
      <Result
        status="error"
        title="Failed to load profile"
        subTitle={error}
        extra={<Button onClick={() => fetchProfile()}>Retry</Button>}
      />
    )
  }

  if (!profile && !editMode) {
    return (
      <div>
        <PageHeader
          title="My Profile"
          subtitle="Manage your personal and company information"
          actions={viewActions}
        />
        <Card>
          No HR profile found yet. Click "Edit Profile" to add your details.
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal and company information"
        actions={editMode ? editActions : viewActions}
      />

      {editMode ? (
        <HRProfileEditForm
          ref={formRef}
          profile={profile || {}}
          onSave={handleSave}
        />
      ) : (
        <HRProfileCard profile={profile} />
      )}
    </div>
  )
}

export default HRProfile
