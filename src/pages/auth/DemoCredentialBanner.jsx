import { Typography } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

/**
 * Demo accounts available for quick-fill in the login form.
 * Each entry maps to a mock user in useAuth.js.
 */
const DEMO_ACCOUNTS = [
  { label: '👤 Candidate', email: 'candidate@demo.com', color: '#1677ff', bg: '#e6f4ff' },
  { label: '🧑‍💼 HR',        email: 'hr@demo.com',        color: '#722ed1', bg: '#f9f0ff' },
  { label: '🛡️ Admin',     email: 'admin@demo.com',     color: '#d4380d', bg: '#fff2e8' },
]

/**
 * DemoCredentialBanner
 * Shows quick-fill buttons for each demo account role.
 * Extracted to keep LoginPage under 150 lines.
 *
 * @param {object}   props
 * @param {Function} props.onFill - Called with the demo email to auto-fill
 */
export function DemoCredentialBanner({ onFill }) {
  return (
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
            onClick={() => onFill(acc.email)}
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
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.7)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
          >
            {acc.label}
          </button>
        ))}
      </div>

      <Text style={{ fontSize: 11, color: '#8c6914', display: 'block', marginTop: 6 }}>
        Password: <strong>demo1234</strong>
      </Text>
    </div>
  )
}
