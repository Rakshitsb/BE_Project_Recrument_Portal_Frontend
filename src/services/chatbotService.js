import api from './api'

/**
 * Get all chatbot sessions for the logged-in candidate.
 * GET /chatbot/sessions
 * @returns {Promise<Array>} ChatSessionSummary objects
 */
export const getChatSessions = () =>
  api.get('/chatbot/sessions').then((r) => r.data)

/**
 * Get a full candidate chatbot session for a job, including messages.
 * GET /chatbot/sessions/{job_id}
 * @param {string} jobId
 * @returns {Promise<object>} Full chat session
 */
export const getChatSession = (jobId) =>
  api.get(`/chatbot/sessions/${jobId}`).then((r) => r.data)

/**
 * Send a candidate message to a job chatbot session.
 * POST /chatbot/sessions/{job_id}/message
 * @param {string} jobId
 * @param {string} content Message content, 1 to 1000 chars
 * @returns {Promise<object>} User and assistant messages
 */
export const sendMessage = (jobId, content) =>
  api.post(`/chatbot/sessions/${jobId}/message`, { content }).then((r) => r.data)

/**
 * Get HR chatbot sessions, optionally filtered by job.
 * GET /chatbot/hr/sessions?job_id={optional}
 * @param {string} [jobId]
 * @returns {Promise<Array>} HRSessionListItem objects
 */
export const getHRSessions = (jobId) =>
  api.get('/chatbot/hr/sessions', { params: jobId ? { job_id: jobId } : {} }).then((r) => r.data)

/**
 * Get a full HR-view chatbot session for a job and candidate.
 * GET /chatbot/hr/sessions/{job_id}/{candidate_id}
 * @param {string} jobId
 * @param {string} candidateId
 * @returns {Promise<object>} Full HR chat session
 */
export const getHRChatSession = (jobId, candidateId) =>
  api.get(`/chatbot/hr/sessions/${jobId}/${candidateId}`).then((r) => r.data)

/**
 * Enable chatbot access for a candidate on a job.
 * POST /chatbot/hr/sessions/{job_id}/{candidate_id}/enable
 * @param {string} jobId
 * @param {string} candidateId
 * @returns {Promise<object>} ChatbotStatusResponse
 */
export const enableChatbot = (jobId, candidateId) =>
  api.post(`/chatbot/hr/sessions/${jobId}/${candidateId}/enable`).then((r) => r.data)

/**
 * Disable chatbot access for a candidate on a job.
 * POST /chatbot/hr/sessions/{job_id}/{candidate_id}/disable
 * @param {string} jobId
 * @param {string} candidateId
 * @returns {Promise<object>} ChatbotStatusResponse
 */
export const disableChatbot = (jobId, candidateId) =>
  api.post(`/chatbot/hr/sessions/${jobId}/${candidateId}/disable`).then((r) => r.data)

/**
 * Send an HR message to a candidate chatbot session.
 * POST /chatbot/hr/sessions/{job_id}/{candidate_id}/send-message
 * @param {string} jobId
 * @param {string} candidateId
 * @param {{ message: string, interview_link?: string, interview_id?: string, message_type?: 'general'|'interview_invite' }} payload
 * @returns {Promise<object>} HR message response
 */
export const sendHRMessage = (jobId, candidateId, payload) =>
  api.post(`/chatbot/hr/sessions/${jobId}/${candidateId}/send-message`, payload).then((r) => r.data)
