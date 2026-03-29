import { Card, Typography } from 'antd'

const { Title, Text } = Typography

/**
 * StatCard
 * A reusable dashboard statistic card component.
 *
 * @param {object}  props
 * @param {string}  props.title       - Metric label
 * @param {string|number} props.value - Metric value
 * @param {ReactNode} props.icon      - Icon element
 * @param {string}  props.color       - Accent color (hex)
 * @param {string}  [props.trend]     - Optional trend text
 */
function StatCard({ title, value, icon, color = '#1890ff', trend }) {
  return (
    <Card
      className="stat-card card-shadow fade-in-up"
      bodyStyle={{ padding: 0 }}
    >
      <div className="stat-card" style={{ padding: '20px 24px' }}>
        <div
          className="stat-icon"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {icon}
        </div>
        <div className="stat-info">
          <Title level={3} style={{ margin: 0, color }}>
            {value}
          </Title>
          <Text type="secondary">{title}</Text>
          {trend && (
            <Text style={{ display: 'block', fontSize: 12, marginTop: 4, color }}>
              {trend}
            </Text>
          )}
        </div>
      </div>
    </Card>
  )
}

export default StatCard
