import { memo, useState, useCallback } from 'react'
import { Upload, Avatar, Tooltip, Typography, Spin } from 'antd'
import { CameraOutlined, UserOutlined } from '@ant-design/icons'

const { Text } = Typography

/**
 * AvatarUpload
 * Circular profile photo upload with live preview.
 * Validates file is an image before triggering onUpload.
 *
 * @param {{ avatarUrl: string, onUpload: (file: File) => void, uploading: boolean }} props
 */
const AvatarUpload = memo(function AvatarUpload({ avatarUrl, onUpload, uploading }) {
  const [previewUrl, setPreviewUrl] = useState(avatarUrl || '')

  const beforeUpload = useCallback(
    (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) return Upload.LIST_IGNORE

      // Show instant local preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      onUpload(file)
      return false
    },
    [onUpload],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={beforeUpload}
        disabled={uploading}
      >
        <Tooltip title="Click to change photo">
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Avatar
              size={100}
              src={previewUrl || undefined}
              icon={!previewUrl && <UserOutlined />}
              style={{
                backgroundColor: previewUrl ? 'transparent' : '#1890ff',
                border: '3px solid #e8e8e8',
                transition: 'border-color 0.2s',
              }}
            />
            {/* Camera overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#1890ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              {uploading
                ? <Spin size="small" style={{ lineHeight: 1 }} />
                : <CameraOutlined style={{ color: '#fff', fontSize: 13 }} />
              }
            </div>
          </div>
        </Tooltip>
      </Upload>
      <Text type="secondary" style={{ fontSize: 12 }}>
        Click to upload photo
      </Text>
    </div>
  )
})

export default AvatarUpload
