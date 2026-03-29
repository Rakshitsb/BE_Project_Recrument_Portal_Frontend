import { Tag } from 'antd'

function TagBadge({ label }) {
  return (
    <Tag
      bordered={false}
      className="rounded-full px-2 py-1 text-sm"
      style={{ background: '#f0f5ff', color: '#1d39c4' }}
    >
      {label}
    </Tag>
  )
}

export default TagBadge
