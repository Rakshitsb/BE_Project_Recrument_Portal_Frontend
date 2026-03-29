/**
 * Format a date string to a human-readable format.
 * @param {string} dateStr - ISO date string
 * @param {string} [locale='en-US']
 */
export const formatDate = (dateStr, locale = 'en-US') => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString(locale, {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

/**
 * Truncate a string to the specified length.
 * @param {string} str
 * @param {number} [maxLength=100]
 */
export const truncate = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str
  return str.slice(0, maxLength) + '…'
}

/**
 * Capitalise the first letter of a string.
 * @param {string} str
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Debounce a function call.
 * @param {Function} fn
 * @param {number} delay - milliseconds
 */
export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Generate initials from a full name.
 * @param {string} name
 */
export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
