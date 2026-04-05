import { Card, Typography, theme } from 'antd'

const { Title, Text } = Typography
const { useToken } = theme

/**
 * StatCard
 * Dashboard statistic card with icon, value, title, and optional trend indicator.
 *
 * @param {object}         props
 * @param {string}         props.title          - Metric label displayed below the value
 * @param {string|number}  props.value          - Primary metric value (large bold text)
 * @param {ReactNode}      props.icon           - Icon element rendered in colored square
 * @param {'blue'|'green'|'purple'|'orange'} props.color - Accent color key
 * @param {{ value: number, up: boolean }} [props.trend] - Optional trend indicator
 */
export function StatCard({ title, value, icon, color = 'blue', trend }) {
  const { token } = useToken()

  const colorMap = {
    blue:   { bg: token.colorPrimaryBg,   fg: token.colorPrimary },
    green:  { bg: token.colorSuccessBg,   fg: token.colorSuccess },
    purple: { bg: token.colorInfoBg,      fg: token.colorInfo },
    orange: { bg: token.colorWarningBg,   fg: token.colorWarning },
  }

  const { bg, fg } = colorMap[color] ?? colorMap.blue

  return (
    <Card hoverable className="fade-in-up">
      <div className="flex items-start gap-4">

        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 44, height: 44, backgroundColor: bg, color: fg, fontSize: 20 }}
        >
          {icon}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <Title level={3} style={{ margin: 0, color: fg }}>
            {value}
          </Title>

          <Text type="secondary" className="text-sm">
            {title}
          </Text>

          {trend && (
            <Text
              style={{ fontSize: 12, marginTop: 4, color: trend.up ? token.colorSuccess : token.colorError }}
            >
              {trend.up ? '↑' : '↓'} {Math.abs(trend.value)}%
            </Text>
          )}
        </div>

      </div>
    </Card>
  )
}
