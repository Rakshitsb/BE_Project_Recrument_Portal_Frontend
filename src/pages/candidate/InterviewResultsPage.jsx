import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card, Typography, Avatar, Button,
  Spin, Tag, Empty
} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import {
  getCandidateResponse,
  getInterviewByToken
} from '../../services/candidateInterviewService'

function formatDuration(seconds) {
  if (!seconds) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function getScoreColor(score, max) {
  const pct = (score / max) * 100
  if (pct >= 75) return '#10b981'
  if (pct >= 50) return '#f59e0b'
  return '#ef4444'
}

function getScoreLabel(score, max) {
  const pct = (score / max) * 100
  if (pct >= 75) return 'Strong'
  if (pct >= 50) return 'Good'
  return 'Needs Work'
}

function getTagColor(score, max) {
  const pct = (score / max) * 100
  if (pct >= 75) return 'success'
  if (pct >= 50) return 'warning'
  return 'error'
}

export default function InterviewResultsPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [stage, setStage]         = useState('loading')
  const [interview, setInterview] = useState(null)
  const [response, setResponse]   = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [pollCount, setPollCount] = useState(0)
  const intervalRef               = useRef(null)

  async function fetchResponse(interviewId) {
    try {
      const data = await getCandidateResponse(interviewId)
      setResponse(data)
      setPollCount(prev => prev + 1)

      if (data.is_analysed) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setAnalytics(data.analytics)
        setStage('ready')
      } else {
        setStage('processing')
      }
    } catch (err) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setStage('error')
    }
  }

  async function startPolling(interviewId) {
    await fetchResponse(interviewId)
    intervalRef.current = setInterval(async () => {
      await fetchResponse(interviewId)
    }, 8000)
  }

  useEffect(() => {
    async function init() {
      try {
        const interviewData = await getInterviewByToken(token)
        setInterview(interviewData)
        startPolling(interviewData.id)
      } catch (err) {
        setStage('error')
      }
    }
    init()

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [token])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '32px 16px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* ── LOADING ── */}
        {stage === 'loading' && (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <Spin size="large" />
            <Typography.Text type="secondary" style={{ display: 'block', marginTop: 16, fontSize: 15 }}>
              Loading your results...
            </Typography.Text>
          </div>
        )}

        {/* ── PROCESSING ── */}
        {stage === 'processing' && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🧠</div>
            <Typography.Title level={3} style={{ color: '#6366f1' }}>
              Analyzing Your Interview
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 15, display: 'block', marginBottom: 24 }}>
              Our AI is reviewing your responses. This usually takes 10–30 seconds.
            </Typography.Text>
            <Spin size="large" style={{ marginBottom: 24 }} />
            <div style={{ marginBottom: 32 }}>
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                Checked {pollCount} time{pollCount !== 1 ? 's' : ''}...
              </Typography.Text>
            </div>
            {interview && (
              <Card style={{ borderRadius: 12, textAlign: 'left', border: '1px solid #e0f2fe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar
                    size={48}
                    src={`${import.meta.env.VITE_API_BASE_URL}${interview.interviewer?.image}`}
                    icon={<UserOutlined />}
                  />
                  <div>
                    <Typography.Text strong style={{ display: 'block' }}>{interview.name}</Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      Interviewed by {interview.interviewer?.name}
                    </Typography.Text>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ── ERROR ── */}
        {stage === 'error' && (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
            <Typography.Title level={3} style={{ color: '#ef4444' }}>
              Could Not Load Results
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 15 }}>
              Something went wrong fetching your results. Please try again.
            </Typography.Text>
            <br /><br />
            <Button type="primary" onClick={() => window.location.reload()} style={{ marginRight: 12 }}>
              Retry
            </Button>
            <Button onClick={() => navigate('/candidate')}>Go to Dashboard</Button>
          </div>
        )}

        {/* ── READY ── */}
        {stage === 'ready' && analytics && (
          <>
            {/* Header card */}
            <Card style={{
              borderRadius: 16,
              marginBottom: 20,
              background: 'linear-gradient(135deg, #0d9488 0%, #6366f1 100%)',
              border: 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <Typography.Title level={3} style={{ color: '#fff', margin: 0 }}>
                    Interview Complete
                  </Typography.Title>
                  <Typography.Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, display: 'block' }}>
                    {interview?.name}
                  </Typography.Text>
                  {response?.created_at && (
                    <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, display: 'block' }}>
                      Completed on {new Date(response.created_at).toLocaleDateString()}
                    </Typography.Text>
                  )}
                </div>
                <Avatar
                  size={56}
                  src={`${import.meta.env.VITE_API_BASE_URL}${interview?.interviewer?.image}`}
                  icon={<UserOutlined />}
                  style={{ border: '3px solid rgba(255,255,255,0.4)', flexShrink: 0 }}
                />
              </div>
            </Card>

            {/* Score cards row */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
              {/* Overall Score */}
              <Card style={{ borderRadius: 12, flex: 1, minWidth: 180, textAlign: 'center' }}>
                <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                  Overall Score
                </Typography.Text>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  border: `4px solid ${getScoreColor(analytics.overallScore, 100)}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 8px'
                }}>
                  <Typography.Title level={3} style={{ margin: 0, color: getScoreColor(analytics.overallScore, 100) }}>
                    {analytics.overallScore}
                  </Typography.Title>
                </div>
                <Tag color={getTagColor(analytics.overallScore, 100)}>
                  {getScoreLabel(analytics.overallScore, 100)}
                </Tag>
              </Card>

              {/* Communication */}
              <Card style={{ borderRadius: 12, flex: 1, minWidth: 180, textAlign: 'center' }}>
                <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                  Communication
                </Typography.Text>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  border: `4px solid ${getScoreColor(analytics.communication?.score, 10)}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 8px'
                }}>
                  <Typography.Title level={3} style={{ margin: 0, color: getScoreColor(analytics.communication?.score, 10) }}>
                    {analytics.communication?.score}
                  </Typography.Title>
                </div>
                <Tag color={getTagColor(analytics.communication?.score, 10)}>
                  {getScoreLabel(analytics.communication?.score, 10)}
                </Tag>
              </Card>

              {/* Duration */}
              <Card style={{ borderRadius: 12, flex: 1, minWidth: 180, textAlign: 'center' }}>
                <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                  Duration
                </Typography.Text>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  border: '4px solid #6366f1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 8px'
                }}>
                  <Typography.Title level={3} style={{ margin: 0, color: '#6366f1', fontSize: 18 }}>
                    {formatDuration(response?.duration)}
                  </Typography.Title>
                </div>
                <Tag color="purple">Completed</Tag>
              </Card>
            </div>

            {/* Soft Skills */}
            <Card title="Soft Skills Summary" style={{ borderRadius: 12, marginBottom: 16 }}>
              {analytics.softSkillSummary
                ? <Tag color="cyan" style={{ fontSize: 14, padding: '4px 12px' }}>{analytics.softSkillSummary}</Tag>
                : <Typography.Text type="secondary">Not available</Typography.Text>
              }
            </Card>

            {/* Overall Feedback */}
            <Card title="Overall Feedback" style={{ borderRadius: 12, marginBottom: 16 }}>
              <Typography.Paragraph style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>
                {analytics.overallFeedback}
              </Typography.Paragraph>
            </Card>

            {/* Communication Feedback */}
            <Card title="Communication" style={{ borderRadius: 12, marginBottom: 16 }}>
              <Typography.Paragraph style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>
                {analytics.communication?.feedback}
              </Typography.Paragraph>
            </Card>

            {/* Question Summaries */}
            <Card
              title="Question by Question"
              style={{ borderRadius: 12, marginBottom: 16 }}
              extra={
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {analytics.questionSummaries?.length || 0} questions
                </Typography.Text>
              }
            >
              {!analytics.questionSummaries?.length
                ? <Empty description="No question data" />
                : analytics.questionSummaries.map((item, index) => {
                    const isSpecial = item.summary === 'Not Asked' || item.summary === 'Not Answered'
                    const isLast = index === analytics.questionSummaries.length - 1
                    return (
                      <div
                        key={index}
                        style={{
                          marginBottom: isLast ? 0 : 20,
                          paddingBottom: isLast ? 0 : 20,
                          borderBottom: isLast ? 'none' : '1px solid #f0f0f0'
                        }}
                      >
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: '50%',
                            backgroundColor: '#f0fdfa', border: '1px solid #0d9488',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                          }}>
                            <Typography.Text style={{ fontSize: 11, color: '#0d9488', fontWeight: 600 }}>
                              {index + 1}
                            </Typography.Text>
                          </div>
                          <Typography.Text strong style={{ fontSize: 14 }}>{item.question}</Typography.Text>
                        </div>
                        <div style={{ paddingLeft: 34 }}>
                          {isSpecial
                            ? <Tag color="default" style={{ marginTop: 4 }}>{item.summary}</Tag>
                            : <Typography.Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6 }}>
                                {item.summary}
                              </Typography.Text>
                          }
                        </div>
                      </div>
                    )
                  })
              }
            </Card>

            {/* Bottom actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24, paddingBottom: 40 }}>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/candidate')}
                style={{ borderRadius: 8 }}
              >
                Go to Dashboard
              </Button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
