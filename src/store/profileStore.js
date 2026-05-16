import { create } from 'zustand'

/**
 * Profile Store
 * Manages candidate profile form data during profile setup.
 */
const useProfileStore = create((set) => ({
  profileData: {
    fullName:    '',
    email:       '',
    phone:       '',
    dob:         null,
    gender:      '',
    skills:      [],
    education:   '',
    experience:  '',
    avatarUrl:   '',
    avatarPublicId: '',
    resumeUrl:   '',
  },

  /** Replace entire profile data (e.g. after resume parse) */
  setProfileData: (data) =>
    set((state) => ({
      profileData: { ...state.profileData, ...data },
    })),

  /** Update a single field */
  updateField: (field, value) =>
    set((state) => ({
      profileData: { ...state.profileData, [field]: value },
    })),

  /** Reset profile to initial empty state */
  resetProfile: () =>
    set({
      profileData: {
        fullName:    '',
        email:       '',
        phone:       '',
        dob:         null,
        gender:      '',
        skills:      [],
        education:   '',
        experience:  '',
        avatarUrl:   '',
        avatarPublicId: '',
        resumeUrl:   '',
      },
    }),
}))

export default useProfileStore
