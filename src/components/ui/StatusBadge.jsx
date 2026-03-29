import { Tag } from 'antd'

const statusConfig = {
  pending:   { color: 'gold',    label: 'Pending' },
  reviewed:  { color: 'blue',    label: 'Reviewed' },
  interview: { color: 'purple',  label: 'Interview' },
  accepted:  { color: 'success', label: 'Accepted' },
  rejected:  { color: 'error',   label: 'Rejected' },
}

/**
 * StatusBadge
 * Renders a color-coded Ant Design Tag for application statuses.
 *
 * @param {{ status: string }} props
 */
function StatusBadge({ status }) {
  const config = statusConfig[status] || { color: 'default', label: status }
  return <Tag color={config.color}>{config.label}</Tag>
}

export default StatusBadge
