import { Alert, Card, Progress, Tag, Typography } from 'antd'

const { Text } = Typography

export function MatchBadge({ percentage }) {
  const hasPercentage = percentage !== null && percentage !== undefined

  return (
    <span
      style={{
        background: '#F5F5F5',
        color: '#595959',
        border: '1px solid #D9D9D9',
        borderRadius: 10,
        padding: '1px 7px',
        fontSize: 11,
        fontWeight: 700,
        marginLeft: 6,
      }}
    >
      {hasPercentage ? `${percentage}%` : 'N/A'}
    </span>
  )
}

export function MatchAnalysisCard({ matchData }) {
  if (!matchData) return null
  const pct = typeof matchData.match_percentage === 'number' ? matchData.match_percentage : null
  const matchedSkills = Array.isArray(matchData.matched_skills) ? matchData.matched_skills : []
  const missingSkills = Array.isArray(matchData.missing_skills) ? matchData.missing_skills : []
  const experienceGap = matchData.experience_gap
  const progressColor = pct === null ? '#1677FF' : pct >= 80 ? '#27AE60' : pct >= 60 ? '#E67E22' : '#E74C3C'

  return (
    <Card style={{ borderRadius: 12, marginBottom: 16, background: '#FAFAFA' }}>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Match Analysis</div>
      {pct !== null ? (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Match Percentage
            </Text>
            <Text strong>{pct}%</Text>
          </div>
          <Progress percent={pct} showInfo={false} strokeColor={progressColor} trailColor="#E0E0E0" />
        </div>
      ) : null}

      {matchData.analysis_note ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <Alert
            showIcon
            type="info"
            style={{ marginBottom: 12, borderRadius: 10, width: '100%' }}
            message="Analysis Note"
            description={matchData.analysis_note}
          />
        </div>
      ) : null}

      {matchedSkills.length ? (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#27AE60', marginBottom: 6 }}>Matched Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {matchedSkills.map((skill) => (
              <Tag key={skill} style={{ marginInlineEnd: 0, color: '#27AE60', borderColor: '#A9DFBF', background: '#EAFAF1' }}>
                {skill}
              </Tag>
            ))}
          </div>
        </div>
      ) : null}

      {missingSkills.length ? (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#E74C3C', marginBottom: 6 }}>Missing Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {missingSkills.map((skill) => (
              <Tag key={skill} style={{ marginInlineEnd: 0, color: '#E74C3C', borderColor: '#F1948A', background: '#FDEDEC' }}>
                {skill}
              </Tag>
            ))}
          </div>
        </div>
      ) : null}

      {experienceGap !== null && experienceGap !== undefined ? (
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4 }}>Experience Gap</div>
          <Text strong>{String(experienceGap)}</Text>
        </div>
      ) : null}

      {matchData.scoring_method ? (
        <Text type="secondary" style={{ fontSize: 11 }}>
          Scoring Method: {matchData.scoring_method}
        </Text>
      ) : null}
    </Card>
  )
}
