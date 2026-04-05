import { Descriptions, Typography } from 'antd'

const { Link } = Typography

/**
 * HRDetail
 * Body section of UserDetailModal for HR-type users.
 *
 * @param {object} props
 * @param {object} props.hrUser - HR user data object
 */
export function HRDetail({ hrUser }) {
  return (
    <Descriptions column={2} size="small" bordered={false}>
      <Descriptions.Item label="Company">
        {hrUser.company}
      </Descriptions.Item>

      <Descriptions.Item label="Designation">
        {hrUser.designation}
      </Descriptions.Item>

      <Descriptions.Item label="Industry">
        {hrUser.industry}
      </Descriptions.Item>

      <Descriptions.Item label="Company Size">
        {hrUser.companySize}
      </Descriptions.Item>

      <Descriptions.Item label="Location">
        {hrUser.companyLocation}
      </Descriptions.Item>

      <Descriptions.Item label="Jobs Posted">
        {hrUser.totalJobsPosted}
      </Descriptions.Item>

      <Descriptions.Item label="Joined">
        {hrUser.joinedDate}
      </Descriptions.Item>

      {hrUser.companyWebsite && (
        <Descriptions.Item label="Website">
          <Link href={hrUser.companyWebsite} target="_blank" rel="noreferrer">
            {hrUser.companyWebsite}
          </Link>
        </Descriptions.Item>
      )}
    </Descriptions>
  )
}
