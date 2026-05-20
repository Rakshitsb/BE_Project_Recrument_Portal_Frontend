import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Button, Card, Typography, Avatar, Input,
  Alert, Spin, Modal, message, Divider
} from 'antd'
import {
  AudioOutlined, AudioMutedOutlined, PhoneOutlined,
  UserOutlined, MailOutlined, ClockCircleOutlined,
  QuestionCircleOutlined, SafetyOutlined
} from '@ant-design/icons'
import { RetellWebClient } from 'retell-client-js-sdk'
import useAuthStore from '../../store/authStore'
import {
  getInterviewByToken,
  registerCall,
  updateTabSwitchCount
} from '../../services/candidateInterviewService'
import { getInterviewerMedia } from '../../components/interview/interviewerAssets'

const retellClient = new RetellWebClient()

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getDurationSeconds(duration) {
  if (typeof duration === 'number') return duration * 60

  const value = String(duration || '').toLowerCase()
  const number = Number.parseInt(value, 10)
  if (!Number.isFinite(number)) return 0

  if (value.includes('sec')) return number
  return number * 60
}

function getLatestTranscriptContent(transcript, role) {
  if (!Array.isArray(transcript)) return ''

  for (let i = transcript.length - 1; i >= 0; i -= 1) {
    if (transcript[i]?.role === role && transcript[i]?.content) {
      return transcript[i].content
    }
  }

  return ''
}

function InterviewProgressBar({ elapsedSeconds, totalSeconds }) {
  const percent = totalSeconds > 0 ? Math.min((elapsedSeconds / totalSeconds) * 100, 100) : 0

  return (
    <div style={{ width: '100%' }} aria-label="Interview progress">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Typography.Text strong style={{ color: '#0f172a' }}>Interview in progress</Typography.Text>
        <Typography.Text type="secondary">
          {formatDuration(elapsedSeconds)}
          {totalSeconds > 0 ? ` / ${formatDuration(totalSeconds)}` : ''}
        </Typography.Text>
      </div>
      <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            background: '#0d9488',
            borderRadius: 999,
            transition: 'width 0.3s ease'
          }}
        />
      </div>
    </div>
  )
}

function SpeakerPanel({
  title,
  transcript,
  avatarSrc,
  avatarIcon,
  active,
  accentColor,
  transcriptRef
}) {
  return (
    <section
      style={{
        flex: 1,
        minWidth: 0,
        border: active ? `1px solid ${accentColor}` : '1px solid #e2e8f0',
        borderRadius: 16,
        background: active ? '#f0fdfa' : '#fff',
        boxShadow: active ? `0 0 0 4px ${accentColor}1f` : '0 1px 3px rgba(15,23,42,0.06)',
        padding: 20,
        transition: 'all 0.2s ease'
      }}
      aria-label={`${title} transcript panel`}
    >
      <div
        ref={transcriptRef}
        style={{
          height: 190,
          overflowY: 'auto',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          background: '#f8fafc',
          padding: 18,
          marginBottom: 18
        }}
      >
        <Typography.Paragraph
          style={{
            color: transcript ? '#0f172a' : '#94a3b8',
            fontSize: 18,
            lineHeight: 1.6,
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}
        >
          {transcript || (active ? 'Listening...' : 'Transcript will appear here.')}
        </Typography.Paragraph>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <Avatar
          size={104}
          src={avatarSrc}
          icon={avatarIcon}
          style={{
            backgroundColor: avatarSrc ? '#fff' : accentColor,
            border: active ? `5px solid ${accentColor}` : '5px solid #e2e8f0',
            boxShadow: active ? `0 0 0 8px ${accentColor}26, 0 12px 30px ${accentColor}33` : 'none',
            transition: 'all 0.2s ease'
          }}
        />
        <Typography.Text strong style={{ color: '#0f172a', fontSize: 15 }}>{title}</Typography.Text>
        <Typography.Text style={{ color: active ? accentColor : '#64748b', fontSize: 13 }}>
          {active ? 'Speaking now' : 'Waiting'}
        </Typography.Text>
      </div>
    </section>
  )
}

function LiveCallScreen({
  interview,
  userAvatarSrc,
  activeTurn,
  lastInterviewerResponse,
  lastUserResponse,
  callDuration,
  tabSwitchCount,
  isMuted,
  onMuteToggle,
  onEndCall,
  userTranscriptRef
}) {
  const { imageUrl } = getInterviewerMedia(interview?.interviewer)
  const totalSeconds = getDurationSeconds(interview?.time_duration)

  return (
    <div style={{ width: '100%', maxWidth: 1120 }}>
      <div className="interview-mobile-block">
        <Typography.Title level={4} style={{ marginTop: 0 }}>Use a desktop or laptop</Typography.Title>
        <Typography.Text type="secondary">
          Live voice interviews need a larger screen and stable microphone controls.
        </Typography.Text>
      </div>
      <Card
        className="interview-call-card"
        style={{
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          boxShadow: '0 18px 50px rgba(15,23,42,0.10)',
          padding: 8
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
            <div>
              <Typography.Title level={3} style={{ margin: 0, color: '#0f172a' }}>
                Live AI Interview
              </Typography.Title>
              <Typography.Text type="secondary">
                {interview?.interviewer?.name || 'AI Interviewer'} is conducting your interview.
              </Typography.Text>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 999,
                background: '#ecfeff',
                border: '1px solid #99f6e4',
                color: '#0f766e',
                fontWeight: 600
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#0d9488',
                  display: 'inline-block'
                }}
                className="pulse"
              />
              Connected
            </div>
          </div>

          <InterviewProgressBar elapsedSeconds={callDuration} totalSeconds={totalSeconds} />

          {tabSwitchCount > 0 && (
            <Alert
              type="warning"
              showIcon
              message={`Tab switch detected (${tabSwitchCount} time${tabSwitchCount > 1 ? 's' : ''}). This is being recorded.`}
              style={{ borderRadius: 10 }}
            />
          )}

          <div className="interview-speaker-grid" style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
            <SpeakerPanel
              title="Interviewer"
              transcript={lastInterviewerResponse}
              avatarSrc={imageUrl}
              avatarIcon={<UserOutlined />}
              active={activeTurn === 'agent'}
              accentColor="#0d9488"
            />
            <SpeakerPanel
              title="You"
              transcript={lastUserResponse}
              avatarSrc={userAvatarSrc}
              avatarIcon={<UserOutlined />}
              active={activeTurn === 'user'}
              accentColor="#6366f1"
              transcriptRef={userTranscriptRef}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, paddingTop: 4 }}>
            <Button
              size="large"
              icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
              onClick={onMuteToggle}
              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              style={{
                minWidth: 132,
                height: 46,
                borderRadius: 999,
                color: isMuted ? '#ef4444' : '#0d9488',
                borderColor: isMuted ? '#fecaca' : '#99f6e4',
                background: isMuted ? '#fef2f2' : '#f0fdfa'
              }}
            >
              {isMuted ? 'Muted' : 'Mic on'}
            </Button>
            <Button
              danger
              size="large"
              icon={<PhoneOutlined style={{ transform: 'rotate(135deg)' }} />}
              onClick={onEndCall}
              aria-label="End interview"
              style={{
                minWidth: 168,
                height: 46,
                borderRadius: 999,
                backgroundColor: '#ef4444',
                borderColor: '#ef4444',
                color: '#fff',
                fontWeight: 700
              }}
            >
              End Interview
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function InterviewTakePage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  const [stage, setStage]               = useState('loading')
  const [interview, setInterview]       = useState(null)
  const [callId, setCallId]             = useState('')
  const [candidateName, setCandidateName] = useState(user?.name || '')
  const [candidateEmail, setCandidateEmail] = useState(user?.email || '')
  const [activeTurn, setActiveTurn]     = useState('') // 'agent' | 'user'
  const [lastInterviewerResponse, setLastInterviewerResponse] = useState('')
  const [lastUserResponse, setLastUserResponse] = useState('')
  const [isMuted, setIsMuted]           = useState(false)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [callDuration, setCallDuration] = useState(0)
  const [starting, setStarting]         = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const userTranscriptRef = useRef(null)
  const interviewerMedia = getInterviewerMedia(interview?.interviewer)

  useEffect(() => {
    async function fetchInterview() {
      try {
        const data = await getInterviewByToken(token)
        setInterview(data)
        setStage('intro')
      } catch (err) {
        if (err.response?.status === 410) {
          setErrorMessage('This interview link is no longer active.')
        } else if (err.response?.status === 404) {
          setErrorMessage('Invalid interview link.')
        } else if (err.response?.status === 403) {
          setErrorMessage('You are not authorized to take this interview.')
        } else {
          setErrorMessage('Something went wrong. Please try again later.')
        }
        setStage('error')
      }
    }
    fetchInterview()
  }, [token])

  useEffect(() => {
    if (stage !== 'calling') return

    function handleVisibilityChange() {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1
          if (callId) updateTabSwitchCount(callId, newCount)
          return newCount
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [stage, callId])

  useEffect(() => {
    let interval
    if (stage === 'calling') {
      interval = setInterval(() => setCallDuration(prev => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [stage])

  useEffect(() => {
    retellClient.on('call_started', () => {
      setStage('calling')
      setStarting(false)
    })

    retellClient.on('call_ended', () => {
      setStage('ended')
    })

    retellClient.on('agent_start_talking', () => setActiveTurn('agent'))
    retellClient.on('agent_stop_talking', () => setActiveTurn('user'))

    retellClient.on('update', (update) => {
      const transcript = Array.isArray(update) ? update : update?.transcript
      const latestAgentText = getLatestTranscriptContent(transcript, 'agent')
      const latestUserText = getLatestTranscriptContent(transcript, 'user')

      if (latestAgentText) setLastInterviewerResponse(latestAgentText)
      if (latestUserText) setLastUserResponse(latestUserText)

      const lastItem = Array.isArray(transcript) ? transcript[transcript.length - 1] : null
      if (lastItem?.role === 'agent' || lastItem?.role === 'user') {
        setActiveTurn(lastItem.role)
      }
    })

    retellClient.on('error', (err) => {
      console.error('Retell error:', err)
      setStage('error')
      setErrorMessage('A call error occurred. Please refresh and try again.')
    })
  }, [])

  useEffect(() => {
    if (!userTranscriptRef.current) return
    userTranscriptRef.current.scrollTop = userTranscriptRef.current.scrollHeight
  }, [lastUserResponse])

  async function handleStartCall() {
    if (!candidateName.trim() || !candidateEmail.trim()) {
      message.warning('Please enter your name and email before starting.')
      return
    }
    setStarting(true)
    try {
      const data = await registerCall(token, candidateName.trim(), candidateEmail.trim())
      setCallId(data.call_id)
      await retellClient.startCall({ accessToken: data.access_token })
    } catch (err) {
      setStarting(false)
      if (err.response?.status === 410) {
        setErrorMessage('This interview link is no longer active.')
        setStage('error')
      } else if (err.response?.status === 400) {
        message.error('An interview session is already in progress for this link.')
      } else {
        message.error('Failed to start the call. Please try again.')
      }
    }
  }

  function handleEndCall() {
    Modal.confirm({
      title: 'End the interview?',
      content: 'Are you sure you want to end the interview early? This cannot be undone.',
      okText: 'Yes, end it',
      okType: 'danger',
      cancelText: 'Continue',
      onOk: () => {
        retellClient.stopCall()
      }
    })
  }

  function handleMuteToggle() {
    // Retell SDK does not expose a mute API — toggle mic via AudioContext or just track visually
    setIsMuted(prev => !prev)
  }

  useEffect(() => {
    if (stage !== 'ended') return
    const timer = setTimeout(() => {
      navigate(`/interview/${token}/results`)
    }, 3000)
    return () => clearTimeout(timer)
  }, [stage, navigate, token])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }}>
      {stage === 'loading' && (
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <Typography.Text type="secondary" style={{ display: 'block', marginTop: 16, fontSize: 15 }}>
            Loading your interview...
          </Typography.Text>
        </div>
      )}

      {stage === 'error' && (
        <div style={{ textAlign: 'center', maxWidth: 440 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔗</div>
          <Typography.Title level={3} style={{ color: '#ef4444' }}>
            Interview Unavailable
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 15 }}>
            {errorMessage}
          </Typography.Text>
          <br /><br />
          <Button onClick={() => navigate('/candidate')} type="primary">
            Go to Dashboard
          </Button>
        </div>
      )}

      {stage === 'intro' && interview && (
        <Card style={{ maxWidth: 520, width: '100%', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
            <Avatar size={96} src={interviewerMedia.imageUrl} style={{ border: '3px solid #e0f2fe', backgroundColor: '#fff' }} icon={<UserOutlined />} />
            <Typography.Title level={4} style={{ margin: '12px 0 4px' }}>{interview.interviewer.name}</Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 13, textAlign: 'center' }}>{interview.interviewer.description}</Typography.Text>
          </div>
          <Divider />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <ClockCircleOutlined style={{ color: '#6366f1', fontSize: 18 }}/>
              <Typography.Text strong>{interview.time_duration}</Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>Duration</Typography.Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <QuestionCircleOutlined style={{ color: '#0d9488', fontSize: 18 }}/>
              <Typography.Text strong>{interview.question_count}</Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>Questions</Typography.Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <SafetyOutlined style={{ color: '#f59e0b', fontSize: 18 }}/>
              <Typography.Text strong>AI Powered</Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>Interview</Typography.Text>
            </div>
          </div>
          <Card size="small" style={{ backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: 10, marginBottom: 20 }}>
            <Typography.Text style={{ fontSize: 13 }}>{interview.description}</Typography.Text>
          </Card>
          <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>Your Details</Typography.Text>
          <Input value={candidateName} onChange={e => setCandidateName(e.target.value)} placeholder="Your full name" prefix={<UserOutlined />} style={{ marginBottom: 10 }} />
          <Input value={candidateEmail} onChange={e => setCandidateEmail(e.target.value)} placeholder="Your email address" prefix={<MailOutlined />} style={{ marginBottom: 20 }} />
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 20, borderRadius: 8 }}
            message="Before you begin"
            description={
              <ul style={{ fontSize: 13, paddingLeft: 20, margin: 0 }}>
                <li>Find a quiet place with stable internet</li>
                <li>Allow microphone access when prompted</li>
                <li>Do not switch tabs or minimize — it will be recorded</li>
                <li>The interview will auto-end when the time limit is reached</li>
              </ul>
            }
          />
          <Button
            type="primary"
            size="large"
            icon={<AudioOutlined />}
            loading={starting}
            onClick={handleStartCall}
            disabled={!candidateName.trim() || !validateEmail(candidateEmail)}
            style={{ width: '100%', height: 48, borderRadius: 10, fontSize: 16, backgroundColor: '#0d9488', borderColor: '#0d9488' }}
          >
            Start Interview
          </Button>
        </Card>
      )}

      {stage === 'calling' && interview && (
        <LiveCallScreen
          interview={interview}
          userAvatarSrc={user?.avatarUrl || user?.avatar_url}
          activeTurn={activeTurn}
          lastInterviewerResponse={lastInterviewerResponse}
          lastUserResponse={lastUserResponse}
          callDuration={callDuration}
          tabSwitchCount={tabSwitchCount}
          isMuted={isMuted}
          onMuteToggle={handleMuteToggle}
          onEndCall={handleEndCall}
          userTranscriptRef={userTranscriptRef}
        />
      )}

      {stage === 'calling_legacy' && interview && (
        <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
          <Card style={{ borderRadius: 16, marginBottom: 24, padding: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Avatar
                size={96}
                src={`${import.meta.env.VITE_API_BASE_URL}${interview.interviewer.image}`}
                style={
                  activeTurn === 'agent'
                    ? { border: '4px solid #0d9488', boxShadow: '0 0 0 4px #ccfbf1' }
                    : { border: '4px solid #e2e8f0' }
                }
              />
              <Typography.Title level={4} style={{ margin: 0 }}>{interview.interviewer.name}</Typography.Title>
              {activeTurn === 'agent' ? (
                <Typography.Text style={{ color: '#0d9488' }}>🎙 Speaking...</Typography.Text>
              ) : activeTurn === 'user' ? (
                <Typography.Text style={{ color: '#6366f1' }}>🎤 Your turn</Typography.Text>
              ) : (
                <Typography.Text type="secondary">Connecting...</Typography.Text>
              )}
            </div>
          </Card>
          <Typography.Title level={2} style={{ color: '#1e293b', margin: '16px 0' }}>
            {formatDuration(callDuration)}
          </Typography.Title>
          {tabSwitchCount > 0 && (
            <Alert
              type="warning"
              showIcon
              message={`Tab switch detected (${tabSwitchCount} time${tabSwitchCount > 1 ? 's' : ''}). This is being recorded.`}
              style={{ marginBottom: 16, borderRadius: 8 }}
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 8 }}>
            <Button
              shape="circle"
              size="large"
              icon={isMuted ? <AudioMutedOutlined style={{ color: '#ef4444' }}/> : <AudioOutlined style={{ color: '#0d9488' }}/>}
              onClick={handleMuteToggle}
              style={{ width: 56, height: 56 }}
            />
            <Button
              danger
              shape="circle"
              size="large"
              icon={<PhoneOutlined style={{ transform: 'rotate(135deg)' }}/>}
              onClick={handleEndCall}
              style={{ width: 56, height: 56, backgroundColor: '#ef4444', borderColor: '#ef4444' }}
            />
          </div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Tap the red button to end the interview
          </Typography.Text>
        </div>
      )}

      {stage === 'ended' && (
        <div style={{ textAlign: 'center', maxWidth: 440 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <Typography.Title level={3} style={{ color: '#10b981' }}>
            Interview Complete!
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 15 }}>
            Great job! Your responses are being analyzed.
            You'll be redirected to your results in a moment...
          </Typography.Text>
          <br /><br />
          <Spin size="small" />
        </div>
      )}
    </div>
  )
}
