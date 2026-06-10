import { describe, it, expect, beforeEach, vi } from 'vitest'
import { addRoute, getCurrentRoute, initRouter, navigate } from './router.js'
import { i18n } from '../i18n.js'

describe('router', () => {
  beforeEach(() => {
    // Reset to base path
    history.replaceState(null, '', '/')
    window.location.hash = ''
  })

  it('returns current route from pathname', () => {
    history.replaceState(null, '', '/about')
    expect(getCurrentRoute()).toBe('/about')
  })

  it('supports legacy hash URLs for backward compatibility', () => {
    window.location.hash = '#/about'
    expect(getCurrentRoute()).toBe('/about')
  })

  it('navigates to a route via pushState', () => {
    navigate('/contributing')
    expect(window.location.pathname).toBe('/contributing')
  })

  it('runs registered handler on init and popstate', async () => {
    const handler = vi.fn()
    addRoute('/router-test', handler)
    history.replaceState(null, '', '/router-test')

    initRouter()
    expect(handler).toHaveBeenCalledTimes(1)

    history.pushState(null, '', '/router-test')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(handler).toHaveBeenCalledTimes(2)
  })

  it('reports a GoatCounter pageview with the path on SPA navigation', () => {
    window.goatcounter = { count: vi.fn() }
    addRoute('/gc-test', vi.fn())
    // The very first route of the run is skipped by design (count.js auto-counts
    // the initial load); clear and navigate again so we assert a later change.
    navigate('/gc-test')
    window.goatcounter.count.mockClear()
    navigate('/gc-test')
    expect(window.goatcounter.count).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/gc-test' })
    )
    delete window.goatcounter
  })
})

describe('router language prefix (/de)', () => {
  beforeEach(() => {
    history.replaceState(null, '', '/')
    window.location.hash = ''
    localStorage.clear()
    i18n.init()
  })

  it('strips the /de prefix from the current route', () => {
    history.replaceState(null, '', '/de/about')
    expect(getCurrentRoute()).toBe('/about')
  })

  it('maps bare /de to the home route', () => {
    history.replaceState(null, '', '/de')
    expect(getCurrentRoute()).toBe('/')
  })

  it('resolves the underlying route handler and switches to German', () => {
    const handler = vi.fn()
    addRoute('/de-prefix-test', handler)
    history.replaceState(null, '', '/de/de-prefix-test')

    window.dispatchEvent(new PopStateEvent('popstate'))

    expect(handler).toHaveBeenCalled()
    expect(i18n.currentLang()).toBe('de')
  })

  it('leaves the language untouched on unprefixed routes', () => {
    addRoute('/en-route-test', vi.fn())
    history.replaceState(null, '', '/en-route-test')

    window.dispatchEvent(new PopStateEvent('popstate'))

    expect(i18n.currentLang()).toBe('en')
  })
})
