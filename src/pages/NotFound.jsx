import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

/**
 * NotFound
 * Global 404 page shown when no route matches.
 * Provides navigation back to the app or to the login screen.
 */
export function NotFound() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you are looking for does not exist."
        extra={[
          <Button
            key="back"
            type="primary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>,
          <Button
            key="home"
            onClick={() => navigate('/login')}
          >
            Go Home
          </Button>,
        ]}
      />
    </div>
  )
}
