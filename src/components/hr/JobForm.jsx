import { useCallback, useEffect, useState } from 'react'
import {
  Alert, Button, Card, Col, Divider, Form, Input, InputNumber, Row, Select,
  Space, Switch, Tag, Typography, Upload, App,
} from 'antd'
import {
  CheckCircleOutlined, FileTextOutlined, InboxOutlined, LoadingOutlined,
  SaveOutlined,
} from '@ant-design/icons'

import { jobService } from '../../services'

const { TextArea } = Input
const { Dragger } = Upload
const { Text, Title } = Typography

const JOB_TYPE_OPTIONS = ['Full-Time', 'Part-Time', 'Contract', 'Remote']
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx']

const PRIORITY_FIELDS = [
  'title',
  'company',
  'location',
  'experience_required',
  'employment_type',
  'salary_range',
]

function pruneEmptyFields(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

function titleize(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function renderParsedValue(value, keyPrefix) {
  if (Array.isArray(value)) {
    return (
      <div className="parsed-jd-list">
        {value.map((item, index) => (
          typeof item === 'object' && item !== null ? (
            <div key={`${keyPrefix}-${index}`} className="parsed-jd-nested">
              {renderParsedValue(item, `${keyPrefix}-${index}`)}
            </div>
          ) : (
            <Tag key={`${keyPrefix}-${index}`} className="parsed-jd-tag">
              {String(item)}
            </Tag>
          )
        ))}
      </div>
    )
  }

  if (value && typeof value === 'object') {
    return (
      <div className="parsed-jd-object">
        {Object.entries(value).map(([childKey, childValue]) => (
          <div key={`${keyPrefix}-${childKey}`} className="parsed-jd-subsection">
            <Text strong>{titleize(childKey)}</Text>
            {renderParsedValue(childValue, `${keyPrefix}-${childKey}`)}
          </div>
        ))}
      </div>
    )
  }

  return <Text>{String(value)}</Text>
}

function ParsedJdPreview({ data }) {
  if (!data) return null

  const entries = Object.entries(data).filter(([, value]) => {
    if (value === null || value === undefined || value === '') return false
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object') return Object.keys(value).length > 0
    return true
  })
  const priorityEntries = PRIORITY_FIELDS
    .filter((key) => data[key] !== undefined && data[key] !== null && data[key] !== '')
    .map((key) => [key, data[key]])
  const detailEntries = entries.filter(([key]) => !PRIORITY_FIELDS.includes(key))

  return (
    <div className="parsed-jd-preview">
      <div className="parsed-jd-preview-header">
        <div>
          <Title level={5} style={{ margin: 0 }}>
            Parsed JD Details
          </Title>
          <Text type="secondary">Review everything returned by the parser before creating the job.</Text>
        </div>
      </div>

      {priorityEntries.length > 0 && (
        <div className="parsed-jd-summary-grid">
          {priorityEntries.map(([key, value]) => (
            <div key={key} className="parsed-jd-summary-item">
              <Text type="secondary">{titleize(key)}</Text>
              <Text strong>{String(value)}</Text>
            </div>
          ))}
        </div>
      )}

      <div className="parsed-jd-sections">
        {detailEntries.map(([key, value]) => (
          <section key={key} className="parsed-jd-section">
            <Title level={5} className="parsed-jd-section-title">
              {titleize(key)}
            </Title>
            {renderParsedValue(value, key)}
          </section>
        ))}
      </div>
    </div>
  )
}

/**
 * JobForm
 * Full-page form for creating or editing a job listing.
 * HR can upload a JD, auto-fill parsed fields, edit them, and submit the final job.
 */
export function JobForm({ open, job, onClose, onSave, actionLoading = false }) {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [parsing, setParsing] = useState(false)
  const [parsedFileName, setParsedFileName] = useState('')
  const [parseError, setParseError] = useState('')
  const [parsedJd, setParsedJd] = useState(null)

  useEffect(() => {
    if (!open) return

    setParseError('')
    setParsedFileName('')
    setParsedJd(job?.jdParsed || null)
    job
      ? form.setFieldsValue({
          ...job,
          jdParsed: job.jdParsed ? JSON.stringify(job.jdParsed) : undefined,
        })
      : form.resetFields()
  }, [open, job, form])

  const handleFinish = (values) => {
    const jdParsed =
      typeof values.jdParsed === 'string' && values.jdParsed
        ? JSON.parse(values.jdParsed)
        : values.jdParsed

    onSave({ ...values, jdParsed })
  }

  const handleJdUpload = useCallback(
    async (file) => {
      const ext = '.' + file.name.split('.').pop().toLowerCase()

      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        message.error('Please upload a PDF, DOC, or DOCX job description.')
        return Upload.LIST_IGNORE
      }

      setParsing(true)
      setParseError('')
      setParsedJd(null)

      try {
        const parsed = await jobService.parseJd(file)
        form.setFieldsValue(pruneEmptyFields({
          ...parsed,
          jdParsed: parsed.jdParsed ? JSON.stringify(parsed.jdParsed) : undefined,
        }))
        setParsedFileName(file.name)
        setParsedJd(parsed.jdParsed || null)
        message.success('JD parsed and form auto-filled.')
      } catch (error) {
        const detail = error.response?.data?.detail
        const fallback = 'Could not parse this JD. Please try another file or fill the form manually.'
        setParseError(typeof detail === 'string' ? detail : fallback)
      } finally {
        setParsing(false)
      }

      return false
    },
    [form, message],
  )

  if (!open) return null

  return (
    <div className="job-form-page">
      <Card className="job-form-card">
        <div className="job-form-heading">
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {job ? 'Edit Job' : 'Create Job'}
            </Title>
            <Text type="secondary">
              Upload a JD to auto-fill the form, then review and edit before publishing.
            </Text>
          </div>
        </div>

        {!job && (
          <>
            <Dragger
              accept={ACCEPTED_EXTENSIONS.join(',')}
              beforeUpload={handleJdUpload}
              showUploadList={false}
              disabled={parsing || actionLoading}
              className="jd-upload"
            >
              <div className="jd-upload-content">
                {parsing ? (
                  <>
                    <LoadingOutlined className="jd-upload-icon active" />
                    <Title level={5} style={{ margin: '12px 0 4px' }}>
                      Parsing job description...
                    </Title>
                    <Text type="secondary">The form will be filled when the API returns JSON.</Text>
                  </>
                ) : parsedFileName ? (
                  <>
                    <CheckCircleOutlined className="jd-upload-icon success" />
                    <Title level={5} style={{ margin: '12px 0 4px' }}>
                      JD Parsed
                    </Title>
                    <Text type="secondary">{parsedFileName}</Text>
                  </>
                ) : (
                  <>
                    <InboxOutlined className="jd-upload-icon" />
                    <Title level={5} style={{ margin: '12px 0 4px' }}>
                      Upload job description
                    </Title>
                    <Text type="secondary">PDF, DOC, or DOCX files are supported.</Text>
                  </>
                )}
              </div>
            </Dragger>

            {parsedFileName && (
              <Alert
                type="success"
                showIcon
                icon={<FileTextOutlined />}
                message="Parsed JSON has been mapped into the form. You can edit any field before creating the job."
                className="job-form-alert"
              />
            )}

            {parseError && (
              <Alert
                type="error"
                showIcon
                message={parseError}
                className="job-form-alert"
              />
            )}

            <ParsedJdPreview data={parsedJd} />

            <Divider />
          </>
        )}

        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
                <Input placeholder="e.g. Senior Backend Developer" />
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                <Input placeholder="e.g. Pune, India or Remote" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={5} placeholder="Describe responsibilities and requirements..." />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="jobType" label="Job Type" rules={[{ required: true }]}>
                <Select placeholder="Select type">
                  {JOB_TYPE_OPTIONS.map((opt) => (
                    <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="experienceRequired" label="Experience (yrs)" rules={[{ required: true }]}>
                <InputNumber min={0} max={30} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="salaryRange" label="Salary Range">
                <Input placeholder="e.g. 5-8 LPA" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="requiredSkills" label="Required Skills" rules={[{ required: true }]}>
            <Select mode="tags" placeholder="Add skills and press Enter" />
          </Form.Item>

          <Row gutter={16} align="middle">
            <Col xs={24} md={8}>
              <Form.Item
                name="coverLetterRequired"
                label="Cover Letter Required?"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="isActive"
                label="Publish as Active?"
                valuePropName="checked"
                initialValue
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="jdParsed" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="rawJdText" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="modelUsed" hidden>
            <Input />
          </Form.Item>

          <div className="job-form-actions">
            <Space>
              <Button onClick={onClose} disabled={actionLoading || parsing}>
                Cancel
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={actionLoading}
                disabled={parsing}
                onClick={() => form.submit()}
              >
                {job ? 'Update Job' : 'Create Job'}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default JobForm
