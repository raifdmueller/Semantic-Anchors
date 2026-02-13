/**
 * RoleFilter component with multi-select dropdown for 12 professional roles.
 */

/**
 * Render the role filter HTML.
 * @param {Array<{id: string, name: string}>} roles - Array of role objects
 * @param {Array<string>} selectedRoles - Currently selected role IDs
 * @returns {string} HTML string
 */
export function renderRoleFilter(roles, selectedRoles = []) {
  const selectedCount = selectedRoles.length
  const buttonLabel = selectedCount > 0
    ? `${selectedCount} role${selectedCount > 1 ? 's' : ''} selected`
    : 'All Roles'

  const roleCheckboxes = roles.map(role => {
    const checked = selectedRoles.includes(role.id) ? 'checked' : ''
    const anchorCount = role.anchors ? role.anchors.length : 0
    return `
      <label class="flex items-center gap-2 px-3 py-2 hover:bg-[var(--color-bg-secondary)] cursor-pointer rounded transition-colors">
        <input
          type="checkbox"
          value="${role.id}"
          ${checked}
          class="role-checkbox rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] h-4 w-4 accent-[var(--color-primary)]"
        />
        <span class="text-sm text-[var(--color-text)] flex-1">${role.name}</span>
        <span class="text-xs text-[var(--color-text-secondary)]">${anchorCount}</span>
      </label>
    `
  }).join('')

  return `
    <div class="relative" id="role-filter-container">
      <button
        id="role-filter-toggle"
        type="button"
        class="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors"
        aria-expanded="false"
        aria-haspopup="true"
      >
        <svg class="h-4 w-4 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
        <span id="role-filter-label">${buttonLabel}</span>
        <svg class="h-4 w-4 text-[var(--color-text-secondary)] transition-transform" id="role-filter-chevron" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div
        id="role-filter-dropdown"
        class="hidden absolute z-10 mt-1 w-80 max-h-80 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] shadow-lg"
      >
        <div class="p-2 border-b border-[var(--color-border)] flex justify-between items-center">
          <span class="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Filter by Role</span>
          <button
            id="role-clear-all"
            type="button"
            class="text-xs text-[var(--color-primary)] hover:underline ${selectedCount > 0 ? '' : 'hidden'}"
          >Clear all</button>
        </div>
        <div class="p-1">
          ${roleCheckboxes}
        </div>
      </div>
    </div>
  `
}

/**
 * Initialize role filter event listeners.
 * @param {function} onRolesChange - Callback receiving array of selected role IDs
 */
export function initRoleFilter(onRolesChange) {
  const container = document.querySelector('#role-filter-container')
  const toggle = document.querySelector('#role-filter-toggle')
  const dropdown = document.querySelector('#role-filter-dropdown')
  const clearAll = document.querySelector('#role-clear-all')
  const label = document.querySelector('#role-filter-label')
  const chevron = document.querySelector('#role-filter-chevron')

  if (!container || !toggle || !dropdown) return

  toggle.addEventListener('click', () => {
    const isOpen = !dropdown.classList.contains('hidden')
    dropdown.classList.toggle('hidden')
    toggle.setAttribute('aria-expanded', String(!isOpen))
    if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)'
  })

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      dropdown.classList.add('hidden')
      toggle.setAttribute('aria-expanded', 'false')
      if (chevron) chevron.style.transform = ''
    }
  })

  // Handle checkbox changes
  dropdown.addEventListener('change', (e) => {
    if (e.target.classList.contains('role-checkbox')) {
      const selected = getSelectedRoles()
      updateLabel(label, clearAll, selected.length)
      onRolesChange(selected)
    }
  })

  // Clear all button
  if (clearAll) {
    clearAll.addEventListener('click', () => {
      dropdown.querySelectorAll('.role-checkbox').forEach(cb => { cb.checked = false })
      updateLabel(label, clearAll, 0)
      onRolesChange([])
    })
  }
}

function getSelectedRoles() {
  return Array.from(document.querySelectorAll('.role-checkbox:checked'))
    .map(cb => cb.value)
}

function updateLabel(label, clearAll, count) {
  if (label) {
    label.textContent = count > 0
      ? `${count} role${count > 1 ? 's' : ''} selected`
      : 'All Roles'
  }
  if (clearAll) {
    clearAll.classList.toggle('hidden', count === 0)
  }
}
