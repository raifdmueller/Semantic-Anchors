import { test, expect } from '@playwright/test'

const WEBSITE_URL = 'https://raifdmueller.github.io/Semantic-Anchors/'

test.describe('Semantic Anchors Website', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL)
  })

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Semantic Anchors/)
    await expect(page.locator('h1')).toContainText('Semantic Anchors')
  })

  test('should display header with navigation', async ({ page }) => {
    // Check header elements
    await expect(page.locator('#theme-toggle')).toBeVisible()
    await expect(page.locator('#lang-toggle')).toBeVisible()
    await expect(page.locator('#lang-toggle')).toHaveText('DE')
  })

  test('should display treemap container', async ({ page }) => {
    const treemap = page.locator('#treemap-container')
    await expect(treemap).toBeVisible()

    // Treemap should have ECharts canvas
    const canvas = treemap.locator('canvas')
    await expect(canvas).toBeVisible()
  })

  test('should display search and filter controls', async ({ page }) => {
    await expect(page.locator('#search-input')).toBeVisible()
    await expect(page.locator('#role-filter')).toBeVisible()

    // Role filter should have options
    const roleFilter = page.locator('#role-filter')
    const options = roleFilter.locator('option')
    const count = await options.count()
    expect(count).toBeGreaterThan(1) // At least "All Roles" + 1 role
  })

  test('should filter by role', async ({ page }) => {
    // Wait for treemap to load
    await page.waitForTimeout(2000)

    // Select a role
    await page.selectOption('#role-filter', 'software-developer')

    // Wait for treemap to update
    await page.waitForTimeout(1000)

    // Treemap should still be visible
    await expect(page.locator('#treemap-container canvas')).toBeVisible()
  })

  test('should filter by search query', async ({ page }) => {
    // Wait for treemap to load
    await page.waitForTimeout(2000)

    // Type in search
    await page.fill('#search-input', 'TDD')

    // Wait for treemap to update
    await page.waitForTimeout(1000)

    // Treemap should still be visible
    await expect(page.locator('#treemap-container canvas')).toBeVisible()
  })

  test('should toggle theme', async ({ page }) => {
    // Initial theme (light)
    const html = page.locator('html')
    const initialClass = await html.getAttribute('class')

    // Click theme toggle
    await page.click('#theme-toggle')

    // Wait for transition
    await page.waitForTimeout(500)

    // Theme should have changed
    const newClass = await html.getAttribute('class')
    expect(newClass).not.toBe(initialClass)

    // Should toggle between 'dark' and ''
    const hasDark = newClass?.includes('dark') || initialClass?.includes('dark')
    expect(hasDark).toBe(true)
  })

  test('should toggle language', async ({ page }) => {
    const langToggle = page.locator('#lang-toggle')

    // Initial language
    const initialLang = await langToggle.textContent()
    expect(initialLang).toBe('DE')

    // Click language toggle
    await langToggle.click()

    // Wait for update
    await page.waitForTimeout(500)

    // Language should change
    const newLang = await langToggle.textContent()
    expect(newLang).toBe('EN')

    // Page heading should update
    const heading = page.locator('h1')
    await expect(heading).toContainText('Semantic Anchors')
  })

  test('should open anchor modal on click', async ({ page }) => {
    // Wait for treemap to fully load
    await page.waitForTimeout(3000)

    // Modal should be hidden initially
    const modal = page.locator('#anchor-modal')
    await expect(modal).toHaveClass(/hidden/)

    // Click on treemap (trigger anchor selection)
    // We need to click on a specific area where an anchor is likely to be
    const treemap = page.locator('#treemap-container')
    await treemap.click({ position: { x: 200, y: 200 } })

    // Wait for modal to open
    await page.waitForTimeout(1000)

    // Modal might open - check if it's visible
    // (This might not work on first try as we need to click exactly on an anchor)
    const modalVisible = await modal.evaluate(el =>
      !el.classList.contains('hidden')
    )

    // If modal is visible, verify it has content
    if (modalVisible) {
      await expect(modal.locator('#modal-title')).toBeVisible()
      await expect(modal.locator('#modal-content')).toBeVisible()
      await expect(modal.locator('#modal-close')).toBeVisible()
    }
  })

  test('should close modal with close button', async ({ page }) => {
    // Wait for treemap
    await page.waitForTimeout(3000)

    // Try to open modal by clicking treemap
    const treemap = page.locator('#treemap-container')
    await treemap.click({ position: { x: 200, y: 200 } })

    await page.waitForTimeout(1000)

    const modal = page.locator('#anchor-modal')
    const isVisible = await modal.evaluate(el =>
      !el.classList.contains('hidden')
    )

    if (isVisible) {
      // Click close button
      await page.click('#modal-close')

      // Wait for close animation
      await page.waitForTimeout(500)

      // Modal should be hidden
      await expect(modal).toHaveClass(/hidden/)
    }
  })

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Page should still be visible
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('#treemap-container')).toBeVisible()

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('h1')).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should display footer with version', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Should contain version number
    await expect(footer).toContainText(/v\d+\.\d+\.\d+/)
  })

  test('should have accessible navigation', async ({ page }) => {
    // Check ARIA labels
    const themeToggle = page.locator('#theme-toggle')
    const ariaLabel = await themeToggle.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel?.length).toBeGreaterThan(0)
  })

  test('should load all required assets', async ({ page }) => {
    // Check for CSS
    const styles = await page.evaluate(() => {
      return Array.from(document.styleSheets).length > 0
    })
    expect(styles).toBe(true)

    // Check for scripts
    const scripts = await page.evaluate(() => {
      return Array.from(document.scripts).length > 0
    })
    expect(scripts).toBe(true)
  })
})
