import { useState, useCallback } from 'react'
import { App } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import profileService from '../services/profileService'
import useProfileStore from '../store/profileStore'
import useAuthStore from '../store/authStore'

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
  const { updateUser }                               = useAuthStore()

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

        // Normalise skills: ensure it's always an array
        const skills = Array.isArray(parsed.skills)
          ? parsed.skills
          : typeof parsed.skills === 'string'
          ? parsed.skills.split(',').map((s) => s.trim())
          : []

        const formData = {
          fullName:   parsed.fullName   || '',
          email:      parsed.email      || '',
          phone:      parsed.phone      || '',
          skills,
          education:  parsed.education  || '',
          experience: parsed.experience || '',
          gender:     parsed.gender     || '',
          dob:        parsed.dob        ? dayjs(parsed.dob) : null,
        }

        setProfileData(formData)
        form.setFieldsValue(formData)
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
        const payload = {
          ...values,
          dob:        values.dob ? values.dob.format('YYYY-MM-DD') : null,
          avatarUrl:  profileData.avatarUrl,
          skills:     values.skills || [],
        }

        await profileService.saveProfile(payload)

        // Mark profile as complete in auth store
        updateUser({ profileCompleted: true, name: values.fullName })

        message.success('🎉 Profile saved successfully! Welcome to HireBase.')
        navigate('/candidate/jobs', { replace: true })
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to save profile. Please try again.'
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
