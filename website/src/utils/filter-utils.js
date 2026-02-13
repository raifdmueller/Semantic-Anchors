/**
 * Filter utilities for searching and filtering semantic anchors.
 * Pure functions for easy testing.
 */

/**
 * Filter anchors by text search query.
 * Searches title, proponents, and tags (case-insensitive).
 * @param {Array} anchors - Array of anchor objects
 * @param {string} query - Search query string
 * @returns {Array} Filtered anchors
 */
export function filterByText(anchors, query) {
  if (!query || !query.trim()) return anchors
  const terms = query.toLowerCase().trim().split(/\s+/)
  return anchors.filter(anchor => {
    const searchable = [
      anchor.title,
      ...anchor.proponents,
      ...anchor.tags,
      anchor.id
    ].join(' ').toLowerCase()
    return terms.every(term => searchable.includes(term))
  })
}

/**
 * Filter anchors by selected roles (OR logic - anchor matches if it has ANY selected role).
 * @param {Array} anchors - Array of anchor objects
 * @param {Array<string>} selectedRoles - Array of role IDs
 * @returns {Array} Filtered anchors
 */
export function filterByRoles(anchors, selectedRoles) {
  if (!selectedRoles || selectedRoles.length === 0) return anchors
  return anchors.filter(anchor =>
    anchor.roles.some(role => selectedRoles.includes(role))
  )
}

/**
 * Apply all filters (text + roles) to anchors.
 * @param {Array} anchors - Array of anchor objects
 * @param {object} filters - { query: string, roles: string[] }
 * @returns {Array} Filtered anchors
 */
export function applyFilters(anchors, filters) {
  let result = anchors
  if (filters.query) {
    result = filterByText(result, filters.query)
  }
  if (filters.roles && filters.roles.length > 0) {
    result = filterByRoles(result, filters.roles)
  }
  return result
}
