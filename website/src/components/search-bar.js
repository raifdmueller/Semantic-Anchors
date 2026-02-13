/**
 * SearchBar component with real-time text filtering.
 * Emits a custom 'filter-change' event on the document when value changes.
 */

/**
 * Render the search bar HTML.
 * @param {string} initialQuery - Initial search query from URL state
 * @returns {string} HTML string
 */
export function renderSearchBar(initialQuery = '') {
  return `
    <div class="relative flex-1 min-w-[200px] max-w-md">
      <label for="search-input" class="sr-only">Search anchors</label>
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
      </svg>
      <input
        id="search-input"
        type="search"
        value="${escapeHtml(initialQuery)}"
        placeholder="Search anchors by name, proponent, or tag..."
        class="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-10 pr-10 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
        autocomplete="off"
      />
      <button
        id="search-clear"
        class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors ${initialQuery ? '' : 'hidden'}"
        aria-label="Clear search"
        type="button"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `
}

/**
 * Initialize search bar event listeners.
 * @param {function} onSearch - Callback receiving the search query string
 */
export function initSearchBar(onSearch) {
  const input = document.querySelector('#search-input')
  const clearBtn = document.querySelector('#search-clear')
  if (!input) return

  let debounceTimer = null

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer)
    const value = input.value
    if (clearBtn) {
      clearBtn.classList.toggle('hidden', !value)
    }
    debounceTimer = setTimeout(() => {
      onSearch(value)
    }, 200)
  })

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = ''
      clearBtn.classList.add('hidden')
      onSearch('')
      input.focus()
    })
  }
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
