import React from 'react'
import { Avatar, Button, Card, Divider } from 'antd'
import {
  CalendarOutlined,
  CrownOutlined,
  LinkOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons'

const typingAnimationStyles = `
  @keyframes chatTypingPulse {
    0%, 80%, 100% {
      transform: translateY(0);
      opacity: 0.35;
    }
    40% {
      transform: translateY(-4px);
      opacity: 1;
    }
  }
`

function formatTime(timestamp) {
  if (!timestamp) return ''

  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ChatMessage({ message, isCurrentUser, userAvatarUrl, candidateAvatarUrl, hrAvatarUrl }) {
  const time = formatTime(message?.timestamp)

  if (message?.role === 'user' && isCurrentUser) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 16,
          gap: 8,
          alignItems: 'flex-start',
        }}
      >
        <div style={{ maxWidth: '70%' }}>
          <div
            style={{
              backgroundColor: '#1890ff',
              color: '#fff',
              borderRadius: '18px 18px 4px 18px',
              padding: '10px 14px',
              wordBreak: 'break-word',
            }}
          >
            {message?.content}
          </div>
          {time && (
            <div
              style={{
                textAlign: 'right',
                fontSize: 11,
                color: 'rgba(0,0,0,0.35)',
                marginTop: 4,
              }}
            >
              {time}
            </div>
          )}
        </div>
        <Avatar
          size={32}
          src={userAvatarUrl || undefined}
          icon={<UserOutlined />}
          style={{ backgroundColor: '#096dd9', flexShrink: 0 }}
        />
      </div>
    )
  }

  if (message?.role === 'user') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: 16,
          alignItems: 'flex-start',
          gap: 8,
        }}
      >
        <Avatar
          size={32}
          src={candidateAvatarUrl || undefined}
          icon={<UserOutlined />}
          style={{ backgroundColor: '#8c8c8c', flexShrink: 0 }}
        />
        <div style={{ maxWidth: '70%' }}>
          <div
            style={{
              color: '#595959',
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Candidate
          </div>
          <div
            style={{
              backgroundColor: '#f0f0f0',
              color: '#1f1f1f',
              borderRadius: '4px 18px 18px 18px',
              padding: '10px 14px',
              wordBreak: 'break-word',
            }}
          >
            {message?.content}
          </div>
          {time && (
            <div
              style={{
                fontSize: 11,
                color: 'rgba(0,0,0,0.35)',
                marginTop: 4,
              }}
            >
              {time}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (message?.role === 'assistant') {
    return (
      <>
        {message?.isTyping && <style>{typingAnimationStyles}</style>}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: 16,
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          <Avatar
            size={32}
            icon={<RobotOutlined />}
            style={{ backgroundColor: '#52c41a', flexShrink: 0 }}
          />
          <div style={{ maxWidth: '70%' }}>
            <div
              style={{
                color: '#52c41a',
                fontSize: 11,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              AI Assistant
            </div>
            <div
              style={{
                backgroundColor: '#f0f0f0',
                color: '#1f1f1f',
                borderRadius: '4px 18px 18px 18px',
                padding: '10px 14px',
                wordBreak: 'break-word',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                minWidth: message?.isTyping ? 124 : undefined,
              }}
            >
              {message?.isTyping ? (
                <>
                  <span style={{ color: '#595959', fontSize: 13 }}>Thinking</span>
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                    {[0, 1, 2].map((index) => (
                      <span
                        key={index}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#52c41a',
                          display: 'inline-block',
                          animation: 'chatTypingPulse 1.2s ease-in-out infinite',
                          animationDelay: `${index * 0.18}s`,
                        }}
                      />
                    ))}
                  </span>
                </>
              ) : (
                message?.content
              )}
            </div>
            {time && (
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(0,0,0,0.35)',
                  marginTop: 4,
                }}
              >
                {time}
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  if (message?.role === 'hr') {
    return (
      <Card
        title={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#d48806',
              fontWeight: 600,
            }}
          >
            <CrownOutlined style={{ color: '#d48806' }} />
            {hrAvatarUrl && <Avatar size={20} src={hrAvatarUrl} />}
            <span>HR Message</span>
          </div>
        }
        style={{
          backgroundColor: '#fffbe6',
          borderColor: '#ffe58f',
          borderRadius: 8,
          marginBottom: 16,
        }}
        styles={{
          body: { color: '#1f1f1f', wordBreak: 'break-word' },
        }}
      >
        <div>{message?.content}</div>

        {message?.modal_payload?.type === 'interview_invite' && (
          <>
            <Divider dashed />
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: 700,
                }}
              >
                <CalendarOutlined />
                <span>Interview Invitation</span>
              </div>

              {message?.modal_payload?.interview_link && (
                <Button
                  type="primary"
                  icon={<LinkOutlined />}
                  size="small"
                  onClick={() => window.open(message?.modal_payload?.interview_link, '_blank')}
                  style={{ marginTop: 8 }}
                >
                  Join Interview
                </Button>
              )}

              {message?.modal_payload?.sent_at && (
                <div
                  style={{
                    fontSize: 11,
                    color: '#8c8c8c',
                    marginTop: 8,
                  }}
                >
                  Sent: {new Date(message?.modal_payload?.sent_at).toLocaleString()}
                </div>
              )}
            </div>
          </>
        )}

        {time && (
          <div
            style={{
              textAlign: 'right',
              fontSize: 11,
              color: '#8c8c8c',
              marginTop: 12,
            }}
          >
            {time}
          </div>
        )}
      </Card>
    )
  }

  return null
}

export default ChatMessage
