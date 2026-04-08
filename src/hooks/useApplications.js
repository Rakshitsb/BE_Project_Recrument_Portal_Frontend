import { useState, useEffect, useMemo } from 'react'
import { App } from 'antd'

import useApiCall                         from './useApiCall'
import { jobService, applicationService } from '../services'

/**
 * useApplications
 * Encapsulates all state and API logic for the Applications page.
 * Handles HR job list fetch, per-job application fetch, and optimistic
 * status updates with revert-on-failure.
 *
 * @returns {object} state, loading flags, handlers, and UI controls
 */
export function useApplications() {
  const { message } = App.useApp()

  const [applications,   setApplications]   = useState([])
  const [jobs,           setJobs]           = useState([])
  const [selectedJobId,  setSelectedJobId]  = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedApp,    setSelectedApp]    = useState(null)
  const [drawerOpen,     setDrawerOpen]     = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)

  // ── API hooks ─────────────────────────────────────────────────────
  const { execute: fetchJobs, loading: jobsLoading } =
    useApiCall(jobService.getMyJobs)

  const {
    execute: fetchApplications,
    loading: appsLoading,
    error:   appsError,
  } = useApiCall(applicationService.getJobApplications)

  const { execute: updateAppStatus } = useApiCall(applicationService.updateStatus)

  // ── Initial fetch: HR's own jobs for the filter dropdown ──────────
  useEffect(() => {
    fetchJobs().then((result) => { if (result) setJobs(result) })
  }, [])

  // ── Fetch applications when selected job changes ──────────────────
  useEffect(() => {
    if (!selectedJobId) { setApplications([]); return }
    fetchApplications(selectedJobId).then((r) => { if (r) setApplications(r) })
  }, [selectedJobId])

  // ── Derived: client-side status filter ───────────────────────────
  const filteredApps = useMemo(() =>
    applications.filter((app) => !selectedStatus || app.status === selectedStatus),
    [applications, selectedStatus],
  )

  // ── Handlers ─────────────────────────────────────────────────────
  const handleJobChange = (jobId) => {
    setSelectedJobId(jobId)
    setSelectedApp(null)
    setApplications([])
  }

  const handleView = (app) => { setSelectedApp(app); setDrawerOpen(true) }

  const handleStatusChange = async (appId, newStatus) => {
    const snapshot = [...applications]

    // Optimistic update
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    )
    setSelectedApp((prev) =>
      prev?.id === appId ? { ...prev, status: newStatus } : prev
    )

    try {
      setStatusUpdating(true)
      await updateAppStatus(appId, newStatus)
      message.success('Application status updated.')
    } catch {
      // Revert on failure
      setApplications(snapshot)
      setSelectedApp((prev) =>
        prev?.id === appId
          ? { ...prev, status: snapshot.find((a) => a.id === appId)?.status }
          : prev
      )
    } finally {
      setStatusUpdating(false)
    }
  }

  return {
    jobs, applications, filteredApps, setApplications,
    jobsLoading, appsLoading, appsError, statusUpdating,
    selectedJobId, selectedStatus, selectedApp, drawerOpen,
    setSelectedStatus, setDrawerOpen,
    handleJobChange, handleView, handleStatusChange,
    fetchApplications,
  }
}

export default useApplications
