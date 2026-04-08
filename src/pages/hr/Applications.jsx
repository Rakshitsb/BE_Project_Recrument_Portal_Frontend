import { Alert, Button, Col, Drawer, Result, Row, Skeleton, Tag } from 'antd'
import { SolutionOutlined, UserOutlined }                          from '@ant-design/icons'

import { ApplicantCard }      from '../../components/hr/ApplicantCard'
import { ApplicationFilters } from '../../components/hr/ApplicationFilters'
import { DataTable, EmptyState, PageHeader, StatusBadge } from '../../components/ui'
import { useApplications }    from '../../hooks/useApplications'

/**
 * Applications
 * HR page for reviewing and managing candidate applications.
 * Fetches applications per selected job and supports optimistic status updates.
 */
export function Applications() {
  const {
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
  } = useApplications()

  const columns = [
    { title: 'Candidate', dataIndex: 'candidateName', key: 'candidateName' },
    { title: 'Job', dataIndex: 'jobTitle', key: 'jobTitle' },
    { title: 'Applied', dataIndex: 'appliedDate', key: 'appliedDate' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <StatusBadge status={status} /> },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => <Button type="text" size="small" onClick={() => handleView(record)}>View</Button>,
    },
  ]

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
          extra={<Button onClick={() => loadApplications(selectedJobId)}>Retry</Button>}
        />
      )
    }

    return (
      <Row gutter={16}>
        <Col xs={24} lg={14}>
          <DataTable
            columns={columns}
            dataSource={filteredApps}
            emptyText="No applications match the current filters."
            extraProps={{ onRow: (record) => ({ onClick: () => handleView(record), className: 'cursor-pointer' }) }}
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
        className="mb-4"
        type="info"
        showIcon
        closable
        message="Phase 1 — Limited candidate details"
        description="Full candidate profiles (name, skills, education) will be available after Phase 2 API enrichment. Application status management is fully functional."
      />

      {jobsError && (
        <Alert
          className="mb-4"
          type="error"
          showIcon
          message="Failed to load your jobs"
          description={jobsError}
          action={<Button size="small" onClick={loadJobs}>Retry</Button>}
        />
      )}

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
