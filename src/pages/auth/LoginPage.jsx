import { Form, Input, Button, Checkbox, Divider, Typography } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const { Title, Text } = Typography


function LoginPage() {
  const { login, loading } = useAuth()
  const [form] = Form.useForm()

  const onFinish = (values) => login(values)

  return (
    <div className="auth-card fade-in-up">
      <div className="auth-logo">
        <div style={{ fontSize: 48 }}>🚀</div>
        <Title level={2} style={{ margin: '8px 0 0' }}>Welcome Back</Title>
        <Text type="secondary">Sign in to your HireBase account</Text>
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
