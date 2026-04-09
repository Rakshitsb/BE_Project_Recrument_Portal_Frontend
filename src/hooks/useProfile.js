import { useState, useEffect, useCallback, useRef } from 'react'
import profileService from '../services/profileService'

/**
 * Module-level singleton cache.
 * Shared across ALL useProfile() hook instances so:
 *  - CandidateProfile and EditProfile see the same data
 *  - Only ONE network fetch happens even when multiple components mount
 *  - After EditProfile saves, CandidateProfile instantly reflects changes
 */
let _profile   = null          // cached profile object (or null = no profile)
let _loading   = true          // starts true → skeleton on first render, no flash
let _error     = null          // error string or null
let _listeners = new Set()     // all active hook instances

/** Notify every mounted hook instance to re-render */
function _notify() {
  _listeners.forEach((fn) => fn())
}

/** Global fetch — only one in-flight at a time */
let _fetching = false
async function _fetchProfile() {
  if (_fetching) return
  _fetching = true
  _loading  = true
  _error    = null
  _notify()
  try {
    const data = await profileService.getProfile()
    _profile  = data
    _error    = null
  } catch (err) {
    if (err.response?.status === 404) {
      _profile = null   // no profile yet → empty state
      _error   = null
    } else {
      _error   = err.message ?? 'Failed to load profile'
    }
  } finally {
    _loading  = false
    _fetching = false
    _notify()
  }
}

/** Global update — patches singleton + notifies all instances */
async function _updateProfile(formData) {
  const updatedData = await profileService.updateProfile(formData)
  _profile = updatedData
  _error   = null
  _notify()
  return updatedData
}

/** Force a fresh refetch (e.g. after profile creation) */
export function invalidateProfileCache() {
  _profile  = null
  _loading  = true
  _error    = null
  _notify()
  _fetchProfile()
}

// internal alias used by the hook
const _invalidate = invalidateProfileCache

/**
 * useProfile hook
 *
 * Returns live profile state from the shared singleton.
 * All mounted consumers (CandidateProfile, EditProfile, etc.)
 * automatically re-render when any one of them updates the profile.
 */
function useProfile() {
  // Trigger local re-render when singleton changes
  const [, rerender] = useState(0)
  const [updating, setUpdating] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    const tick = () => { if (mounted.current) rerender((n) => n + 1) }
    _listeners.add(tick)

    // Kick off initial fetch; _fetching flag prevents duplicate in-flight calls
    if (!_fetching) {
      _fetchProfile()
    }

    return () => {
      mounted.current = false
      _listeners.delete(tick)
    }
  }, [])

  const fetchProfile = useCallback(() => {
    _invalidate()
  }, [])

  const updateProfile = useCallback(async (formData) => {
    setUpdating(true)
    try {
      return await _updateProfile(formData)
    } finally {
      if (mounted.current) setUpdating(false)
    }
  }, [])

  return {
    profile:       _profile,
    loading:       _loading,
    error:         _error,
    updating,
    fetchProfile,
    updateProfile,
  }
}

export default useProfile
