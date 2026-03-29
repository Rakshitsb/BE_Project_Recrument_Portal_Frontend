import { useMemo, useState } from 'react'
import {
  Typography,
  Select,
  Result,
  Skeleton,
  Empty,
  Segmented,
  Button,
} from 'antd'
import {
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import SearchBar from '../../components/ui/SearchBar'
import FilterSidebar from '../../components/ui/FilterSidebar'
import JobCard from '../../components/ui/JobCard'
import PaginationBar from '../../components/ui/PaginationBar'
import useJobs from '../../hooks/useJobs'

const { Text } = Typography

const FILTER_OPTIONS = {
  industries: ['Technology', 'Fintech', 'Healthcare', 'Blockchain', 'AI', 'Security', 'Logistics', 'Media', 'SaaS'],
  sizes: ['11-50', '51-200', '201-500', '501-1000', '1001-5000'],
  categories: ['Engineering', 'Design', 'Data', 'Marketing', 'Operations', 'People', 'Product', 'Customer'],
  tags: ['React', 'TypeScript', 'GraphQL', 'Figma', 'Python', 'ML', 'SQL', 'Solidity', 'AWS', 'Kubernetes', 'AI', 'HR', 'Analytics'],
}

const LOCATION_OPTIONS = ['Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Chicago, IL', 'Boston, MA']

function Jobs() {
  const { jobs, loading, error, meta, setFilters, setPage, refresh } = useJobs()
  const [view, setView] = useState('grid')

  const sortValue = meta.filters.sort

  const resultSummary = useMemo(
    () => `${meta.total} roles • ${meta.filters.location || 'Anywhere'}`,
    [meta.filters.location, meta.total]
  )

  const handleSortChange = (value) => setFilters({ sort: value })

  const gridCols = view === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'

  return (
    <div className="space-y-4">
      <SearchBar
        searchTerm={meta.filters.searchTerm}
        location={meta.filters.location}
        onSearchChange={(val) => setFilters({ searchTerm: val })}
        onLocationChange={(val) => setFilters({ location: val })}
        onSubmit={refresh}
        loading={loading}
        locations={LOCATION_OPTIONS}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <Text strong className="text-lg">Explore roles</Text>
          <div className="text-gray-500 text-sm">{resultSummary}</div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={sortValue}
            onChange={handleSortChange}
            options={[
              { value: 'relevant', label: 'Most relevant' },
              { value: 'latest', label: 'Latest' },
            ]}
            className="w-44"
          />
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { label: <AppstoreOutlined />, value: 'grid' },
              { label: <UnorderedListOutlined />, value: 'list' },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={meta.filters}
            onFiltersChange={setFilters}
            options={FILTER_OPTIONS}
          />
        </div>

        <div className="lg:col-span-3">
          {error && (
            <Result
              status="error"
              title="Couldn’t load jobs"
              subTitle={error}
              extra={[
                <Button key="retry" type="primary" onClick={refresh}>
                  Try again
                </Button>,
              ]}
            />
          )}

          {!error && (
            <>
              {loading ? (
                <div className={`grid ${gridCols} gap-4`}>
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton active key={idx} paragraph={{ rows: 4 }} />
                  ))}
                </div>
              ) : jobs.length ? (
                <>
                  <div className={`grid ${gridCols} gap-4`}>
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                  <PaginationBar
                    total={meta.total}
                    current={meta.page}
                    pageSize={meta.pageSize}
                    onChange={setPage}
                  />
                </>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No roles match these filters yet"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Jobs
