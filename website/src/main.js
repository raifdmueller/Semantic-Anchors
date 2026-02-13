import './styles/main.css'
import { renderHeader } from './components/header.js'
import { renderMain } from './components/main-content.js'
import { renderFooter } from './components/footer.js'
import { initSearchBar } from './components/search-bar.js'
import { initRoleFilter } from './components/role-filter.js'
import { renderFilteredResults } from './components/filtered-results.js'
import { loadAllData } from './utils/data-loader.js'
import { applyFilters } from './utils/filter-utils.js'
import { readFiltersFromURL, writeFiltersToURL } from './utils/url-state.js'

const APP_VERSION = '0.2.0'

let state = {
  anchors: [],
  roles: [],
  query: '',
  selectedRoles: []
}

async function initApp() {
  const app = document.querySelector('#app')
  const filters = readFiltersFromURL()
  state.query = filters.query
  state.selectedRoles = filters.roles

  // Render initial skeleton
  app.innerHTML = `
    ${renderHeader()}
    ${renderMain()}
    ${renderFooter(APP_VERSION)}
  `

  initThemeToggle()
  initLanguageToggle()

  // Load data and render with filters
  try {
    const { anchors, roles } = await loadAllData()
    state.anchors = anchors
    state.roles = roles
    renderWithFilters(app)
  } catch (err) {
    console.error('Failed to load data:', err)
  }
}

function renderWithFilters(app) {
  const filtered = applyFilters(state.anchors, {
    query: state.query,
    roles: state.selectedRoles
  })

  app.innerHTML = `
    ${renderHeader()}
    ${renderMain({
      anchors: state.anchors,
      roles: state.roles,
      filteredAnchors: filtered,
      query: state.query,
      selectedRoles: state.selectedRoles
    })}
    ${renderFooter(APP_VERSION)}
  `

  initThemeToggle()
  initLanguageToggle()
  initSearchBar(onSearchChange)
  initRoleFilter(onRolesChange)
  initClearAllFilters(app)
  initResultsClearButton(app)

  writeFiltersToURL({ query: state.query, roles: state.selectedRoles })
}

function onSearchChange(query) {
  state.query = query
  updateResults()
}

function onRolesChange(roles) {
  state.selectedRoles = roles
  updateResults()
}

function updateResults() {
  const filtered = applyFilters(state.anchors, {
    query: state.query,
    roles: state.selectedRoles
  })

  const resultsContainer = document.querySelector('#results-container')
  if (resultsContainer) {
    resultsContainer.innerHTML = renderFilteredResults(filtered, state.roles)
  }

  // Show/hide the clear filters button
  const clearBtn = document.querySelector('#clear-all-filters')
  if (clearBtn) {
    const hasFilters = state.query || state.selectedRoles.length > 0
    clearBtn.classList.toggle('hidden', !hasFilters)
  }

  writeFiltersToURL({ query: state.query, roles: state.selectedRoles })
  initResultsClearButton(document.querySelector('#app'))
}

function initClearAllFilters(app) {
  const clearBtn = document.querySelector('#filters #clear-all-filters')
  if (!clearBtn) return

  clearBtn.addEventListener('click', () => {
    state.query = ''
    state.selectedRoles = []
    renderWithFilters(app)
  })
}

function initResultsClearButton(app) {
  const clearBtn = document.querySelector('#filtered-results #clear-all-filters')
  if (!clearBtn) return

  clearBtn.addEventListener('click', () => {
    state.query = ''
    state.selectedRoles = []
    renderWithFilters(app)
  })
}

function initThemeToggle() {
  const toggle = document.querySelector('#theme-toggle')
  if (!toggle) return

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }

  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark')
    const isDark = document.documentElement.classList.contains('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  })
}

function initLanguageToggle() {
  const toggle = document.querySelector('#lang-toggle')
  if (!toggle) return

  const savedLang = localStorage.getItem('lang') || 'en'
  document.documentElement.lang = savedLang
  toggle.textContent = savedLang === 'en' ? 'DE' : 'EN'

  toggle.addEventListener('click', () => {
    const currentLang = document.documentElement.lang
    const newLang = currentLang === 'en' ? 'de' : 'en'
    document.documentElement.lang = newLang
    localStorage.setItem('lang', newLang)
    toggle.textContent = newLang === 'en' ? 'DE' : 'EN'
  })
}

document.addEventListener('DOMContentLoaded', initApp)
