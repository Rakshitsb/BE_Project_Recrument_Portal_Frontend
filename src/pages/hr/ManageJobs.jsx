import { useState } from 'react'
import {
  Table, Button, Tag, Space, Typography, Modal, Form, Input, Select, Row, Col,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

const initialJobs = [
  { id: 1, title: 'Senior React Developer', department: 'Engineering', location: 'Remote',        type: 'Full-time', status: 'active',  applicants: 34, posted: '2026-03-15' },
  { id: 2, title: 'Backend Engineer',       department: 'Engineering', location: 'New York, NY',  type: 'Full-time', status: 'active',  applicants: 21, posted: '2026-03-17' },
  { id: 3, title: 'UI/UX Designer',         department: 'Design',      location: 'San Francisco', type: 'Contract',  status: 'paused',  applicants: 18, posted: '2026-03-10' },
  { id: 4, title: 'DevOps Engineer',        department: 'Engineering', location: 'Remote',        type: 'Full-time', status: 'active',  applicants: 12, posted: '2026-03-20' },
  { id: 5, title: 'Product Manager',        department: 'Product',     location: 'Austin, TX',    type: 'Full-time', status: 'closed',  applicants: 58, posted: '2026-03-01' },
]

const statusColor = { active: 'success', paused: 'warning', closed: 'error' }

function ManageJobs() {
  const [jobs, setJobs]           = useState(initialJobs)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const handleCreate = (values) => {
    const newJob = {
      id: Date.now(),
      applicants: 0,
      posted: new Date().toISOString().split('T')[0],
      status: 'active',
      ...values,
    }
    setJobs((prev) => [newJob, ...prev])
    setModalOpen(false)
    form.resetFields()
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete this job?',
      content: 'This action cannot be undone.',
      okType: 'danger',
      onOk: () => setJobs((prev) => prev.filter((j) => j.id !== id)),
    })
  }

  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 13 }}>{record.department}</Text>
        </div>
      ),
    },
    { title: 'Location',   dataIndex: 'location',   key: 'location' },
    { title: 'Type',       dataIndex: 'type',        key: 'type',        render: (t) => <Tag>{t}</Tag> },
    { title: 'Applicants', dataIndex: 'applicants',  key: 'applicants' },
    { title: 'Posted',     dataIndex: 'posted',      key: 'posted' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s) => <Tag color={statusColor[s]}>{s}</Tag>,
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />}    size="small" />
          <Button type="text" icon={<EditOutlined />}   size="small" />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div className="fade-in-up">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>Manage Jobs</Title>
          <Text type="secondary">{jobs.length} job postings</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Post a Job
        </Button>
      </div>

      <Table dataSource={jobs} columns={columns} rowKey="id" className="card-shadow" />

      {/* Create Job Modal */}
      <Modal
        title="Post a New Job"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Post Job"
        width={560}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Senior React Developer" />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Input placeholder="e.g. Engineering" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                <Input placeholder="e.g. Remote" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Employment Type" rules={[{ required: true }]}>
                <Select placeholder="Select type">
                  <Option value="Full-time">Full-time</Option>
                  <Option value="Part-time">Part-time</Option>
                  <Option value="Contract">Contract</Option>
                  <Option value="Internship">Internship</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Job Description">
            <TextArea rows={4} placeholder="Describe responsibilities and requirements..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ManageJobs
