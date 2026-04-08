import { useEffect } from 'react'
import {
  Drawer, Form, Input, Select, InputNumber, Switch, Button, Space,
} from 'antd'

const { TextArea } = Input

const JOB_TYPE_OPTIONS = ['Full-Time', 'Part-Time', 'Contract', 'Remote']

/**
 * JobForm
 * Drawer form for creating or editing a job listing.
 * Switches between "Post New Job" and "Edit Job" mode based on the `job` prop.
 *
 * @param {object}        props
 * @param {boolean}       props.open          - Controls drawer visibility
 * @param {object|null}   props.job           - Null for create mode; job object for edit mode
 * @param {Function}      props.onClose       - Called when the drawer should close
 * @param {Function}      props.onSave        - Called with form values on successful submit
 * @param {boolean}       props.actionLoading - Shows loading on Save button during API call
 */
export function JobForm({ open, job, onClose, onSave, actionLoading = false }) {
  const [form] = Form.useForm()

  // ── Sync form fields when drawer opens or job changes ────────────
  useEffect(() => {
    if (open) {
      job ? form.setFieldsValue(job) : form.resetFields()
    }
  }, [open, job])

  const handleFinish = (values) => {
    onSave(values)
    // Drawer is closed by the parent (handleSave) after the API call succeeds
  }

  const drawerFooter = (
    <Space className="flex justify-end">
      <Button onClick={onClose} disabled={actionLoading}>Cancel</Button>
      <Button
        type="primary"
        loading={actionLoading}
        disabled={actionLoading}
        onClick={() => form.submit()}
      >
        Save
      </Button>
    </Space>
  )

  return (
    <Drawer
      title={job ? 'Edit Job' : 'Post New Job'}
      open={open}
      onClose={onClose}
      width={520}
      placement="right"
      footer={drawerFooter}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>

        <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
          <Input placeholder="e.g. Senior Backend Developer" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TextArea rows={3} placeholder="Describe responsibilities and requirements..." />
        </Form.Item>

        <Form.Item name="location" label="Location" rules={[{ required: true }]}>
          <Input placeholder="e.g. Pune, India or Remote" />
        </Form.Item>

        <Form.Item name="jobType" label="Job Type" rules={[{ required: true }]}>
          <Select placeholder="Select type">
            {JOB_TYPE_OPTIONS.map((opt) => (
              <Select.Option key={opt} value={opt}>{opt}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="experienceRequired" label="Experience (yrs)" rules={[{ required: true }]}>
          <InputNumber min={0} max={30} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="salaryRange" label="Salary Range">
          <Input placeholder="e.g. 5-8 LPA" />
        </Form.Item>

        <Form.Item name="requiredSkills" label="Required Skills" rules={[{ required: true }]}>
          <Select mode="tags" placeholder="Add skills and press Enter" />
        </Form.Item>

        <Form.Item
          name="coverLetterRequired"
          label="Cover Letter Required?"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

      </Form>
    </Drawer>
  )
}
