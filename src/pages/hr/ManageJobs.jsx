import { Button, Result, Skeleton } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { PageHeader, ConfirmModal } from '../../components/ui'
import { JobsTable }                from '../../components/hr/JobsTable'
import { JobForm }                  from '../../components/hr/JobForm'
import { useManageJobs }            from '../../hooks/useManageJobs'

/**
 * ManageJobs
 * HR page for creating, editing, toggling, and deleting job listings.
 * All state and API logic delegated to useManageJobs hook.
 */
export function ManageJobs() {
  const {
    jobs, setJobs,
    drawerOpen, setDrawerOpen,
    editingJob, setEditingJob,
    confirmOpen,
    fetchLoading, fetchError, actionLoading,
    fetchJobs, handleSave, handleToggleActive,
    handleEdit, handleDelete, handleCancelDelete, handleConfirmDelete,
  } = useManageJobs()

  // ── Header actions ─────────────────────────────────────────────
  const headerActions = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => { setEditingJob(null); setDrawerOpen(true) }}
    >
      Post New Job
    </Button>
  )

  // ── Error state ────────────────────────────────────────────────
  if (fetchError && jobs.length === 0) {
    return (
      <Result
        status="error"
        title="Failed to load jobs"
        subTitle={fetchError}
        extra={
          <Button onClick={() => fetchJobs().then((r) => r && setJobs(r))}>
            Retry
          </Button>
        }
      />
    )
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="fade-in-up">

      {drawerOpen ? (
        <>
          <PageHeader
            title={editingJob ? 'Edit Job' : 'Post New Job'}
            subtitle="Upload a JD, review the auto-filled details, and create the final job post"
          />

          <JobForm
            open={drawerOpen}
            job={editingJob}
            actionLoading={actionLoading}
            onClose={() => { setDrawerOpen(false); setEditingJob(null) }}
            onSave={handleSave}
          />
        </>
      ) : (
        <>
          <PageHeader
            title="Manage Jobs"
            subtitle="Post and manage your job listings"
            actions={headerActions}
          />

          {fetchLoading && jobs.length === 0
            ? <Skeleton active paragraph={{ rows: 6 }} />
            : (
              <JobsTable
                jobs={jobs}
                loading={fetchLoading}
                actionLoading={actionLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            )
          }
        </>
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Delete Job"
        description="This will permanently delete the job and cannot be undone."
        danger
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

    </div>
  )
}

export default ManageJobs
