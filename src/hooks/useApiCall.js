import { useState, useCallback } from 'react'
import { App } from 'antd'

/**
 * Parses FastAPI error responses into a human-readable string.
 * Handles string detail, array detail (validation), and network errors.
 *
 * @param {Error} err - Axios error object
 * @returns {string} Human-readable error message
 */
const parseApiError = (err) => {
  if (!err.response) {
    return 'Cannot reach the server. Please check your connection.'
  }
  const detail = err.response?.data?.detail
  if (!detail) return 'Something went wrong. Please try again.'
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg).join(', ')
  }
  return 'Something went wrong. Please try again.'
}

/**
 * Generic hook for wrapping async API calls with loading + error state.
 *
 * @param {Function} asyncFn - The async function to call
 * @returns {{ execute, loading, error, data }}
 *
 * @example
 * const { execute, loading, data } = useApiCall(jobService.getAll)
 * useEffect(() => { execute() }, [])
 */
function useApiCall(asyncFn) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [data, setData]       = useState(null)
  const { message } = App.useApp()

  const execute = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)
      try {
        const result = await asyncFn(...args)
        setData(result)
        return result
      } catch (err) {
        const msg = parseApiError(err)
        setError(msg)
        message.error(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [asyncFn, message],
  )

  return { execute, loading, error, data }
}

export default useApiCall
