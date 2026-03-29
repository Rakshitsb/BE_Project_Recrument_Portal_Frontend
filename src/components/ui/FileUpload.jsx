import { memo, useCallback } from 'react'
import { Upload, Typography, Alert } from 'antd'
import { InboxOutlined, FileTextOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'

const { Dragger } = Upload
const { Text, Title } = Typography

const ACCEPTED_TYPES = {
  'application/pdf':                                                    ['.pdf'],
  'application/msword':                                                 ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain':                                                         ['.txt'],
}

const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt']

/**
 * FileUpload
 * Drag-and-drop resume uploader. Validates file type client-side,
 * then delegates the actual upload to the parent via `onUpload`.
 *
 * @param {{ onUpload: (file: File) => void, uploading: boolean, parsed: boolean }} props
 */
const FileUpload = memo(function FileUpload({ onUpload, uploading, parsed }) {
  const beforeUpload = useCallback(
    (file) => {
      const ext = '.' + file.name.split('.').pop().toLowerCase()
      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        return Upload.LIST_IGNORE
      }
      onUpload(file)
      // Prevent Ant Design's default upload behaviour
      return false
    },
    [onUpload],
  )

  return (
    <div>
      <Dragger
        accept={ACCEPTED_EXTENSIONS.join(',')}
        beforeUpload={beforeUpload}
        showUploadList={false}
        disabled={uploading}
        style={{
          borderRadius: 12,
          background: parsed ? '#f6ffed' : '#fafafa',
          borderColor: parsed ? '#52c41a' : '#d9d9d9',
          transition: 'all 0.3s',
        }}
      >
        <div style={{ padding: '20px 16px' }}>
          {uploading ? (
            <>
              <LoadingOutlined style={{ fontSize: 36, color: '#1890ff' }} />
              <Title level={5} style={{ margin: '12px 0 4px', color: '#1890ff' }}>
                Parsing your resume...
              </Title>
              <Text type="secondary">This may take a few seconds</Text>
            </>
          ) : parsed ? (
            <>
              <CheckCircleOutlined style={{ fontSize: 36, color: '#52c41a' }} />
              <Title level={5} style={{ margin: '12px 0 4px', color: '#52c41a' }}>
                Resume Parsed!
              </Title>
              <Text type="secondary">Upload a different file to re-parse</Text>
            </>
          ) : (
            <>
              <InboxOutlined style={{ fontSize: 40, color: '#1890ff' }} />
              <Title level={5} style={{ margin: '12px 0 4px' }}>
                Drag & drop your resume here
              </Title>
              <Text type="secondary">
                or <span style={{ color: '#1890ff', cursor: 'pointer' }}>browse files</span>
              </Text>
              <div style={{ marginTop: 10 }}>
                {ACCEPTED_EXTENSIONS.map((ext) => (
                  <span
                    key={ext}
                    style={{
                      display: 'inline-block',
                      margin: '2px 4px',
                      padding: '2px 8px',
                      background: '#f0f0f0',
                      borderRadius: 4,
                      fontSize: 12,
                      color: '#595959',
                    }}
                  >
                    {ext.toUpperCase()}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </Dragger>

      {parsed && (
        <Alert
          type="success"
          showIcon
          icon={<FileTextOutlined />}
          message="Resume data has been auto-filled below. Review and edit before saving."
          style={{ marginTop: 10, borderRadius: 8 }}
        />
      )}
    </div>
  )
})

export default FileUpload
