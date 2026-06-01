import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { i18n } from '../i18n.js'
import { loadDocContent } from './doc-page.js'

describe('doc-page', () => {
  beforeEach(() => {
    localStorage.clear()
    i18n.init()
    document.body.innerHTML = '<div id="doc-content"></div>'
    global.fetch = vi.fn()
  })

  afterEach(() => {
    delete global.fetch
  })

  it('falls back to English when localized document is missing', async () => {
    i18n.setLang('de')

    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 }).mockResolvedValueOnce({
      ok: true,
      text: async () => '<h1>About</h1><a href="https://example.com">Example</a>',
    })

    await loadDocContent('docs/about.adoc')

    expect(global.fetch).toHaveBeenNthCalledWith(1, expect.stringContaining('docs/about.de.html'))
    expect(global.fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('docs/about.html'))

    const link = document.querySelector('#doc-content a[href="https://example.com"]')
    expect(link).toBeTruthy()
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
  })

  it('renders an error state when loading fails', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 })

    await loadDocContent('docs/about.adoc')

    expect(document.getElementById('doc-content').textContent).toContain(
      'Failed to Load Documentation'
    )
  })

  it('re-roots relative image paths to the site base, leaving absolute ones', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<h1>Spec</h1><img src="docs/workflow-diagram.svg" alt="d"><img src="https://x.test/a.png" alt="ext">',
    })

    await loadDocContent('docs/spec-driven-workflow.adoc')

    const base = import.meta.env.BASE_URL
    const rel = document.querySelector('#doc-content img[alt="d"]')
    const ext = document.querySelector('#doc-content img[alt="ext"]')
    // relative AsciiDoc image path must be re-rooted (clean-URL routes break it otherwise)
    expect(rel.getAttribute('src')).toBe(`${base}docs/workflow-diagram.svg`)
    // absolute/external sources are left untouched
    expect(ext.getAttribute('src')).toBe('https://x.test/a.png')
  })
})
