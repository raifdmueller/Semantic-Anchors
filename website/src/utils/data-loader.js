/**
 * Data loader for fetching anchor and role data.
 * Caches loaded data to avoid duplicate fetches.
 */

let anchorsCache = null
let rolesCache = null

/**
 * Load anchors data from JSON.
 * @returns {Promise<Array>} Array of anchor objects
 */
export async function loadAnchors() {
  if (anchorsCache) return anchorsCache
  const response = await fetch('./data/anchors.json')
  anchorsCache = await response.json()
  return anchorsCache
}

/**
 * Load roles data from JSON.
 * @returns {Promise<Array>} Array of role objects
 */
export async function loadRoles() {
  if (rolesCache) return rolesCache
  const response = await fetch('./data/roles.json')
  rolesCache = await response.json()
  return rolesCache
}

/**
 * Load all data needed for the application.
 * @returns {Promise<{ anchors: Array, roles: Array }>}
 */
export async function loadAllData() {
  const [anchors, roles] = await Promise.all([loadAnchors(), loadRoles()])
  return { anchors, roles }
}

/** Reset cache (useful for testing). */
export function resetCache() {
  anchorsCache = null
  rolesCache = null
}
