import { useCallback, useEffect, useMemo, useState } from 'react'
import { App } from 'antd'

import useApiCall from './useApiCall'
import { jobService, applicationService } from '../services'

export function useApplications() {
  const { message } = App.useApp()
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedApp, setSelectedApp] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)

  const { execute: fetchJobs, loading: jobsLoading, error: jobsError } =
    useApiCall(jobService.getMyJobs)
  const { execute: fetchApplications, loading: appsLoading, error: appsError } =
    useApiCall(applicationService.getJobApplications)
  const { execute: updateAppStatus } = useApiCall(applicationService.updateStatus)
  const { execute: fetchRankedCandidatesApi } = useApiCall(applicationService.getRankedCandidates)

  const loadJobs = useCallback(async () => {
    try {
      const result = await fetchJobs()
      if (result) {
        setJobs(result)
        if (Array.isArray(result) && result.length > 0) {
          setSelectedJobId((prev) => prev ?? result[0].id)
        }
      }
      return result
    } catch {
      return null
    }
  }, [fetchJobs])

  const loadApplications = useCallback(async (jobId) => {
    if (!jobId) {
      setApplications([])
      return null
    }
    try {
      const result = await fetchApplications(jobId)
      if (result) setApplications(result)
      return result
    } catch {
      return null
    }
  }, [fetchApplications])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  useEffect(() => {
    loadApplications(selectedJobId)
  }, [loadApplications, selectedJobId])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && selectedJobId) {
        loadApplications(selectedJobId)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [selectedJobId, loadApplications])

  const filteredApps = useMemo(
    () => applications.filter((app) => !selectedStatus || app.status === selectedStatus),
    [applications, selectedStatus],
  )

  const handleJobChange = (jobId) => {
    setSelectedJobId(jobId)
    setSelectedApp(null)
    setApplications([])
  }

  const handleView = (app) => {
    setSelectedApp(app)
    setDrawerOpen(true)
  }

  const handleStatusChange = async (appId, newStatus) => {
    const snapshot = [...applications]
    const previousStatus = snapshot.find((app) => app.id === appId)?.status
    setApplications((prev) => prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app)))
    setSelectedApp((prev) => (prev?.id === appId ? { ...prev, status: newStatus } : prev))

    try {
      setStatusUpdating(true)
      await updateAppStatus(appId, newStatus)
      message.success('Application status updated.')
    } catch {
      setApplications(snapshot)
      setSelectedApp((prev) => (prev?.id === appId ? { ...prev, status: previousStatus } : prev))
    } finally {
      setStatusUpdating(false)
    }
  }

  return {
    applications,
    jobs,
    filteredApps,
    jobsLoading,
    jobsError,
    appsLoading,
    appsError,
    statusUpdating,
    selectedJobId,
    selectedStatus,
    selectedApp,
    drawerOpen,
    setSelectedStatus,
    setDrawerOpen,
    handleJobChange,
    handleView,
    handleStatusChange,
    loadJobs,
    loadApplications,
    fetchRankedCandidatesApi,
  }
}

export default useApplications
