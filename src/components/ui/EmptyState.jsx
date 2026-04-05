import { Typography } from 'antd'

const { Text } = Typography

/**
 * EmptyState
 * A centered placeholder shown when a list or table has no data.
 * Supports an optional icon, a descriptive message, and an action element.
 *
 * @param {object}    props
 * @param {ReactNode} [props.icon]    - Optional icon rendered at 48px font-size
 * @param {string}    props.message  - Descriptive text shown below the icon
 * @param {ReactNode} [props.action] - Optional action element (e.g. a Button)
 */
export function EmptyState({ icon, message, action }) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: 200 }}
    >
      {icon && (
        <span
          className="flex items-center justify-center"
          style={{ fontSize: 48, marginBottom: 12, opacity: 0.45 }}
        >
          {icon}
        </span>
      )}

      <Text type="secondary">{message}</Text>

      {action && (
        <div style={{ marginTop: 12 }}>
          {action}
        </div>
      )}
    </div>
  )
}
