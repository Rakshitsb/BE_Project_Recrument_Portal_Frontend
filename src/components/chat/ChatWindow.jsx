import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Button, Empty, Input, Spin, Typography } from 'antd'
import { SendOutlined } from '@ant-design/icons'

import ChatMessage from './ChatMessage'
import useChatbot from '../../hooks/useChatbot'
import { getHRChatSession, sendHRMessage } from '../../services/chatbotService'
import useAuthStore from '../../store/authStore'

const { Text } = Typography

function ChatWindow({
  jobId,
  jobTitle = 'Job',
  candidateId,
  mode = 'candidate',
  readOnly = false,
  candidateAvatarUrl = '',
  companyLogoUrl = '',
}) {
  const isHR = mode === 'hr'
  const bottomRef = useRef(null)
  const [input, setInput] = useState('')
  const [hrSession, setHrSession] = useState(null)
  const [hrLoading, setHrLoading] = useState(false)
  const [hrSending, setHrSending] = useState(false)
  const [hrError, setHrError] = useState(null)
  const { user } = useAuthStore()

  const candidateChat = useChatbot(!isHR ? jobId : null)

  const loadHRSession = useCallback(async () => {
    if (!isHR || !jobId || !candidateId) return

    setHrLoading(true)
    setHrError(null)
    try {
      const session = await getHRChatSession(jobId, candidateId)
      setHrSession(session)
    } catch (error) {
      if (error.response?.status === 404) {
        setHrSession({ messages: [], is_enabled: false, message_count: 0 })
      } else {
        setHrError('Failed to load chat session.')
      }
    } finally {
      setHrLoading(false)
    }
  }, [candidateId, isHR, jobId])

  useEffect(() => {
    loadHRSession()
  }, [loadHRSession])

  const messages = isHR ? (hrSession?.messages || []) : candidateChat.messages
  const visibleMessages = !isHR && candidateChat.sending
    ? [
        ...messages,
        {
          id: 'assistant-typing',
          role: 'assistant',
          isTyping: true,
        },
      ]
    : messages
  const loading = isHR ? hrLoading : candidateChat.loading
  const sending = isHR ? hrSending : candidateChat.sending
  const error = isHR ? hrError : candidateChat.error
  const disabled = readOnly || loading || sending || (isHR && !hrSession?.is_enabled)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleMessages.length])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || trimmed.length > 1000 || disabled) return

    setInput('')

    if (isHR) {
      const tempMessage = {
        id: `temp-hr-${Date.now()}`,
        role: 'hr',
        content: trimmed,
        timestamp: new Date().toISOString(),
      }

      setHrSending(true)
      setHrError(null)
      setHrSession((prev) => ({
        ...(prev || {}),
        messages: [...(prev?.messages || []), tempMessage],
      }))

      try {
        const response = await sendHRMessage(jobId, candidateId, {
          message: trimmed,
          message_type: 'general',
        })
        setHrSession((prev) => ({
          ...(prev || {}),
          messages: [
            ...(prev?.messages || []).filter((message) => message.id !== tempMessage.id),
            response.hr_message,
          ],
          message_count: (prev?.message_count || 0) + 1,
        }))
      } catch {
        setHrSession((prev) => ({
          ...(prev || {}),
          messages: (prev?.messages || []).filter((message) => message.id !== tempMessage.id),
        }))
        setHrError('Failed to send message. Please try again.')
      } finally {
        setHrSending(false)
      }
      return
    }

    await candidateChat.sendMessage(trimmed)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          background: '#fff',
        }}
      >
        <Text strong>{jobTitle}</Text>
        {isHR && candidateId && (
          <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
            Candidate: {candidateId}
          </Text>
        )}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: 16,
          background: '#f5f7fb',
        }}
      >
        {error && (
          <Alert
            type="warning"
            showIcon
            message={error}
            style={{ marginBottom: 12 }}
          />
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Spin tip="Loading chat..." />
          </div>
        ) : visibleMessages.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No messages yet"
            style={{ marginTop: 48 }}
          />
        ) : (
          visibleMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={!isHR && message.role === 'user'}
              userAvatarUrl={user?.avatarUrl || user?.avatar_url}
              candidateAvatarUrl={candidateAvatarUrl || hrSession?.candidate_avatar_url}
              hrAvatarUrl={companyLogoUrl}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {!readOnly && (
        <div
          style={{
            padding: 12,
            borderTop: '1px solid #f0f0f0',
            background: '#fff',
            display: 'flex',
            gap: 8,
          }}
        >
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 4 }}
            value={input}
            maxLength={1000}
            disabled={disabled}
            placeholder={isHR ? 'Message the candidate...' : 'Ask about this job...'}
            onChange={(event) => setInput(event.target.value)}
            onPressEnter={(event) => {
              if (!event.shiftKey) {
                event.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={sending}
            disabled={disabled || !input.trim()}
            onClick={handleSend}
          />
        </div>
      )}
    </div>
  )
}

export default ChatWindow
