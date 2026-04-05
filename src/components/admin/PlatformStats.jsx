import { Row, Col } from 'antd'
import {
  UserOutlined, TeamOutlined, SolutionOutlined,
  FileTextOutlined, CheckCircleOutlined, TrophyOutlined,
} from '@ant-design/icons'

import { StatCard } from '../ui/StatCard'

/**
 * PlatformStats
 * Renders a 6-card responsive stat grid for the Admin Dashboard.
 *
 * @param {object} props
 * @param {object} props.stats - Platform-wide numeric metrics
 */
export function PlatformStats({ stats }) {
  const cards = [
    {
      title: 'Total Candidates',
      value: stats.totalCandidates,
      color: 'blue',
      icon: <UserOutlined />,
      trend: { value: 8, up: true },
    },
    {
      title: 'Total HR Users',
      value: stats.totalHR,
      color: 'purple',
      icon: <TeamOutlined />,
    },
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      color: 'orange',
      icon: <SolutionOutlined />,
    },
    {
      title: 'Applications',
      value: stats.totalApplications,
      color: 'blue',
      icon: <FileTextOutlined />,
      trend: { value: 12, up: true },
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      color: 'green',
      icon: <CheckCircleOutlined />,
    },
    {
      title: 'Hired This Month',
      value: stats.hiredThisMonth,
      color: 'green',
      icon: <TrophyOutlined />,
      trend: { value: 3, up: true },
    },
  ]

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {cards.map((card) => (
        <Col key={card.title} xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
          />
        </Col>
      ))}
    </Row>
  )
}
