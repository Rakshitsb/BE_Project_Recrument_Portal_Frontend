import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, App as AntApp } from 'antd'
import AppRoutes from './routes/AppRoutes'

const antTheme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
}

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={antTheme}>
        <AntApp>
          <AppRoutes />
        </AntApp>
      </ConfigProvider>
    </BrowserRouter>
  )
}

export default App
