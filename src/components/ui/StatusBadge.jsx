import { Tag } from 'antd'

/**
 * Color mapping for known recruitment status values.
 * Unknown statuses fall back to 'default'.
 */
const STATUS_COLOR_MAP = {
  applied:       'blue',
  under_review:  'orange',
  shortlisted:   'cyan',
  interview:     'purple',
  selected:      'green',
  rejected:      'red',
  active:        'green',
  inactive:      'default',
}

/**
 * StatusBadge
 * Renders a color-coded Ant Design Tag for recruitment-related statuses.
 *
 * @param {object} props
 * @param {string} props.status - Status key (e.g. 'applied', 'under_review', 'selected')
 */
export function StatusBadge({ status }) {
  const color = STATUS_COLOR_MAP[status] ?? 'default'

  const label = status
    ? status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Unknown'

  return <Tag color={color}>{label}</Tag>
}
