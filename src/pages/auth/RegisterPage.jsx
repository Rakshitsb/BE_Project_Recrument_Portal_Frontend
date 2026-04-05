import { Form, Input, Button, Select, Divider, Typography } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const { Title, Text } = Typography
const { Option } = Select

function RegisterPage() {
  const { register, loading } = useAuth()
  const [form] = Form.useForm()

  const onFinish = (values) => register(values)

  return (
    <div className="auth-card fade-in-up">
      <div className="auth-logo">
        <div style={{ fontSize: 48 }}>✨</div>
        <Title level={2} style={{ margin: '8px 0 0' }}>Join HireBase</Title>
        <Text type="secondary">Create your account to get started</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        size="large"
        disabled={loading}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="you@example.com" />
        </Form.Item>

        <Form.Item
          name="role"
          label="I am a"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select your role">
            <Option value="candidate">Job Seeker / Candidate</Option>
            <Option value="hr">HR / Recruiter</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 8, message: 'Minimum 8 characters' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Min. 8 characters" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Passwords do not match'))
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Repeat password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ height: 44, fontWeight: 600 }}
          >
            Create Account
          </Button>
        </Form.Item>
      </Form>

      <Divider plain>
        <Text type="secondary" style={{ fontSize: 13 }}>Already have an account?</Text>
      </Divider>

      <div style={{ textAlign: 'center' }}>
        <Link to="/login">
          <Button block style={{ height: 40 }}>Sign In</Button>
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage
