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

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const MOCK_PROFILE = {
  id: 'candidate_1',
  user_id: 'user_1',
  full_name: 'Alice Johnson',
  email: 'alice.johnson@example.com',
  phone: '+91 98765 43210',
  location: 'Pune, Maharashtra',
  skills: ['React', 'TypeScript', 'Node.js', 'JavaScript', 'CSS'],
  experience_years: 2.5,
  education: 'B.Tech Computer Science — IIT Delhi (2018–2022)',
  bio: 'Passionate frontend developer with 2+ years building scalable web apps.',
  resume_url: null,
  avatar_url: null,
  gender: 'female',
  dob: '1999-07-15',
  created_at: '2026-01-10',
}

export const profileService = {
  /**
   * Upload resume file → AI parser → returns structured profile data.
   * Endpoint: POST /ai/parse-resume
   * Falls back to mock data if backend is unavailable.
   *
   * @param {File} file - Resume file (PDF/DOC/DOCX/TXT)
   * @returns {Promise<Object>} Parsed profile fields (camelCase)
   */
  uploadResume: async (file) => {
    try {
      const formData = new FormData()
      // ── Field name must be "file" as required by /ai/parse-resume ──
      formData.append('file', file)

      const { data } = await api.post('/ai/parse-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // AI parsing can take longer — 60s timeout
      })

      // ── Normalise response: backend returns snake_case ──
      // Map to camelCase for useProfileSetup hook compatibility
      return {
        fullName:   data.full_name   || data.fullName   || '',
        email:      data.email       || '',
        phone:      data.phone       || '',
        skills:     Array.isArray(data.skills)
                    ? data.skills
                    : typeof data.skills === 'string'
                    ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
                    : [],
        education:  data.education   || '',
        experience: data.experience  || '',
        gender:     data.gender      || '',
        dob:        data.dob         || null,
      }

    } catch (err) {
      // ── Handle FastAPI 422 Validation Error ──
      if (err.response?.status === 422) {
        const detail = err.response.data?.detail
        const msg = Array.isArray(detail)
          ? detail.map((d) => d.msg).join(', ')
          : 'Invalid file format'
        throw new Error(msg)
      }

      // ── No backend connection → fall back to mock data ──
      if (!err.response) {
        await new Promise((r) => setTimeout(r, 1800))
        return MOCK_PARSED_RESUME
      }

      throw err
    }
  },

  // ── Field mapping: frontend camelCase → backend snake_case ──
  /**
   * Save the completed candidate profile.
   * Transforms camelCase form fields to snake_case before sending.
   *
   * @param {Object} profileData - camelCase form values from ProfileSetupPage
   * @returns {Promise<Object>}
   */
  saveProfile: async (profileData) => {
    try {
      // ── Transform camelCase form fields → snake_case backend fields ──
      const payload = {
        full_name:        profileData.fullName   || profileData.full_name || '',
        email:            profileData.email       || null,
        phone:            profileData.phone       || '',
        location:         profileData.location    || '',
        skills:           profileData.skills      || [],
        experience_years: parseFloat(profileData.experience_years)
                          || parseFloat(profileData.experience)
                          || 0,
        education:        profileData.education   || '',
        resume_url:       profileData.resumeUrl   || null,
        bio:              profileData.bio         || null,
        gender:           profileData.gender      || null,
        dob:              profileData.dob         || null,
      }

      const { data } = await api.post('/candidate/profile', payload)
      return data

    } catch (err) {
      if (!err.response) {
        // No backend connection — mock success for demo/dev
        await new Promise((r) => setTimeout(r, 800))
        return { success: true, message: 'Profile saved (demo mode)' }
      }
      throw err
    }
  },
  // ── TODO: avatar upload to be handled separately later ──

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

  // ── Field mapping: backend snake_case → frontend camelCase ──
  /**
   * Fetch the current candidate's profile.
   * Transforms snake_case backend fields to camelCase for the frontend.
   *
   * @returns {Promise<Object>} Candidate profile data (camelCase)
   */
  getProfile: async () => {
    try {
      const { data } = await api.get('/candidate/profile')
      // ── Transform snake_case backend fields → camelCase frontend fields ──
      return {
        ...data,
        fullName:         data.full_name,
        experienceYears:  data.experience_years,
        resumeUrl:        data.resume_url,
        avatarUrl:        data.avatar_url,
        createdAt:        data.created_at,
      }
    } catch (err) {
      if (!err.response) {
        await new Promise((r) => setTimeout(r, 600))
        return MOCK_PROFILE
      }
      throw err
    }
  },

  /**
   * Update the current candidate's profile.
   * Transforms camelCase → snake_case before sending,
   * and normalises the response back to camelCase.
   *
   * @param {Object} profileData - Fields to update (camelCase)
   * @returns {Promise<Object>} Updated profile data (camelCase)
   */
  updateProfile: async (profileData) => {
    try {
      // ── Transform camelCase → snake_case before sending ──
      const payload = {
        full_name:        profileData.full_name  || profileData.fullName  || '',
        email:            profileData.email       || null,
        phone:            profileData.phone       || '',
        location:         profileData.location    || '',
        gender:           profileData.gender      || null,
        dob:              profileData.dob         || null,
        skills:           profileData.skills      || [],
        experience_years: parseFloat(profileData.experience_years)
                          || parseFloat(profileData.experienceYears)
                          || 0,
        education:        profileData.education   || '',
        bio:              profileData.bio         || null,
        resume_url:       profileData.resume_url
                          || profileData.resumeUrl
                          || null,
      }

      const { data } = await api.put('/candidate/profile', payload)
      return {
        ...data,
        fullName:        data.full_name,
        experienceYears: data.experience_years,
        resumeUrl:       data.resume_url,
        avatarUrl:       data.avatar_url,
        createdAt:       data.created_at,
      }

    } catch (err) {
      if (!err.response) {
        await new Promise((r) => setTimeout(r, 800))
        return { ...MOCK_PROFILE, ...profileData, updated: true }
      }
      throw err
    }
  },
}

export default profileService
