import { useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { PageHeader, ConfirmModal } from '../../components/ui'
import { JobsTable } from '../../components/hr/JobsTable'
import { JobForm } from '../../components/hr/JobForm'

// ── Mock Data (replace with API calls later) ─────────────────────
const INITIAL_JOBS = [
  {
    id: '1',
    title: 'Senior Backend Developer',
    location: 'Pune, India',
    jobType: 'Full-Time',
    experienceRequired: 4,
    salaryRange: '12-18 LPA',
    requiredSkills: ['Node.js', 'PostgreSQL', 'Docker'],
    isActive: true,
    applicants: 21,
    postedDate: '2026-03-18',
    description: 'Build and maintain scalable backend services.',
    coverLetterRequired: false,
  },
  {
    id: '2',
    title: 'Product Designer',
    location: 'Bangalore, India',
    jobType: 'Full-Time',
    experienceRequired: 3,
    salaryRange: '10-15 LPA',
    requiredSkills: ['Figma', 'User Research', 'Prototyping'],
    isActive: true,
    applicants: 14,
    postedDate: '2026-03-20',
    description: 'Own end-to-end product design for our web platform.',
    coverLetterRequired: true,
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    location: 'Remote',
    jobType: 'Remote',
    experienceRequired: 3,
    salaryRange: '14-20 LPA',
    requiredSkills: ['AWS', 'Kubernetes', 'CI/CD', 'Terraform'],
    isActive: false,
    applicants: 9,
    postedDate: '2026-03-22',
    description: 'Manage cloud infrastructure and deployment pipelines.',
    coverLetterRequired: false,
  },
  {
    id: '4',
    title: 'Data Analyst',
    location: 'Mumbai, India',
    jobType: 'Contract',
    experienceRequired: 2,
    salaryRange: '6-10 LPA',
    requiredSkills: ['Python', 'SQL', 'Tableau', 'Excel'],
    isActive: true,
    applicants: 17,
    postedDate: '2026-03-25',
    description: 'Analyse recruitment data and produce hiring reports.',
    coverLetterRequired: false,
  },
  {
    id: '5',
    title: 'Frontend Developer',
    location: 'Hyderabad, India',
    jobType: 'Full-Time',
    experienceRequired: 2,
    salaryRange: '8-12 LPA',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS'],
    isActive: true,
    applicants: 31,
    postedDate: '2026-03-28',
    description: 'Build responsive, pixel-perfect UIs using React.',
    coverLetterRequired: true,
  },
]
// ─────────────────────────────────────────────────────────────────

/**
 * ManageJobs
 * HR page for creating, editing, toggling, and deleting job listings.
 * Manages all local jobs state and orchestrates sub-components.
 */
export function ManageJobs() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState(INITIAL_JOBS)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // ── Handlers ──────────────────────────────────────────────────────
  const handleEdit = (job) => {
    setEditingJob(job)
    setDrawerOpen(true)
  }

  const handleDelete = (job) => {
    setDeleteTarget(job)
    setConfirmOpen(true)
  }

  const handleToggleActive = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, isActive: !j.isActive } : j))
    )
  }

  const handleSave = (values) => {
    if (editingJob) {
      setJobs((prev) =>
        prev.map((j) => (j.id === editingJob.id ? { ...j, ...values } : j))
      )
    } else {
      const newJob = {
        ...values,
        id: String(Date.now()),
        applicants: 0,
        postedDate: new Date().toISOString().split('T')[0],
        isActive: true,
      }
      setJobs((prev) => [newJob, ...prev])
    }
  }

  const handleConfirmDelete = () => {
    setJobs((prev) => prev.filter((j) => j.id !== deleteTarget?.id))
    setConfirmOpen(false)
    setDeleteTarget(null)
  }

  const handleCancelDelete = () => {
    setConfirmOpen(false)
    setDeleteTarget(null)
  }

  // ── Render ────────────────────────────────────────────────────────
  const headerActions = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => { setEditingJob(null); setDrawerOpen(true) }}
    >
      Post New Job
    </Button>
  )

  return (
    <div className="fade-in-up">

      <PageHeader
        title="Manage Jobs"
        subtitle="Post and manage your job listings"
        actions={headerActions}
      />

      <JobsTable
        jobs={jobs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <JobForm
        open={drawerOpen}
        job={editingJob}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Delete Job"
        description="This will permanently delete the job and cannot be undone."
        danger
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

    </div>
  )
}

export default ManageJobs
