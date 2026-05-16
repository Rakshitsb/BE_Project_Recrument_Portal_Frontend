import { useState, useEffect } from 'react'
import { Avatar, Button, Input, Space, Typography } from 'antd'
import { IdcardOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'

import { DataTable }   from '../ui/DataTable'
import { StatusBadge } from '../ui/StatusBadge'

const { Text } = Typography

/**
 * HRTable
 * Searchable table of HR users with view and delete actions.
 *
 * @param {object}   props
 * @param {Array}    props.hrUsers  - Full HR user list
 * @param {Function} props.onView   - Called with an HR user object
 * @param {Function} props.onDelete - Called with an HR user object
 */
export function HRTable({ hrUsers, onView, onDelete }) {
  const [searchText, setSearchText] = useState('')
  const [filtered, setFiltered]     = useState(hrUsers)

  // ── Sync filtered list when source or search changes ─────────────────────
  useEffect(() => {
    const q = searchText.toLowerCase()
    setFiltered(
      q
        ? hrUsers.filter(
            (u) =>
              u.name.toLowerCase().includes(q) ||
              u.company.toLowerCase().includes(q),
          )
        : hrUsers,
    )
  }, [hrUsers, searchText])

  // ── Column definitions ────────────────────────────────────────────────────
  const columns = [
    {
      title:     'Name',
      dataIndex: 'name',
      key:       'name',
      render: (name, record) => (
        <Space size={8}>
          <Avatar
            size="small"
            src={record.avatarUrl || undefined}
            icon={<IdcardOutlined />}
            style={{ backgroundColor: '#722ed1' }}
          />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title:     'Email',
      dataIndex: 'email',
      key:       'email',
    },
    {
      title:     'Company',
      dataIndex: 'company',
      key:       'company',
    },
    {
      title:     'Designation',
      dataIndex: 'designation',
      key:       'designation',
    },
    {
      title:     'Jobs Posted',
      dataIndex: 'totalJobsPosted',
      key:       'totalJobsPosted',
      align:     'center',
    },
    {
      title:  'Status',
      key:    'status',
      render: (_, record) => <StatusBadge status={record.status} />,
    },
    {
      title:  'Actions',
      key:    'actions',
      render: (_, record) => (
        <Space size={4}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search HR users by name or company"
          style={{ width: 280 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <DataTable
        columns={columns}
        dataSource={filtered}
        emptyText="No HR users found"
      />
    </div>
  )
}
