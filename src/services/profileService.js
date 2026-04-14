import api from './api'

// Mock parsed resume data (used when no backend is connected)
const MOCK_PARSED_RESUME = {
  fullName:   'Alice Johnson',
  email:      'alice.johnson@example.com',
  phone:      '+91 98765 43210',
  skills:     ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS'],
  education:  'B.Tech Computer Science - IIT Delhi (2018-2022)',
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
  education: 'B.Tech Computer Science - IIT Delhi (2018-2022)',
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
   */
  uploadResume: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file) // backend expects "file"

      const { data } = await api.post('/ai/parse-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      })

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
        gender:     data.gender      || data.sex || '',
        dob:        data.dob         || data.date_of_birth || null,
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const detail = err.response.data?.detail
        const msg = Array.isArray(detail)
          ? detail.map((d) => d.msg).join(', ')
          : 'Invalid file format'
        throw new Error(msg)
      }

      // No backend connection — fall back to mock data
      if (!err.response) {
        await delay(1800)
        return MOCK_PARSED_RESUME
      }
      throw err
    }
  },

  /**
   * Save the completed candidate profile.
   * Sends both dob and date_of_birth to match backend variations.
   */
  saveProfile: async (profileData) => {
    try {
      const dob = profileData.dob || profileData.date_of_birth || null

      const payload = {
        full_name:        profileData.fullName   || profileData.full_name || '',
        email:            profileData.email      || null,
        phone:            profileData.phone      || '',
        location:         profileData.location   || '',
        skills:           profileData.skills     || [],
        experience_years: parseFloat(profileData.experience_years)
                          || parseFloat(profileData.experience)
                          || 0,
        education:        profileData.education  || '',
        resume_url:       profileData.resumeUrl  || null,
        bio:              profileData.bio        || null,
        gender:           profileData.gender     || null,
        dob,
        date_of_birth:    dob,
      }

      const { data } = await api.post('/candidate/profile', payload)
      return data
    } catch (err) {
      if (!err.response) {
        await delay(800)
        return { success: true, message: 'Profile saved (demo mode)' }
      }
      throw err
    }
  },

  /**
   * Upload profile avatar image.
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
        return { url: URL.createObjectURL(file) }
      }
      throw err
    }
  },

  /**
   * Fetch the current candidate's profile.
   */
  getProfile: async (token) => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined
      const { data } = await api.get('/candidate/profile', config)
      const dob = data.dob || data.date_of_birth || data.dateOfBirth || null
      const email = data.email || data.user_email || data.user?.email || null
      const gender = data.gender ?? data.sex ?? data.gender_identity ?? null
      return {
        ...data,
        fullName:         data.full_name,
        experienceYears:  data.experience_years,
        resumeUrl:        data.resume_url,
        avatarUrl:        data.avatar_url,
        createdAt:        data.created_at,
        dob,
        gender,
        email,
      }
    } catch (err) {
      if (!err.response) {
        await delay(600)
        return MOCK_PROFILE
      }
      throw err
    }
  },

  /**
   * Update the current candidate's profile.
   */
  updateProfile: async (profileData) => {
    try {
      const dob = profileData.dob || profileData.date_of_birth || null

      const payload = {
        full_name:        profileData.full_name  || profileData.fullName  || '',
        email:            profileData.email      || profileData.user_email || null,
        phone:            profileData.phone      || '',
        location:         profileData.location   || '',
        gender:           profileData.gender     || null,
        dob,
        date_of_birth:    dob,
        skills:           profileData.skills     || [],
        experience_years: parseFloat(profileData.experience_years)
                          || parseFloat(profileData.experienceYears)
                          || 0,
        education:        profileData.education  || '',
        bio:              profileData.bio        || null,
        resume_url:       profileData.resume_url
                          || profileData.resumeUrl
                          || null,
      }

      const { data } = await api.put('/candidate/profile', payload)
      const normalizedDob = data.dob || data.date_of_birth || data.dateOfBirth || dob
      const normalizedGender = data.gender ?? data.sex ?? payload.gender ?? profileData.gender ?? null
      const normalizedEmail = data.email || data.user_email || payload.email || profileData.email || null
      return {
        ...data,
        fullName:        data.full_name,
        experienceYears: data.experience_years,
        resumeUrl:       data.resume_url,
        avatarUrl:       data.avatar_url,
        createdAt:       data.created_at,
        dob:             normalizedDob,
        gender:          normalizedGender,
        email:           normalizedEmail,
      }
    } catch (err) {
      if (!err.response) {
        await delay(800)
        return { ...MOCK_PROFILE, ...profileData, updated: true }
      }
      throw err
    }
  },
}

export default profileService
