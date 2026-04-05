import { useState, useEffect } from 'react'
import { Avatar, Button, Input, Space, Typography } from 'antd'
import { UserOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'

import { DataTable }   from '../ui/DataTable'
import { StatusBadge } from '../ui/StatusBadge'

const { Text } = Typography

/**
 * CandidateTable
 * Searchable table of candidate users with view and delete actions.
 *
 * @param {object}   props
 * @param {Array}    props.candidates - Full candidate list
 * @param {Function} props.onView     - Called with a candidate object
 * @param {Function} props.onDelete   - Called with a candidate object
 */
export function CandidateTable({ candidates, onView, onDelete }) {
  const [searchText, setSearchText] = useState('')
  const [filtered, setFiltered]     = useState(candidates)

  // ── Sync filtered list when source or search changes ─────────────────────
  useEffect(() => {
    const q = searchText.toLowerCase()
    setFiltered(
      q
        ? candidates.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.email.toLowerCase().includes(q),
          )
        : candidates,
    )
  }, [candidates, searchText])

  // ── Column definitions ────────────────────────────────────────────────────
  const columns = [
    {
      title:     'Name',
      dataIndex: 'name',
      key:       'name',
      render: (name) => (
        <Space size={8}>
          <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
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
      title:     'Location',
      dataIndex: 'location',
      key:       'location',
    },
    {
      title:     'Experience',
      dataIndex: 'experienceYears',
      key:       'experienceYears',
      align:     'center',
      render:    (yrs) => `${yrs} yrs`,
    },
    {
      title:     'Applications',
      dataIndex: 'totalApplications',
      key:       'totalApplications',
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
          placeholder="Search candidates by name or email"
          style={{ width: 280 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <DataTable
        columns={columns}
        dataSource={filtered}
        emptyText="No candidates found"
      />
    </div>
  )
}
