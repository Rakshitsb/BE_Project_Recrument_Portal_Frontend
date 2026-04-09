import { memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Avatar,
  Typography,
  Space,
  Tag,
  Button,
} from 'antd'
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import TagBadge from './TagBadge'

const { Title, Text, Paragraph } = Typography

function JobCard({ job }) {
  const navigate = useNavigate()
  const initials = useMemo(
    () =>
      job.company
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [job.company]
  )

  return (
    <Card
      className="shadow-sm hover:shadow-lg transition-shadow h-full"
      bodyStyle={{ padding: 16 }}
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/candidate/jobs/${job.id}`)}
      actions={[
        <Button
          key="view"
          type="link"
          icon={<ArrowRightOutlined />}
          onClick={(e) => { e.stopPropagation(); navigate(`/candidate/jobs/${job.id}`) }}
        >
          View Jobs
        </Button>,
      ]}
    >
      <div className="flex items-start gap-3">
        <Avatar
          size={52}
          style={{ backgroundColor: job.logoBg }}
          className="font-semibold"
        >
          {initials}
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Title level={5} style={{ marginBottom: 0 }}>
                {job.company}
              </Title>
              <Text type="secondary" className="text-sm">
                {job.title}
              </Text>
            </div>
            <Tag color="blue" className="rounded-full px-3">
              {job.jobsCount} Jobs
            </Tag>
          </div>

          <Paragraph ellipsis={{ rows: 2 }} className="mt-1 mb-2 text-sm">
            {job.description}
          </Paragraph>

          <Space size="small" className="text-gray-600 text-sm">
            <span className="flex items-center gap-1">
              <EnvironmentOutlined /> {job.location}
            </span>
            <span className="flex items-center gap-1">
              <ClockCircleOutlined /> Posted {job.postedAt}
            </span>
          </Space>

          <div className="flex flex-wrap gap-2 mt-3">
            {job.tags.map((tag) => (
              <TagBadge key={tag} label={tag} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default memo(JobCard)
