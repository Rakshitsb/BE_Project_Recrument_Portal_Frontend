import { Form, Input, Button, Checkbox, Divider, Typography } from 'antd'
import { MailOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const { Title, Text } = Typography

// Demo credential quick-fill options
const DEMO_ACCOUNTS = [
  { label: '👤 Candidate', email: 'candidate@demo.com', color: '#1890ff', bg: '#e6f4ff' },
  { label: '🧑‍💼 HR',        email: 'hr@demo.com',        color: '#722ed1', bg: '#f9f0ff' },
]

function LoginPage() {
  const { login, loading } = useAuth()
  const [form] = Form.useForm()

  const onFinish = (values) => login(values)

  const fillDemo = (email) => {
    form.setFieldsValue({ email, password: 'demo1234' })
  }

  return (
    <div className="auth-card fade-in-up">
      <div className="auth-logo">
        <div style={{ fontSize: 48 }}>🚀</div>
        <Title level={2} style={{ margin: '8px 0 0' }}>Welcome Back</Title>
        <Text type="secondary">Sign in to your HireBase account</Text>
      </div>

      {/* Demo hint banner */}
      <div
        style={{
          background: '#fffbe6',
          border: '1px solid #ffe58f',
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <InfoCircleOutlined style={{ color: '#d48806' }} />
          <Text style={{ fontSize: 12, fontWeight: 600, color: '#d48806' }}>
            Demo Mode — click to auto-fill credentials
          </Text>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => fillDemo(acc.email)}
              style={{
                flex: 1,
                padding: '6px 10px',
                border: `1px solid ${acc.color}`,
                borderRadius: 6,
                background: acc.bg,
                color: acc.color,
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.opacity = 0.75)}
              onMouseLeave={(e) => (e.target.style.opacity = 1)}
            >
              {acc.label}
            </button>
          ))}
        </div>
        <Text style={{ fontSize: 11, color: '#8c6914', display: 'block', marginTop: 6 }}>
          Password: <strong>demo1234</strong>
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        size="large"
      >
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
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Password is required' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Checkbox>Remember me</Checkbox>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ height: 44, fontWeight: 600 }}
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <Divider plain>
        <Text type="secondary" style={{ fontSize: 13 }}>New here?</Text>
      </Divider>

      <div style={{ textAlign: 'center' }}>
        <Link to="/register">
          <Button block style={{ height: 40 }}>Create an Account</Button>
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
