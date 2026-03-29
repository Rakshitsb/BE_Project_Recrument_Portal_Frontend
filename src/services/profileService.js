import api from './api'

// ── Mock parsed resume data (used when no backend is connected) ───
const MOCK_PARSED_RESUME = {
  fullName:   'Alice Johnson',
  email:      'alice.johnson@example.com',
  phone:      '+91 98765 43210',
  skills:     ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS'],
  education:  'B.Tech Computer Science — IIT Delhi (2018–2022)',
  experience: '2 years at TechCorp as Frontend Developer',
  gender:     'female',
  dob:        '1999-07-15',
}

export const profileService = {
  /**
   * Upload resume file → backend parses → returns structured JSON.
   * Falls back to mock data if backend is unavailable.
   *
   * @param {File} file
   * @returns {Promise<Object>} Parsed profile data
   */
  uploadResume: async (file) => {
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const { data } = await api.post('/candidate/resume/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      })
      return data
    } catch (err) {
      // If network error (no backend), return mock data for demo
      if (!err.response) {
        await new Promise((r) => setTimeout(r, 1800)) // simulate processing
        return MOCK_PARSED_RESUME
      }
      throw err
    }
  },

  /**
   * Save the completed candidate profile.
   *
   * @param {Object} profileData
   * @returns {Promise<Object>}
   */
  saveProfile: async (profileData) => {
    try {
      const { data } = await api.post('/candidate/profile', profileData)
      return data
    } catch (err) {
      if (!err.response) {
        await new Promise((r) => setTimeout(r, 800)) // simulate save
        return { success: true, message: 'Profile saved (demo mode)' }
      }
      throw err
    }
  },

  /**
   * Upload profile avatar image.
   *
   * @param {File} file
   * @returns {Promise<{ url: string }>}
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const { data } = await api.post('/candidate/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    } catch (err) {
      if (!err.response) {
        // Return a local object URL for demo
        return { url: URL.createObjectURL(file) }
      }
      throw err
    }
  },
}

export default profileService
