import { useState, useEffect } from 'react'
import { App } from 'antd'

import useApiCall   from './useApiCall'
import { jobService } from '../services'
import api          from '../services/api'

/**
 * useManageJobs
 * Encapsulates all state and API logic for the ManageJobs page.
 * Handles fetch, create, update, delete, and active-toggle operations.
 *
 * @returns {object} jobs state, loading flags, handlers, and UI state
 */
export function useManageJobs() {
  const { message } = App.useApp()

  const [jobs,         setJobs]         = useState([])
  const [drawerOpen,   setDrawerOpen]   = useState(false)
  const [editingJob,   setEditingJob]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [confirmOpen,  setConfirmOpen]  = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // ── API hooks ────────────────────────────────────────────────────
  const { execute: fetchJobs, loading: fetchLoading, error: fetchError } =
    useApiCall(jobService.getMyJobs)

  const { execute: createJob } = useApiCall(jobService.createJob)
  const { execute: updateJob } = useApiCall(jobService.updateJob)
  const { execute: deleteJob } = useApiCall(jobService.deleteJob)

  // ── Initial fetch ────────────────────────────────────────────────
  useEffect(() => {
    fetchJobs().then((result) => { if (result) setJobs(result) })
  }, [])

  // ── Handlers ─────────────────────────────────────────────────────
  const handleEdit   = (job) => { setEditingJob(job); setDrawerOpen(true) }
  const handleDelete = (job) => { setDeleteTarget(job); setConfirmOpen(true) }
  const handleCancelDelete = () => { setConfirmOpen(false); setDeleteTarget(null) }

  const handleSave = async (values) => {
    try {
      setActionLoading(true)

      if (editingJob) {
        const updated = await updateJob(editingJob.id, values)
        setJobs((prev) =>
          prev.map((j) =>
            j.id === editingJob.id
              ? { ...updated, applicants: j.applicants }
              : j
          )
        )
        setDrawerOpen(false)
        setEditingJob(null)
        message.success('Job updated successfully!')
      } else {
        const newJob = await createJob(values)
        setJobs((prev) => [{ ...newJob, applicants: 0 }, ...prev])
        setDrawerOpen(false)
        message.success('Job posted successfully!')
      }
    } catch {
      // error already shown by useApiCall
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleActive = async (jobId) => {
    const job = jobs.find((j) => j.id === jobId)
    if (!job) return

    // Optimistic update
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, isActive: !j.isActive } : j))
    )

    try {
      await api.put(`/jobs/${jobId}`, {
        title:                 job.title,
        description:           job.description,
        required_skills:       job.requiredSkills,
        location:              job.location,
        job_type:              job.jobType,
        experience_required:   job.experienceRequired,
        salary_range:          job.salaryRange || null,
        cover_letter_required: job.coverLetterRequired,
        is_active:             !job.isActive,
      })
      message.success(!job.isActive ? 'Job activated.' : 'Job deactivated.')
    } catch {
      // Revert on failure
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, isActive: job.isActive } : j))
      )
      message.error('Failed to update job status.')
    }
  }

  const handleConfirmDelete = async () => {
    const snapshot = [...jobs]
    setJobs((prev) => prev.filter((j) => j.id !== deleteTarget?.id))
    setConfirmOpen(false)

    try {
      setActionLoading(true)
      await deleteJob(deleteTarget.id)
      message.success('Job deleted successfully!')
      setDeleteTarget(null)
    } catch {
      setJobs(snapshot)
      setConfirmOpen(true)
    } finally {
      setActionLoading(false)
    }
  }

  return {
    jobs, setJobs,
    drawerOpen, setDrawerOpen,
    editingJob, setEditingJob,
    deleteTarget, confirmOpen, setConfirmOpen,
    fetchLoading, fetchError, actionLoading,
    fetchJobs, handleSave, handleToggleActive,
    handleEdit, handleDelete, handleCancelDelete, handleConfirmDelete,
  }
}

export default useManageJobs
