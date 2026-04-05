import { Descriptions, Tag, Typography } from 'antd'

const { Text, Paragraph } = Typography

/**
 * CandidateDetail
 * Body section of UserDetailModal for candidate-type users.
 *
 * @param {object} props
 * @param {object} props.candidate - Candidate data object
 */
export function CandidateDetail({ candidate }) {
  return (
    <>
      <Descriptions column={2} size="small" bordered={false}>
        <Descriptions.Item label="Location">
          {candidate.location}
        </Descriptions.Item>

        <Descriptions.Item label="Experience">
          {candidate.experienceYears} years
        </Descriptions.Item>

        <Descriptions.Item label="Education">
          {candidate.education}
        </Descriptions.Item>

        <Descriptions.Item label="Applications">
          {candidate.totalApplications}
        </Descriptions.Item>

        <Descriptions.Item label="Joined">
          {candidate.joinedDate}
        </Descriptions.Item>
      </Descriptions>

      {/* ── Skills ─────────────────────────────────────────────────── */}
      <div style={{ marginTop: 16 }}>
        <Text strong>Skills</Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
          {candidate.skills.map((skill) => (
            <Tag key={skill} color="blue">{skill}</Tag>
          ))}
        </div>
      </div>

      {/* ── Bio ────────────────────────────────────────────────────── */}
      {candidate.bio && (
        <div style={{ marginTop: 16 }}>
          <Text strong>Bio</Text>
          <Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
            {candidate.bio}
          </Paragraph>
        </div>
      )}
    </>
  )
}
