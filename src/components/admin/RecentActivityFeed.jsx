import { Card, Empty, Timeline, Typography, theme } from 'antd'
import {
  UserAddOutlined, IdcardOutlined, SolutionOutlined,
  FileTextOutlined, TrophyOutlined,
} from '@ant-design/icons'

const { Text, Link } = Typography
const { useToken }   = theme

/**
 * Maps activity type → icon component and Ant Design token color key.
 * Token color keys are resolved at render time via useToken().
 */
const TYPE_CONFIG = {
  new_candidate: { icon: UserAddOutlined,   tokenKey: 'colorPrimary'  },
  new_hr:        { icon: IdcardOutlined,    tokenKey: 'colorInfo'     },
  new_job:       { icon: SolutionOutlined,  tokenKey: 'colorWarning'  },
  application:   { icon: FileTextOutlined,  tokenKey: 'colorSuccess'  },
  hired:         { icon: TrophyOutlined,    tokenKey: 'colorSuccess'  },
}

/**
 * RecentActivityFeed
 * Displays a chronological timeline of platform events on the Admin Dashboard.
 *
 * @param {object} props
 * @param {Array}  props.activities - Array of activity objects with type, message, timestamp, actor
 */
export function RecentActivityFeed({ activities }) {
  const { token } = useToken()

  const timelineItems = activities.map((activity) => {
    const config  = TYPE_CONFIG[activity.type] ?? TYPE_CONFIG.application
    const Icon    = config.icon
    const color   = token[config.tokenKey]

    return {
      key: activity.id,
      label: (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {activity.timestamp}
        </Text>
      ),
      dot: (
        <Icon style={{ fontSize: 16, color }} />
      ),
      children: (
        <>
          <Text style={{ display: 'block' }}>{activity.message}</Text>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            {activity.actor}
          </Text>
        </>
      ),
    }
  })

  return (
    <Card
      title="Recent Activity"
      extra={<Link>View All</Link>}
    >
      {timelineItems.length > 0 ? (
        <Timeline mode="left" items={timelineItems} />
      ) : (
        <Empty description="No recent activity yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  )
}
