import { useCallback, useEffect, useState } from 'react'

import { getChatSession, sendMessage as sendMessageAPI } from '../services/chatbotService'
import useAuthStore from '../store/authStore'

const getLoadErrorMessage = (error) => {
  if (error.response?.status === 403) {
    return 'Chatbot is not yet enabled for this application. It will be enabled when you are shortlisted.'
  }

  if (error.response?.status === 404) {
    return 'No chat session found for this job.'
  }

  return 'Failed to load chat. Please try again.'
}

function useChatbot(jobId) {
  const { isAuthenticated } = useAuthStore()
  const [messages, setMessages] = useState([])
  const [sessionInfo, setSessionInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const applySession = useCallback((session) => {
    if (Array.isArray(session?.messages)) {
      setMessages(session.messages)
      setSessionInfo(session)
    }
  }, [])

  const loadSession = useCallback(async () => {
    if (!jobId || !isAuthenticated) return

    setLoading(true)
    setError(null)

    try {
      const session = await getChatSession(jobId)
      applySession(session)
    } catch (err) {
      setError(getLoadErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [applySession, isAuthenticated, jobId])

  const refreshSession = useCallback(async () => {
    if (!jobId || !isAuthenticated) return

    try {
      const session = await getChatSession(jobId)
      applySession(session)
    } catch {
      // Keep the current chat visible during background refresh failures.
    }
  }, [applySession, isAuthenticated, jobId])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  const sendMessage = useCallback(
    async (content) => {
      const trimmed = content.trim()
      if (!jobId || trimmed.length < 1 || trimmed.length > 1000) return

      const tempMessage = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      }

      setSending(true)
      setError(null)
      setMessages((prev) => [...prev, tempMessage])

      try {
        const response = await sendMessageAPI(jobId, trimmed)
        setMessages((prev) => [
          ...prev.filter((message) => message.id !== tempMessage.id),
          response.user_message,
          response.assistant_message,
        ])
      } catch {
        setMessages((prev) => prev.filter((message) => message.id !== tempMessage.id))
        setError('Failed to send message. Please try again.')
      } finally {
        setSending(false)
      }
    },
    [jobId],
  )

  return {
    messages,
    sessionInfo,
    loading,
    sending,
    error,
    sendMessage,
    refreshSession,
  }
}

export default useChatbot
