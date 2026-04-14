import { useState, useCallback } from 'react'
import { App } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import profileService from '../services/profileService'
import useProfileStore from '../store/profileStore'
import useAuthStore from '../store/authStore'
import { invalidateProfileCache } from './useProfile'

/**
 * useProfileSetup
 * Encapsulates all profile setup business logic:
 *  - Resume upload & parse
 *  - Avatar upload
 *  - Form auto-fill from parsed data
 *  - Final profile submission
 */
function useProfileSetup(form) {
  const { message } = App.useApp()
  const navigate    = useNavigate()

  const { setProfileData, updateField, profileData } = useProfileStore()
  const { updateUser }             = useAuthStore()

  const [resumeUploading, setResumeUploading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [submitting, setSubmitting]           = useState(false)
  const [resumeParsed, setResumeParsed]       = useState(false)

  /**
   * Upload resume → parse → auto-fill form fields
   */
  const handleResumeUpload = useCallback(
    async (file) => {
      setResumeUploading(true)
      setResumeParsed(false)
      try {
        const parsed = await profileService.uploadResume(file)

        const formData = {
          fullName:   parsed.full_name   || parsed.fullName   || '',
          email:      parsed.email       || '',
          phone:      parsed.phone       || '',
          location:   parsed.location    || '',
          skills:     Array.isArray(parsed.skills)
                      ? parsed.skills
                      : typeof parsed.skills === 'string'
                      ? parsed.skills.split(',').map((s) => s.trim())
                      : [],
          // education: AI returns array of { degree, institution, year }
          education:  Array.isArray(parsed.education)
                      ? parsed.education.map((e) => ({
                          degree:      e.degree      || '',
                          institution: e.institution || '',
                          year:        e.year        || '',
                        }))
                      : parsed.education
                      ? [{ degree: parsed.education, institution: '', year: '' }]
                      : [],
          // experience: AI returns array of { role/title, company, duration, description }
          experience: Array.isArray(parsed.experience)
                      ? parsed.experience.map((e) => ({
                          title:       e.title       || e.role  || '',
                          company:     e.company     || '',
                          duration:    e.duration    || '',
                          description: e.description || '',
                        }))
                      : [],
          // projects: AI returns array of { name, description }
          projects:   Array.isArray(parsed.projects)
                      ? parsed.projects.map((p) => ({
                          name:        p.name        || '',
                          description: p.description || '',
                        }))
                      : [],
          bio:        parsed.bio    || '',
          gender:     parsed.gender || '',
          dob:        parsed.dob ? dayjs(parsed.dob) : null,
        }

        setProfileData(formData)
        // resetFields is REQUIRED for Ant Design Form.List to re-render with
        // new array data after the form is already mounted.
        // Calling setFieldsValue alone does NOT update Form.List items.
        form.resetFields()
        form.setFieldsValue({ accountType: 'candidate', ...formData })
        setResumeParsed(true)
        message.success('✅ Resume parsed successfully! Please review and edit your details.')
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to parse resume. Please fill details manually.'
        message.error(msg)
      } finally {
        setResumeUploading(false)
      }
    },
    [form, setProfileData, message],
  )

  /**
   * Upload avatar image → store URL in profile data
   */
  const handleAvatarUpload = useCallback(
    async (file) => {
      setAvatarUploading(true)
      try {
        const result = await profileService.uploadAvatar(file)
        updateField('avatarUrl', result.url)
        message.success('Profile photo updated!')
      } catch {
        message.error('Failed to upload photo. Please try again.')
      } finally {
        setAvatarUploading(false)
      }
    },
    [updateField, message],
  )

  /**
   * Submit final profile data
   */
  const handleSubmit = useCallback(
    async (values) => {
      setSubmitting(true)
      try {
        // ── Serialize education array → readable string for backend ──
        const educationStr = Array.isArray(values.education)
          ? values.education
              .filter((e) => e?.degree)
              .map((e) => [
                  e.degree,
                  e.institution && `at ${e.institution}`,
                  e.year        && `(${e.year})`,
                ].filter(Boolean).join(' '))
              .join(' | ')
          : values.education || ''

        // ── Serialize experience array → readable string for backend ──
        const experienceStr = Array.isArray(values.experience)
          ? values.experience
              .filter((e) => e?.title)
              .map((e) => [
                  e.title,
                  e.company  && `at ${e.company}`,
                  e.duration && `(${e.duration})`,
                  e.description,
                ].filter(Boolean).join(' — '))
              .join(' | ')
          : values.experience || ''

        const payload = {
          fullName:  values.fullName   || '',
          email:     values.email      || '',
          phone:     values.phone      || '',
          location:  values.location   || '',
          skills:    values.skills     || [],
          education: educationStr,
          experience: experienceStr,
          bio:       values.bio        || null,
          resumeUrl: profileData.avatarUrl || null,
          dob:       values.dob
                     ? values.dob.format('YYYY-MM-DD')
                     : null,
          gender:    values.gender     || null,
        }

        await profileService.saveProfile(payload)

        // ── Bust the profile cache so CandidateProfile re-fetches immediately ──
        invalidateProfileCache()

        // ── Update user name in authStore ──
        updateUser({ name: values.fullName, profileCompleted: true })

        message.success('🎉 Profile created! Welcome to HireBase.')

        // ── Navigate to profile page to see created profile ──
        navigate('/candidate/profile', { replace: true })

      } catch (err) {
        const msg =
          err.response?.data?.detail?.[0]?.msg ||
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to save profile. Please try again.'
        message.error(msg)
      } finally {
        setSubmitting(false)
      }
    },
    [profileData.avatarUrl, updateUser, message, navigate],
  )

  return {
    handleResumeUpload,
    handleAvatarUpload,
    handleSubmit,
    resumeUploading,
    avatarUploading,
    submitting,
    resumeParsed,
  }
}

export default useProfileSetup
