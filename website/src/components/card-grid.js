import { i18n } from '../i18n.js'

/**
 * Category color palette (matching previous categories)
 */
const CATEGORY_COLORS = {
  'communication-presentation': '#5470c6',
  'design-principles': '#91cc75',
  'development-workflow': '#fac858',
  'dialogue-interaction': '#ee6666',
  'documentation': '#73c0de',
  'meta': '#3ba272',
  'problem-solving': '#fc8452',
  'requirements-engineering': '#9a60b4',
  'software-architecture': '#ea7ccc',
  'statistical-methods': '#48b8d0',
  'strategic-planning': '#c23531',
  'testing-quality': '#5470c6'
}

/**
 * Render the complete card grid
 */
export function renderCardGrid(categories, anchors) {
  if (!categories || !anchors) return '<div>Loading...</div>'

  return `
    <div class="card-grid-container">
      ${categories.map(category => renderCategorySection(category, anchors)).join('')}
    </div>
  `
}

/**
 * Render a single category section with its anchors
 */
function renderCategorySection(category, allAnchors) {
  const categoryAnchors = allAnchors.filter(anchor =>
    anchor.categories && anchor.categories.includes(category.id)
  )

  if (categoryAnchors.length === 0) return ''

  const color = CATEGORY_COLORS[category.id] || '#5470c6'

  return `
    <section class="category-section" data-category="${category.id}">
      <h2 class="category-heading">
        <span class="category-icon" style="background-color: ${color}"></span>
        <span data-i18n="categories.${category.id}">${category.name}</span>
      </h2>

      <div class="anchor-cards-grid">
        ${categoryAnchors.map(anchor => renderAnchorCard(anchor, color)).join('')}
      </div>
    </section>
  `
}

/**
 * Render a single anchor card
 */
function renderAnchorCard(anchor, categoryColor) {
  const rolesCount = anchor.roles ? anchor.roles.length : 0
  const tagsPreview = anchor.tags ? anchor.tags.slice(0, 3).join(', ') : ''

  return `
    <article
      class="anchor-card"
      data-anchor="${anchor.id}"
      data-roles="${anchor.roles ? anchor.roles.join(',') : ''}"
      data-tags="${anchor.tags ? anchor.tags.join(',') : ''}"
      tabindex="0"
      role="button"
      aria-label="Open ${anchor.title} details"
    >
      <h3 class="anchor-card-title">${anchor.title}</h3>

      ${anchor.proponents ? `
        <p class="anchor-card-proponents">${anchor.proponents.slice(0, 2).join(', ')}</p>
      ` : ''}

      <div class="anchor-card-meta">
        ${rolesCount > 0 ? `
          <span class="meta-badge">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            ${rolesCount} ${rolesCount === 1 ? 'role' : 'roles'}
          </span>
        ` : ''}

        ${anchor.tags && anchor.tags.length > 0 ? `
          <span class="meta-badge">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            ${anchor.tags.length} tags
          </span>
        ` : ''}
      </div>

      <div class="anchor-card-indicator" style="background-color: ${categoryColor}"></div>
    </article>
  `
}

/**
 * Initialize card grid event handlers
 */
export function initCardGrid() {
  const container = document.getElementById('main-content')
  if (!container) return

  // Click handler using event delegation
  container.addEventListener('click', (e) => {
    const card = e.target.closest('.anchor-card')
    if (card) {
      const anchorId = card.dataset.anchor
      const event = new CustomEvent('anchor-selected', {
        detail: { anchorId }
      })
      document.dispatchEvent(event)
    }
  })

  // Keyboard handler (Enter/Space on focused card)
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.anchor-card')
      if (card) {
        e.preventDefault()
        const anchorId = card.dataset.anchor
        const event = new CustomEvent('anchor-selected', {
          detail: { anchorId }
        })
        document.dispatchEvent(event)
      }
    }
  })
}

/**
 * Filter cards by role
 */
export function filterCardsByRole(roleId) {
  const cards = document.querySelectorAll('.anchor-card')
  const sections = document.querySelectorAll('.category-section')

  cards.forEach(card => {
    const roles = card.dataset.roles.split(',').filter(Boolean)
    const matches = !roleId || roles.includes(roleId)
    card.style.display = matches ? 'block' : 'none'
  })

  // Hide empty sections
  sections.forEach(section => {
    const visibleCards = Array.from(section.querySelectorAll('.anchor-card'))
      .filter(card => card.style.display !== 'none')
    section.style.display = visibleCards.length > 0 ? 'block' : 'none'
  })
}

/**
 * Filter cards by search query
 */
export function filterCardsBySearch(query) {
  if (!query || query.trim() === '') {
    // Show all
    document.querySelectorAll('.anchor-card, .category-section').forEach(el => {
      el.style.display = 'block'
    })
    return
  }

  const lowerQuery = query.toLowerCase().trim()
  const cards = document.querySelectorAll('.anchor-card')
  const sections = document.querySelectorAll('.category-section')

  cards.forEach(card => {
    const title = card.querySelector('.anchor-card-title').textContent.toLowerCase()
    const tags = card.dataset.tags.toLowerCase()
    const anchorId = card.dataset.anchor.toLowerCase()

    const matches = title.includes(lowerQuery) ||
                    tags.includes(lowerQuery) ||
                    anchorId.includes(lowerQuery)

    card.style.display = matches ? 'block' : 'none'
  })

  // Hide empty sections
  sections.forEach(section => {
    const visibleCards = Array.from(section.querySelectorAll('.anchor-card'))
      .filter(card => card.style.display !== 'none')
    section.style.display = visibleCards.length > 0 ? 'block' : 'none'
  })
}

/**
 * Apply combined filters (role + search)
 */
export function applyCardFilters(roleId, searchQuery) {
  const cards = document.querySelectorAll('.anchor-card')
  const sections = document.querySelectorAll('.category-section')

  const lowerQuery = searchQuery ? searchQuery.toLowerCase().trim() : ''

  cards.forEach(card => {
    // Role filter
    const roles = card.dataset.roles.split(',').filter(Boolean)
    const roleMatch = !roleId || roles.includes(roleId)

    // Search filter
    const title = card.querySelector('.anchor-card-title').textContent.toLowerCase()
    const tags = card.dataset.tags.toLowerCase()
    const anchorId = card.dataset.anchor.toLowerCase()
    const searchMatch = !lowerQuery ||
                        title.includes(lowerQuery) ||
                        tags.includes(lowerQuery) ||
                        anchorId.includes(lowerQuery)

    card.style.display = (roleMatch && searchMatch) ? 'block' : 'none'
  })

  // Hide empty sections
  sections.forEach(section => {
    const visibleCards = Array.from(section.querySelectorAll('.anchor-card'))
      .filter(card => card.style.display !== 'none')
    section.style.display = visibleCards.length > 0 ? 'block' : 'none'
  })
}
