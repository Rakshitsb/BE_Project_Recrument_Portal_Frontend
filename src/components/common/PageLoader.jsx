import { Spin } from 'antd'

/**
 * PageLoader
 * Full-page centered loading spinner.
 */
function PageLoader({ tip = 'Loading...' }) {
  return (
    <div
      className="flex-center"
      style={{ minHeight: '60vh', flexDirection: 'column', gap: 16 }}
    >
      <Spin size="large" />
      <span style={{ color: '#8c8c8c' }}>{tip}</span>
    </div>
  )
}

export default PageLoader
