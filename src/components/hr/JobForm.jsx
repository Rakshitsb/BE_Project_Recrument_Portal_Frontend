import { useCallback, useEffect, useState } from 'react'
import {
  Alert, Button, Card, Col, Collapse, Divider, Form, Input, InputNumber, Row, Select,
  Space, Switch, Typography, Upload, App,
} from 'antd'
import {
  CheckCircleOutlined, FileTextOutlined, InboxOutlined, LoadingOutlined,
  PlusOutlined, SaveOutlined, DeleteOutlined,
} from '@ant-design/icons'

import { jobService } from '../../services'

const { TextArea } = Input
const { Dragger } = Upload
const { Text, Title } = Typography

const JOB_TYPE_OPTIONS = ['Full-Time', 'Part-Time', 'Contract', 'Remote']
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx']

function cloneAndUpdate(value, path, updater) {
  if (path.length === 0) {
    return updater(value)
  }

  const [head, ...rest] = path

  if (Array.isArray(value)) {
    return value.map((item, index) => (
      index === head ? cloneAndUpdate(item, rest, updater) : item
    ))
  }

  return {
    ...value,
    [head]: cloneAndUpdate(value?.[head], rest, updater),
  }
}

function getValueAtPath(value, path) {
  return path.reduce((current, key) => current?.[key], value)
}

function createEmptyItem(sample) {
  if (Array.isArray(sample)) return []
  if (typeof sample === 'number') return 0
  if (typeof sample === 'boolean') return false
  if (typeof sample === 'string') return ''
  if (sample && typeof sample === 'object') {
    return Object.fromEntries(
      Object.entries(sample).map(([key, child]) => [key, createEmptyItem(child)]),
    )
  }
  return ''
}

function ParsedJdEditor({ data, onChange }) {
  if (!data) return null

  const updatePath = (path, nextValue) => {
    onChange(cloneAndUpdate(data, path, () => nextValue))
  }

  const removeArrayItem = (path, index) => {
    const current = getValueAtPath(data, path)
    if (!Array.isArray(current)) return
    updatePath(path, current.filter((_, itemIndex) => itemIndex !== index))
  }

  const addArrayItem = (path) => {
    const current = getValueAtPath(data, path)
    if (!Array.isArray(current)) return
    const sample = current[0]
    updatePath(path, [...current, createEmptyItem(sample)])
  }

  const renderNode = (value, path = [], label = 'Parsed JD JSON') => {
    if (Array.isArray(value)) {
      const isPrimitiveArray = value.every(
        (item) => item === null || ['string', 'number', 'boolean'].includes(typeof item),
      )

      return (
        <Card
          size="small"
          title={label}
          style={{ marginBottom: 12, borderRadius: 10 }}
          extra={(
            <Button
              size="small"
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => addArrayItem(path)}
            >
              Add Item
            </Button>
          )}
        >
          {value.length === 0 && (
            <Text type="secondary">No items yet.</Text>
          )}

          {isPrimitiveArray ? (
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              {value.map((item, index) => (
                <Space key={`${path.join('-')}-${index}`} style={{ width: '100%' }} align="start">
                  <Input
                    value={item ?? ''}
                    onChange={(event) => {
                      const nextItem =
                        typeof item === 'number'
                          ? Number(event.target.value || 0)
                          : event.target.value
                      updatePath([...path, index], nextItem)
                    }}
                  />
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => removeArrayItem(path, index)}
                  />
                </Space>
              ))}
            </Space>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {value.map((item, index) => (
                <Card
                  key={`${path.join('-')}-${index}`}
                  size="small"
                  title={`${label} ${index + 1}`}
                  extra={(
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => removeArrayItem(path, index)}
                    />
                  )}
                >
                  {renderNode(item, [...path, index], `${label} ${index + 1}`)}
                </Card>
              ))}
            </Space>
          )}
        </Card>
      )
    }

    if (value && typeof value === 'object') {
      return (
        <Card size="small" title={label} style={{ marginBottom: 12, borderRadius: 10 }}>
          {Object.entries(value).map(([childKey, childValue]) => (
            <div key={`${path.join('-')}-${childKey}`}>
              {renderNode(childValue, [...path, childKey], titleize(childKey))}
            </div>
          ))}
        </Card>
      )
    }

    if (typeof value === 'boolean') {
      return (
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>{label}</Text>
          <Switch checked={value} onChange={(checked) => updatePath(path, checked)} />
        </div>
      )
    }

    if (typeof value === 'number') {
      return (
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>{label}</Text>
          <InputNumber
            value={value}
            onChange={(nextValue) => updatePath(path, nextValue ?? 0)}
            style={{ width: '100%' }}
          />
        </div>
      )
    }

    const textValue = value ?? ''
    const multiline = String(textValue).length > 100 || String(textValue).includes('\n')

    return (
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>{label}</Text>
        {multiline ? (
          <TextArea
            rows={4}
            value={textValue}
            onChange={(event) => updatePath(path, event.target.value)}
          />
        ) : (
          <Input
            value={textValue}
            onChange={(event) => updatePath(path, event.target.value)}
          />
        )}
      </div>
    )
  }

  return (
    <Collapse
      defaultActiveKey={['parsed-jd-json']}
      className="job-form-alert"
      items={[
        {
          key: 'parsed-jd-json',
          label: 'Full Parsed JD JSON',
          children: (
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                Edit any parsed field here. The complete JSON will still be sent to the backend.
              </Text>
              {renderNode(data)}
            </div>
          ),
        },
      ]}
    />
  )
}

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

  const handleParsedJdChange = useCallback(
    (nextParsedJd) => {
      setParsedJd(nextParsedJd)
      form.setFieldValue('jdParsed', JSON.stringify(nextParsedJd))
    },
    [form],
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

            <ParsedJdEditor data={parsedJd} onChange={handleParsedJdChange} />

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
