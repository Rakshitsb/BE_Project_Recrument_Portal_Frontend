import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Col, Result, Row, Skeleton, Space, Tag, Typography } from 'antd'
import {
  CheckOutlined,
  SearchOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { ApplicantCard } from '../../components/hr/ApplicantCard'
import { ApplicationFilters } from '../../components/hr/ApplicationFilters'
import { MatchBadge } from '../../components/hr/MatchInsights'
import { DataTable, EmptyState, PageHeader, StatusBadge } from '../../components/ui'
import { useApplications } from '../../hooks/useApplications'

const { Link, Text } = Typography

export function Applications() {
  const navigate = useNavigate()
  const {
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
    setSelectedStatus,
    handleView,
    handleJobChange,
    handleStatusChange,
    loadJobs,
    loadApplications,
    fetchRankedCandidatesApi,
  } = useApplications()

  const [isRankedMode, setIsRankedMode] = useState(false)
  const [rankedData, setRankedData] = useState(null)
  const [rankingLoading, setRankingLoading] = useState(false)
  const [rankingError, setRankingError] = useState(null)
  const [selectedCandidateRank, setSelectedCandidateRank] = useState(null)

  const resetRanking = () => {
    setIsRankedMode(false)
    setRankedData(null)
    setSelectedCandidateRank(null)
    setRankingError(null)
  }

  const fetchRankedCandidates = async () => {
    if (!selectedJobId) return
    setRankingLoading(true)
    setRankingError(null)
    try {
      const data = await fetchRankedCandidatesApi(selectedJobId)
      setRankedData(data)
      setIsRankedMode(true)
    } catch {
      setRankingError('Could not load match rankings. Please try again.')
    } finally {
      setRankingLoading(false)
    }
  }

  const handleJobFilterChange = (jobId) => {
    resetRanking()
    handleJobChange(jobId)
  }

  const displayList = useMemo(() => {
    if (!isRankedMode || !rankedData) return filteredApps

    const rankedCandidates = Array.isArray(rankedData.ranked_candidates)
      ? rankedData.ranked_candidates
      : []
    const applicationById = new Map(filteredApps.map((app) => [app.id, app]))
    const rankedIds = rankedCandidates.map((candidate) => candidate.application_id)
    const rankedApplications = rankedIds
      .map((id) => applicationById.get(id))
      .filter(Boolean)
    const unrankedApplications = filteredApps.filter((app) => !rankedIds.includes(app.id))

    return [...rankedApplications, ...unrankedApplications]
  }, [filteredApps, isRankedMode, rankedData])

  useEffect(() => {
    if (!selectedApp || !isRankedMode || !rankedData) {
      setSelectedCandidateRank(null)
      return
    }
    const matchData = rankedData.ranked_candidates.find(
      (candidate) => candidate.application_id === selectedApp.id,
    )
    setSelectedCandidateRank(matchData ?? null)
  }, [isRankedMode, rankedData, selectedApp])

  useEffect(() => {
    if (!selectedApp || applications.some((app) => app.id === selectedApp.id)) return
    setSelectedCandidateRank(null)
  }, [applications, selectedApp])

  const columns = [
    {
      title: 'Candidate',
      dataIndex: 'candidateName',
      key: 'candidateName',
      render: (_, record) => {
        const rank = rankedData?.ranked_candidates.find((item) => item.application_id === record.id)
        return (
          <span>
            {record.candidateName}
            {isRankedMode && rank ? <MatchBadge percentage={rank.match_percentage} /> : null}
          </span>
        )
      },
    },
    { title: 'Job', dataIndex: 'jobTitle', key: 'jobTitle' },
    { title: 'Applied', dataIndex: 'appliedDate', key: 'appliedDate' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          onClick={(event) => {
            event.stopPropagation()
            navigate(`/hr/applications/${record.id}`)
          }}
        >
          View
        </Button>
      ),
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
            dataSource={displayList}
            emptyText="No applications match the current filters."
            extraProps={{
              onRow: (record) => ({
                onClick: () => handleView(record),
                className: 'cursor-pointer',
              }),
            }}
          />
        </Col>

        <Col xs={0} lg={10}>
          {selectedApp ? (
            <ApplicantCard
              applicant={selectedApp}
              onStatusChange={handleStatusChange}
              statusUpdating={statusUpdating}
              matchData={isRankedMode ? selectedCandidateRank : null}
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
        actions={(
          <Space size="small">
            {isRankedMode && rankedData?.note ? (
              <Text type="secondary" style={{ fontSize: 12, maxWidth: 320 }}>
                {rankedData.note}
              </Text>
            ) : null}
            <Tag color="blue">{displayList.length} Applications</Tag>
          </Space>
        )}
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

      {rankingError && (
        <Alert
          className="mb-4"
          type="error"
          showIcon
          message="Could not load match rankings"
          description={rankingError}
          action={<Button size="small" onClick={fetchRankedCandidates}>Retry</Button>}
        />
      )}

      <ApplicationFilters
        jobs={jobs}
        selectedJobId={selectedJobId}
        selectedStatus={selectedStatus}
        onJobChange={handleJobFilterChange}
        onStatusChange={setSelectedStatus}
        jobsLoading={jobsLoading}
        actions={(
          <Space size="middle">
            <Button
              type={isRankedMode ? 'default' : 'primary'}
              icon={isRankedMode ? <CheckOutlined /> : <SearchOutlined />}
              onClick={fetchRankedCandidates}
              loading={rankingLoading}
              disabled={!selectedJobId}
            >
              {isRankedMode ? 'Showing Best Match' : 'Find Best Match'}
            </Button>
            {isRankedMode ? (
              <Link onClick={resetRanking}>Reset</Link>
            ) : null}
          </Space>
        )}
      />

      {renderContent()}
    </div>
  )
}
