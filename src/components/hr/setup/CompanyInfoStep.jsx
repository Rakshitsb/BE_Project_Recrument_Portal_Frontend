import { Form, Input, Select } from 'antd'

const INDUSTRY_OPTIONS = [
  'IT & Software', 'Finance & Banking', 'Healthcare',
  'E-Commerce', 'Education', 'Manufacturing',
  'Media & Entertainment', 'Other',
]

const COMPANY_SIZE_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '500+']

/**
 * CompanyInfoStep
 * Step 1 of HRProfileSetup — collects company details.
 * No submit button; parent controls validation and navigation.
 *
 * @param {object} props
 * @param {object} props.form - Ant Design form instance from parent (Form.useForm)
 */
export function CompanyInfoStep({ form }) {
  return (
    <Form form={form} layout="vertical" size="large">

      <Form.Item
        name="companyName"
        label="Company Name"
        rules={[{ required: true, message: 'Please enter your company name' }]}
      >
        <Input placeholder="e.g. Infosys, Startup XYZ" />
      </Form.Item>

      <Form.Item
        name="companyLocation"
        label="Company Location"
        rules={[{ required: true, message: 'Please enter your company location' }]}
      >
        <Input placeholder="e.g. Pune, Maharashtra" />
      </Form.Item>

      <Form.Item
        name="industry"
        label="Industry"
        rules={[{ required: true, message: 'Please select an industry' }]}
      >
        <Select placeholder="Select industry">
          {INDUSTRY_OPTIONS.map((opt) => (
            <Select.Option key={opt} value={opt}>{opt}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="companySize"
        label="Company Size"
        rules={[{ required: true, message: 'Please select company size' }]}
      >
        <Select placeholder="Select company size">
          {COMPANY_SIZE_OPTIONS.map((opt) => (
            <Select.Option key={opt} value={opt}>{opt}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="companyWebsite"
        label="Company Website"
        rules={[{ type: 'url', message: 'Please enter a valid URL (e.g. https://...)' }]}
      >
        <Input placeholder="https://yourcompany.com" />
      </Form.Item>

    </Form>
  )
}
