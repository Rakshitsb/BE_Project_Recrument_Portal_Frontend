import { useCallback, useEffect, useMemo, useState } from 'react'
import useJobStore from '../store/jobStore'
import { fetchJobs } from '../services/jobService'

function useJobs() {
  const {
    jobs,
    total,
    page,
    pageSize,
    filters,
    setJobs,
    setTotal,
    setPage,
    setFilters,
  } = useJobStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadJobs = useCallback(
    async (activeFilters = filters, activePage = page) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetchJobs(activeFilters, activePage, pageSize)
        setJobs(response.data)
        setTotal(response.total)
      } catch (err) {
        setError(err?.message || 'Unable to load jobs right now')
      } finally {
        setLoading(false)
      }
    },
    [filters, page, pageSize, setJobs, setTotal]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobs(filters, page)
    }, 350)
    return () => clearTimeout(timer)
  }, [filters, page, loadJobs])

  const handleFiltersChange = useCallback(
    (partial) => {
      setFilters(partial)
    },
    [setFilters]
  )

  const handlePageChange = useCallback(
    (nextPage) => {
      setPage(nextPage)
    },
    [setPage]
  )

  const meta = useMemo(
    () => ({
      total,
      page,
      pageSize,
      filters,
    }),
    [filters, page, pageSize, total]
  )

  return {
    jobs,
    loading,
    error,
    meta,
    setFilters: handleFiltersChange,
    setPage: handlePageChange,
    refresh: () => loadJobs(filters, page),
  }
}

export default useJobs
