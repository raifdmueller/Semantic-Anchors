import { describe, it, expect } from 'vitest'
import { parseFiltersFromSearch, serializeFilters } from './url-state.js'

describe('parseFiltersFromSearch', () => {
  it('returns empty filters for empty search string', () => {
    expect(parseFiltersFromSearch('')).toEqual({ query: '', roles: [] })
  })

  it('parses query parameter', () => {
    const result = parseFiltersFromSearch('?q=tdd')
    expect(result.query).toBe('tdd')
    expect(result.roles).toEqual([])
  })

  it('parses roles parameter', () => {
    const result = parseFiltersFromSearch('?roles=software-developer,qa-engineer')
    expect(result.query).toBe('')
    expect(result.roles).toEqual(['software-developer', 'qa-engineer'])
  })

  it('parses both query and roles', () => {
    const result = parseFiltersFromSearch('?q=testing&roles=software-developer')
    expect(result.query).toBe('testing')
    expect(result.roles).toEqual(['software-developer'])
  })

  it('handles empty roles gracefully', () => {
    const result = parseFiltersFromSearch('?roles=')
    expect(result.roles).toEqual([])
  })
})

describe('serializeFilters', () => {
  it('returns empty string for empty filters', () => {
    expect(serializeFilters({ query: '', roles: [] })).toBe('')
  })

  it('serializes query only', () => {
    const result = serializeFilters({ query: 'tdd', roles: [] })
    expect(result).toBe('q=tdd')
  })

  it('serializes roles only', () => {
    const result = serializeFilters({ query: '', roles: ['software-developer'] })
    expect(result).toBe('roles=software-developer')
  })

  it('serializes both query and roles', () => {
    const result = serializeFilters({ query: 'test', roles: ['qa-engineer', 'developer'] })
    expect(result).toContain('q=test')
    expect(result).toContain('roles=qa-engineer%2Cdeveloper')
  })

  it('omits empty query', () => {
    const result = serializeFilters({ query: '', roles: ['educator'] })
    expect(result).not.toContain('q=')
    expect(result).toContain('roles=educator')
  })
})
