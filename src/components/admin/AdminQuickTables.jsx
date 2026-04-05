import { Card, Tabs, Tag, Space } from 'antd'
import { UserOutlined, IdcardOutlined } from '@ant-design/icons'

import { DataTable } from '../ui/DataTable'

/**
 * Renders up to 2 skill tags and a "+N more" overflow tag.
 */
function SkillsCell({ skills }) {
  const visible  = skills.slice(0, 2)
  const overflow = skills.length - 2

  return (
    <Space size={4} wrap>
      {visible.map((s) => <Tag key={s} color="blue">{s}</Tag>)}
      {overflow > 0 && <Tag>+{overflow} more</Tag>}
    </Space>
  )
}

const CANDIDATE_COLUMNS = [
  { title: 'Name',     dataIndex: 'name',       key: 'name' },
  { title: 'Location', dataIndex: 'location',   key: 'location' },
  { title: 'Joined',   dataIndex: 'joinedDate', key: 'joinedDate' },
  {
    title: 'Skills',
    dataIndex: 'skills',
    key: 'skills',
    render: (skills) => <SkillsCell skills={skills} />,
  },
]

const HR_COLUMNS = [
  { title: 'Name',        dataIndex: 'name',        key: 'name' },
  { title: 'Company',     dataIndex: 'company',     key: 'company' },
  { title: 'Designation', dataIndex: 'designation', key: 'designation' },
  { title: 'Joined',      dataIndex: 'joinedDate',  key: 'joinedDate' },
]

/**
 * AdminQuickTables
 * Tabbed card showing recent candidates and HR users for the Admin Dashboard.
 * Read-only view — no action columns.
 *
 * @param {object} props
 * @param {Array}  props.candidates - Recent candidate records
 * @param {Array}  props.hrUsers    - Recent HR user records
 */
export function AdminQuickTables({ candidates, hrUsers }) {
  const tabItems = [
    {
      key: 'candidates',
      label: (
        <span><UserOutlined style={{ marginRight: 6 }} />Recent Candidates</span>
      ),
      children: (
        <DataTable
          columns={CANDIDATE_COLUMNS}
          dataSource={candidates}
          loading={false}
          emptyText="No candidates yet"
          extraProps={{ pagination: false }}
        />
      ),
    },
    {
      key: 'hrUsers',
      label: (
        <span><IdcardOutlined style={{ marginRight: 6 }} />Recent HR Users</span>
      ),
      children: (
        <DataTable
          columns={HR_COLUMNS}
          dataSource={hrUsers}
          loading={false}
          emptyText="No HR users yet"
          extraProps={{ pagination: false }}
        />
      ),
    },
  ]

  return (
    <Card>
      <Tabs items={tabItems} />
    </Card>
  )
}
