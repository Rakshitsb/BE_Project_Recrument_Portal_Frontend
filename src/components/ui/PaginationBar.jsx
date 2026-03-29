import { Pagination } from 'antd'

function PaginationBar({
  total,
  current,
  pageSize,
  onChange,
  disabled,
}) {
  return (
    <div className="flex justify-center py-4">
      <Pagination
        total={total}
        current={current}
        pageSize={pageSize}
        showSizeChanger={false}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  )
}

export default PaginationBar
