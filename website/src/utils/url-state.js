/**
 * URL state management for filter persistence.
 * Reads/writes filter state to URL query parameters.
 */

/**
 * Read filter state from current URL.
 * @returns {{ query: string, roles: string[] }}
 */
export function readFiltersFromURL() {
  const params = new URLSearchParams(window.location.search)
  const query = params.get('q') || ''
  const rolesParam = params.get('roles') || ''
  const roles = rolesParam ? rolesParam.split(',').filter(Boolean) : []
  return { query, roles }
}

/**
 * Write filter state to URL without page reload.
 * @param {{ query: string, roles: string[] }} filters
 */
export function writeFiltersToURL(filters) {
  const params = new URLSearchParams()
  if (filters.query) {
    params.set('q', filters.query)
  }
  if (filters.roles && filters.roles.length > 0) {
    params.set('roles', filters.roles.join(','))
  }
  const newURL = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname
  window.history.replaceState(null, '', newURL)
}

/**
 * Parse filter params from a URL search string (testable without window).
 * @param {string} searchString - e.g. "?q=tdd&roles=developer,architect"
 * @returns {{ query: string, roles: string[] }}
 */
export function parseFiltersFromSearch(searchString) {
  const params = new URLSearchParams(searchString)
  const query = params.get('q') || ''
  const rolesParam = params.get('roles') || ''
  const roles = rolesParam ? rolesParam.split(',').filter(Boolean) : []
  return { query, roles }
}

/**
 * Serialize filters to a URL search string (testable without window).
 * @param {{ query: string, roles: string[] }} filters
 * @returns {string} URL search string (without leading ?)
 */
export function serializeFilters(filters) {
  const params = new URLSearchParams()
  if (filters.query) {
    params.set('q', filters.query)
  }
  if (filters.roles && filters.roles.length > 0) {
    params.set('roles', filters.roles.join(','))
  }
  return params.toString()
}
