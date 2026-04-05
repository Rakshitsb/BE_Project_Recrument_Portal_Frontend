import { Table } from 'antd'
import { EmptyState } from './EmptyState'

/**
 * DataTable
 * Thin, opinionated wrapper around Ant Design Table with built-in empty state,
 * sensible pagination defaults, and support for extra Table props via spread.
 *
 * @param {object}   props
 * @param {Array}    props.columns      - Ant Design column definitions
 * @param {Array}    props.dataSource   - Table row data (each row must have an `id` field)
 * @param {boolean}  props.loading      - Shows loading skeleton when true
 * @param {string}   [props.emptyText]  - Custom empty state message (default: 'No data found')
 * @param {object}   [props.extraProps] - Any additional Ant Design Table props
 */
export function DataTable({
  columns,
  dataSource,
  loading = false,
  emptyText = 'No data found',
  extraProps = {},
}) {
  const isEmpty = !loading && (!dataSource || dataSource.length === 0)

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey="id"
      size="middle"
      pagination={{ pageSize: 8, showSizeChanger: false }}
      locale={{
        emptyText: isEmpty ? (
          <EmptyState message={emptyText} />
        ) : undefined,
      }}
      {...extraProps}
    />
  )
}

export default DataTable
