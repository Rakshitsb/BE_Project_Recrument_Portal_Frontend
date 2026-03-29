import { useState, useCallback } from 'react'
import { App } from 'antd'

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
        const msg = err.response?.data?.message || err.message || 'An error occurred.'
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
