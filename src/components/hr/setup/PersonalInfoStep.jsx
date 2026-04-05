import { Form, Input } from 'antd'

/**
 * PersonalInfoStep
 * Step 0 of HRProfileSetup — collects the HR user's personal details.
 * No submit button; parent controls validation and navigation.
 *
 * @param {object} props
 * @param {object} props.form - Ant Design form instance from parent (Form.useForm)
 */
export function PersonalInfoStep({ form }) {
  return (
    <Form form={form} layout="vertical" size="large">

      <Form.Item
        name="fullName"
        label="Full Name"
        rules={[
          { required: true, message: 'Please enter your full name' },
          { min: 2, message: 'Name must be at least 2 characters' },
        ]}
      >
        <Input placeholder="Your full name" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[{ required: true, message: 'Please enter your phone number' }]}
      >
        <Input placeholder="+91 98765 43210" />
      </Form.Item>

      <Form.Item
        name="designation"
        label="Designation"
        rules={[{ required: true, message: 'Please enter your designation' }]}
      >
        <Input placeholder="e.g. HR Manager, Talent Acquisition Lead" />
      </Form.Item>

    </Form>
  )
}
