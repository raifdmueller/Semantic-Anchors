import { describe, it, expect } from 'vitest'
import { filterByText, filterByRoles, applyFilters } from './filter-utils.js'

const mockAnchors = [
  {
    id: 'tdd-london-school',
    title: 'TDD, London School',
    roles: ['software-developer', 'qa-engineer', 'software-architect'],
    proponents: ['Steve Freeman', 'Nat Pryce'],
    tags: ['testing', 'tdd', 'mocking']
  },
  {
    id: 'clean-architecture',
    title: 'Clean Architecture',
    roles: ['software-architect', 'software-developer'],
    proponents: ['Robert C. Martin'],
    tags: ['architecture', 'design']
  },
  {
    id: 'cynefin-framework',
    title: 'Cynefin Framework',
    roles: ['team-lead', 'consultant', 'product-owner', 'software-architect'],
    proponents: ['Dave Snowden'],
    tags: ['decision-making', 'complexity']
  },
  {
    id: 'diataxis-framework',
    title: 'Diátaxis Framework',
    roles: ['technical-writer', 'educator'],
    proponents: ['Daniele Procida'],
    tags: ['documentation']
  }
]

describe('filterByText', () => {
  it('returns all anchors when query is empty', () => {
    expect(filterByText(mockAnchors, '')).toEqual(mockAnchors)
    expect(filterByText(mockAnchors, null)).toEqual(mockAnchors)
    expect(filterByText(mockAnchors, undefined)).toEqual(mockAnchors)
    expect(filterByText(mockAnchors, '   ')).toEqual(mockAnchors)
  })

  it('filters by title', () => {
    const result = filterByText(mockAnchors, 'clean')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('clean-architecture')
  })

  it('filters by proponent name', () => {
    const result = filterByText(mockAnchors, 'Freeman')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tdd-london-school')
  })

  it('filters by tag', () => {
    const result = filterByText(mockAnchors, 'documentation')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('diataxis-framework')
  })

  it('filters by anchor ID', () => {
    const result = filterByText(mockAnchors, 'cynefin')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('cynefin-framework')
  })

  it('is case-insensitive', () => {
    const result = filterByText(mockAnchors, 'TDD')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tdd-london-school')
  })

  it('handles multi-word search (AND logic)', () => {
    const result = filterByText(mockAnchors, 'tdd london')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tdd-london-school')
  })

  it('returns empty when no match', () => {
    expect(filterByText(mockAnchors, 'nonexistent')).toHaveLength(0)
  })

  it('matches framework in multiple anchors', () => {
    const result = filterByText(mockAnchors, 'framework')
    expect(result).toHaveLength(2)
    expect(result.map(a => a.id)).toContain('cynefin-framework')
    expect(result.map(a => a.id)).toContain('diataxis-framework')
  })
})

describe('filterByRoles', () => {
  it('returns all anchors when no roles selected', () => {
    expect(filterByRoles(mockAnchors, [])).toEqual(mockAnchors)
    expect(filterByRoles(mockAnchors, null)).toEqual(mockAnchors)
    expect(filterByRoles(mockAnchors, undefined)).toEqual(mockAnchors)
  })

  it('filters by single role', () => {
    const result = filterByRoles(mockAnchors, ['technical-writer'])
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('diataxis-framework')
  })

  it('filters by multiple roles (OR logic)', () => {
    const result = filterByRoles(mockAnchors, ['technical-writer', 'consultant'])
    expect(result).toHaveLength(2)
    expect(result.map(a => a.id)).toContain('diataxis-framework')
    expect(result.map(a => a.id)).toContain('cynefin-framework')
  })

  it('returns anchors matching any selected role', () => {
    const result = filterByRoles(mockAnchors, ['qa-engineer'])
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tdd-london-school')
  })

  it('software-architect matches multiple anchors', () => {
    const result = filterByRoles(mockAnchors, ['software-architect'])
    expect(result).toHaveLength(3)
  })
})

describe('applyFilters', () => {
  it('returns all when no filters active', () => {
    expect(applyFilters(mockAnchors, { query: '', roles: [] })).toEqual(mockAnchors)
  })

  it('applies text filter only', () => {
    const result = applyFilters(mockAnchors, { query: 'clean', roles: [] })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('clean-architecture')
  })

  it('applies role filter only', () => {
    const result = applyFilters(mockAnchors, { query: '', roles: ['educator'] })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('diataxis-framework')
  })

  it('applies both text and role filters (intersection)', () => {
    const result = applyFilters(mockAnchors, {
      query: 'framework',
      roles: ['consultant']
    })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('cynefin-framework')
  })

  it('returns empty when combined filters exclude all', () => {
    const result = applyFilters(mockAnchors, {
      query: 'clean',
      roles: ['educator']
    })
    expect(result).toHaveLength(0)
  })
})
