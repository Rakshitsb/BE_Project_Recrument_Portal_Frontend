import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Col, Form, Input, Row, Select } from 'antd'
import AvatarUpload from '../ui/AvatarUpload'

const INDUSTRY_OPTIONS = [
  'IT & Software', 'Finance & Banking', 'Healthcare',
  'E-Commerce', 'Education', 'Manufacturing',
  'Media & Entertainment', 'Other',
].map((v) => ({ value: v, label: v }))

const COMPANY_SIZE_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '500+'].map(
  (v) => ({ value: v, label: v }),
)

/**
 * HRProfileEditForm
 * Two-column editable form for HR personal and company info.
 * Exposes `{ submit }` via ref so the parent can trigger submission.
 *
 * @param {object}   props
 * @param {object}   props.profile  - Initial field values
 * @param {Function} props.onSave   - Called with updated form values on submit
 * @param {object}   ref            - Forwarded ref; exposes { submit }
 */
export const HRProfileEditForm = forwardRef(function HRProfileEditForm(
  { profile, onSave, onAvatarUpload, avatarUploading, avatarProgress },
  ref,
) {
  const [form] = Form.useForm()

  // Expose submit to parent via ref
  useImperativeHandle(ref, () => ({ submit: () => form.submit() }))

  // Sync initial values whenever profile changes
  useEffect(() => {
    form.setFieldsValue(profile)
  }, [form, profile])

  return (
    <Form form={form} layout="vertical" onFinish={onSave}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <AvatarUpload
          avatarUrl={profile?.avatarUrl || profile?.avatar_url}
          onUpload={onAvatarUpload}
          uploading={avatarUploading}
          progress={avatarProgress}
        />
      </div>
      <Row gutter={16}>

        {/* ── Left column ─────────────────────────────────────── */}
        <Col xs={24} md={12}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Your full name" />
          </Form.Item>

          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="+91 XXXXX XXXXX" />
          </Form.Item>

          <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
            <Input placeholder="e.g. Senior HR Manager" />
          </Form.Item>

          <Form.Item
            name="companyWebsite"
            label="Company Website"
            rules={[{ type: 'url', message: 'Enter a valid URL' }]}
          >
            <Input placeholder="https://yourcompany.com" />
          </Form.Item>
        </Col>

        {/* ── Right column ────────────────────────────────────── */}
        <Col xs={24} md={12}>
          <Form.Item name="company" label="Company Name" rules={[{ required: true }]}>
            <Input placeholder="Company name" />
          </Form.Item>

          <Form.Item name="companyLocation" label="Company Location" rules={[{ required: true }]}>
            <Input placeholder="City, State" />
          </Form.Item>

          <Form.Item name="industry" label="Industry" rules={[{ required: true }]}>
            <Select placeholder="Select industry" options={INDUSTRY_OPTIONS} />
          </Form.Item>

          <Form.Item name="companySize" label="Company Size" rules={[{ required: true }]}>
            <Select placeholder="Select company size" options={COMPANY_SIZE_OPTIONS} />
          </Form.Item>
        </Col>

      </Row>
    </Form>
  )
})
