import { renderSearchBar } from './search-bar.js'
import { renderRoleFilter } from './role-filter.js'
import { renderFilteredResults } from './filtered-results.js'

/**
 * Render main content area with search, filters, and results.
 * @param {object} options
 * @param {Array} options.anchors - All anchor objects
 * @param {Array} options.roles - All role objects
 * @param {Array} options.filteredAnchors - Currently filtered anchors
 * @param {string} options.query - Current search query
 * @param {Array<string>} options.selectedRoles - Currently selected role IDs
 * @returns {string} HTML string
 */
export function renderMain(options = {}) {
  const {
    anchors = [],
    roles = [],
    filteredAnchors = [],
    query = '',
    selectedRoles = []
  } = options

  const hasData = anchors.length > 0

  return `
    <main class="flex-1">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-[var(--color-text)] mb-2">
            Explore Semantic Anchors
          </h2>
          <p class="text-[var(--color-text-secondary)]">
            A curated catalog of well-defined terms, methodologies, and frameworks
            for effective LLM communication.
          </p>
        </section>

        ${hasData ? `
          <section id="filters" class="mb-6 flex flex-wrap items-start gap-3">
            ${renderSearchBar(query)}
            ${renderRoleFilter(roles, selectedRoles)}
            <button
              id="clear-all-filters"
              type="button"
              class="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors ${query || selectedRoles.length > 0 ? '' : 'hidden'}"
            >Clear filters</button>
          </section>

          <section id="results-container">
            ${renderFilteredResults(filteredAnchors, roles)}
          </section>
        ` : `
          <section id="treemap-container" class="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4" style="min-height: 500px;">
            <div class="flex items-center justify-center h-full text-[var(--color-text-secondary)]">
              <p>Loading anchors...</p>
            </div>
          </section>
        `}
      </div>
    </main>
  `
}
