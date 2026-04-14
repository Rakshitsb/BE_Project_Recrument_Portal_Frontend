import api from './api'

/**
 * AI utilities service
 */
export const aiService = {
  /**
   * Generate a cover letter for a given job id.
   * @param {string|number} jobId
   * @returns {Promise<string>} cover letter text
   */
  generateCoverLetter: async (jobId) => {
    const { data } = await api.post('/ai/generate-cover-letter', { job_id: String(jobId) })
    // Backend may return raw text or an object; normalize to string
    let text = ''
    if (typeof data === 'string') text = data
    else if (data?.cover_letter) text = data.cover_letter
    else if (data?.text) text = data.text
    else text = JSON.stringify(data)

    // Enforce 1000-word hard cap
    const words = text.trim().split(/\s+/).filter(Boolean)
    if (words.length > 1000) text = `${words.slice(0, 1000).join(' ')} …`
    return text
  },
}

export default aiService
