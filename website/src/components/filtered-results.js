/**
 * FilteredResults component - displays filtered anchor cards.
 */

/**
 * Render filtered results as anchor cards.
 * @param {Array} anchors - Filtered anchor objects
 * @param {Array<{id: string, name: string}>} roles - All role objects (for display names)
 * @returns {string} HTML string
 */
export function renderFilteredResults(anchors, roles) {
  if (anchors.length === 0) {
    return renderEmptyState()
  }

  const roleMap = new Map(roles.map(r => [r.id, r.name]))
  const cards = anchors.map(anchor => renderAnchorCard(anchor, roleMap)).join('')

  return `
    <div id="filtered-results">
      <div class="mb-4 flex items-center justify-between">
        <p class="text-sm text-[var(--color-text-secondary)]">
          <span id="result-count">${anchors.length}</span> anchor${anchors.length !== 1 ? 's' : ''} found
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        ${cards}
      </div>
    </div>
  `
}

function renderAnchorCard(anchor, roleMap) {
  const roleTags = anchor.roles
    .slice(0, 3)
    .map(roleId => {
      const name = roleMap.get(roleId) || roleId
      return `<span class="inline-block rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs text-[var(--color-primary)]">${name}</span>`
    })
    .join('')

  const extraRoles = anchor.roles.length > 3
    ? `<span class="text-xs text-[var(--color-text-secondary)]">+${anchor.roles.length - 3} more</span>`
    : ''

  const proponents = anchor.proponents.length > 0
    ? `<p class="text-xs text-[var(--color-text-secondary)] mt-1 truncate" title="${escapeAttr(anchor.proponents.join(', '))}">${anchor.proponents.join(', ')}</p>`
    : ''

  return `
    <article class="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 hover:border-[var(--color-primary)]/50 hover:shadow-sm transition-all cursor-pointer anchor-card" data-anchor-id="${anchor.id}">
      <h3 class="text-sm font-semibold text-[var(--color-text)] mb-2 line-clamp-2">${anchor.title}</h3>
      ${proponents}
      <div class="mt-3 flex flex-wrap gap-1 items-center">
        ${roleTags}
        ${extraRoles}
      </div>
    </article>
  `
}

function renderEmptyState() {
  return `
    <div id="filtered-results">
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <svg class="h-12 w-12 text-[var(--color-text-secondary)] mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
        </svg>
        <h3 class="text-lg font-medium text-[var(--color-text)] mb-1">No anchors found</h3>
        <p class="text-sm text-[var(--color-text-secondary)] mb-4">Try adjusting your search or filter criteria.</p>
        <button
          id="clear-all-filters"
          type="button"
          class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] transition-colors"
        >Clear all filters</button>
      </div>
    </div>
  `
}

function escapeAttr(text) {
  return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
