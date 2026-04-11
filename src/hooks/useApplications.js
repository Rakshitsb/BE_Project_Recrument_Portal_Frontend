import { useCallback, useEffect, useState } from 'react'
import { App } from 'antd'
import applicationService from '../services/applicationService'

/**
 * Candidate applications hook
 * Fetches the current user's applications, handles withdraw flow,
 * and exposes loading / error state for the MyApplications page.
 */
function useApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [withdrawingId, setWithdrawingId] = useState(null)
  const [error, setError] = useState(null)
  const { message } = App.useApp()

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await applicationService.getMyApplications()
      setApplications(data ?? [])
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load applications'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const withdrawApplication = useCallback(
    async (applicationId) => {
      setWithdrawingId(applicationId)
      setError(null)
      try {
        await applicationService.withdrawApplication(applicationId)
        setApplications((list) => list.filter((app) => app.id !== applicationId))
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Could not withdraw application'
        setError((prev) => prev ?? msg)
        message.error(msg)
        throw err
      } finally {
        setWithdrawingId(null)
      }
    },
    [message],
  )

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  return {
    applications,
    loading,
    error,
    withdrawingId,
    fetchApplications,
    withdrawApplication,
  }
}

export default useApplications
