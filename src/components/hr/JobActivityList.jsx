import { Card, List, Tag, Switch, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

/**
 * JobActivityList
 * Displays a list of posted jobs with their applicant count and active status.
 * Navigates to /hr/jobs when "Manage Jobs" is clicked.
 *
 * @param {object}  props
 * @param {Array}   props.jobs - Array of job activity objects to display
 */
export function JobActivityList({ jobs }) {
  const navigate = useNavigate()

  const cardExtra = (
    <a onClick={() => navigate('/hr/jobs')} style={{ cursor: 'pointer' }}>
      Manage Jobs
    </a>
  )

  return (
    <Card title="Job Activity" extra={cardExtra}>
      <List
        itemLayout="horizontal"
        dataSource={jobs}
        renderItem={(job) => (
          <List.Item
            key={job.id}
            actions={[
              <Tag color="blue" key="count">
                {job.applicants} applicants
              </Tag>,
              <Switch
                key="toggle"
                size="small"
                defaultChecked={job.isActive}
              />,
            ]}
          >
            <List.Item.Meta
              title={<Text strong>{job.title}</Text>}
              description={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Posted {job.postedDate}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  )
}
