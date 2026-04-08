import { Row, Col, Button, Tag, Drawer, Skeleton, Result, Alert } from 'antd'
import { UserOutlined, SolutionOutlined }                          from '@ant-design/icons'

import { PageHeader, DataTable, StatusBadge, EmptyState } from '../../components/ui'
import { ApplicationFilters } from '../../components/hr/ApplicationFilters'
import { ApplicantCard }      from '../../components/hr/ApplicantCard'
import { useApplications }    from '../../hooks/useApplications'

/**
 * Applications
 * HR page for reviewing and managing candidate applications.
 * Fetches applications per selected job, supports status filtering,
 * and an inline profile panel with a mobile drawer fallback.
 * All state and API logic delegated to useApplications hook.
 */
export function Applications() {
  const {
    jobs, filteredApps, setApplications,
    jobsLoading, appsLoading, appsError, statusUpdating,
    selectedJobId, selectedStatus, selectedApp, drawerOpen,
    setSelectedStatus, setDrawerOpen,
    handleJobChange, handleView, handleStatusChange,
    fetchApplications,
  } = useApplications()

  // ── Table columns ─────────────────────────────────────────────────
  const columns = [
    { title: 'Candidate', dataIndex: 'candidateName', key: 'candidateName' },
    { title: 'Job',       dataIndex: 'jobTitle',       key: 'jobTitle' },
    { title: 'Applied',   dataIndex: 'appliedDate',    key: 'appliedDate' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s) => <StatusBadge status={s} />,
    },
    {
      title: 'Action', key: 'action',
      render: (_, r) => (
        <Button type="text" size="small" onClick={() => handleView(r)}>View</Button>
      ),
    },
  ]

  // ── Content area (job-gated, then loading/error/table) ────────────
  const renderContent = () => {
    if (!selectedJobId) {
      return (
        <EmptyState
          icon={<SolutionOutlined />}
          message="Select a job above to view its applications"
        />
      )
    }

    if (appsLoading) return <Skeleton active paragraph={{ rows: 5 }} />

    if (appsError) {
      return (
        <Result
          status="error"
          title="Failed to load applications"
          subTitle={appsError}
          extra={
            <Button onClick={() =>
              fetchApplications(selectedJobId).then((r) => r && setApplications(r))
            }>
              Retry
            </Button>
          }
        />
      )
    }

    return (
      <Row gutter={16}>
        <Col xs={24} lg={14}>
          <DataTable
            columns={columns}
            dataSource={filteredApps}
            loading={appsLoading}
            emptyText="No applications match the current filters."
            extraProps={{
              onRow: (r) => ({ onClick: () => handleView(r), style: { cursor: 'pointer' } }),
            }}
          />
        </Col>

        <Col xs={0} lg={10}>
          {selectedApp ? (
            <ApplicantCard
              applicant={selectedApp}
              onStatusChange={handleStatusChange}
              statusUpdating={statusUpdating}
            />
          ) : (
            <EmptyState
              icon={<UserOutlined />}
              message="Select an applicant to view their profile"
            />
          )}
        </Col>
      </Row>
    )
  }

  return (
    <div className="fade-in-up">

      <PageHeader
        title="Applications"
        subtitle="Review and manage candidate applications"
        actions={<Tag color="blue">{filteredApps.length} Applications</Tag>}
      />

      <Alert
        type="info"
        showIcon
        closable
        style={{ marginBottom: 16 }}
        message="Phase 1 — Limited candidate details"
        description="Full candidate profiles (name, skills, education) will be available after Phase 2 API enrichment. Application status management is fully functional."
      />

      <ApplicationFilters
        jobs={jobs}
        selectedJobId={selectedJobId}
        selectedStatus={selectedStatus}
        onJobChange={handleJobChange}
        onStatusChange={setSelectedStatus}
        jobsLoading={jobsLoading}
      />

      {renderContent()}

      <Drawer
        title={selectedApp?.candidateName}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={480}
        placement="right"
        destroyOnClose={false}
      >
        {selectedApp && (
          <ApplicantCard
            applicant={selectedApp}
            onStatusChange={handleStatusChange}
            statusUpdating={statusUpdating}
          />
        )}
      </Drawer>

    </div>
  )
}

export default Applications
