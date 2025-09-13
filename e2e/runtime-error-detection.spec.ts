/**
 * Runtime Error Detection E2E Test Suite
 * 
 * This test suite uses Playwright to detect runtime errors, hydration issues,
 * and styled-components factory call errors in a real browser environment
 */

import { test, expect, Page } from '@playwright/test'

// Helper function to capture and analyze console errors
async function captureErrors(page: Page) {
  const errors: string[] = []
  const warnings: string[] = []

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text())
    }
  })

  page.on('pageerror', error => {
    errors.push(error.message)
  })

  return { errors, warnings }
}

test.describe('Runtime Error Detection', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for the development server to be ready
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should not have hydration errors on homepage', async ({ page }) => {
    const { errors } = await captureErrors(page)
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Wait a bit for any hydration errors to appear
    await page.waitForTimeout(2000)
    
    const hydrationErrors = errors.filter(error =>
      error.includes('Hydration failed') ||
      error.includes('server HTML') ||
      error.includes('client-side HTML') ||
      error.includes('did not match')
    )
    
    if (hydrationErrors.length > 0) {
      console.log('❌ Hydration errors found:', hydrationErrors)
    }
    
    expect(hydrationErrors).toHaveLength(0)
  })

  test('should not have styled-components factory call errors on homepage', async ({ page }) => {
    const { errors } = await captureErrors(page)
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    const styledComponentsErrors = errors.filter(error =>
      error.includes('originalFactory.call') ||
      error.includes('Cannot read properties of undefined') ||
      error.includes('styled-components')
    )
    
    if (styledComponentsErrors.length > 0) {
      console.log('❌ Styled-components errors found:', styledComponentsErrors)
    }
    
    expect(styledComponentsErrors).toHaveLength(0)
  })

  test('should not have errors when navigating between category tabs', async ({ page }) => {
    const { errors } = await captureErrors(page)
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Click through different category tabs
    const tabs = ['YouTube', 'TikTok', 'Instagram']
    
    for (const tabName of tabs) {
      await page.click(`text=${tabName}`)
      await page.waitForTimeout(500)
    }
    
    await page.waitForTimeout(1000)
    
    const styledComponentsErrors = errors.filter(error =>
      error.includes('originalFactory.call') ||
      error.includes('Cannot read properties of undefined')
    )
    
    expect(styledComponentsErrors).toHaveLength(0)
  })

  test('should not have errors on cart page', async ({ page }) => {
    const { errors } = await captureErrors(page)
    
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    const allErrors = errors.filter(error =>
      error.includes('originalFactory.call') ||
      error.includes('Hydration failed') ||
      error.includes('Cannot read properties of undefined')
    )
    
    if (allErrors.length > 0) {
      console.log('❌ Cart page errors found:', allErrors)
    }
    
    expect(allErrors).toHaveLength(0)
  })

  test('should not have errors on shop page', async ({ page }) => {
    const { errors } = await captureErrors(page)
    
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    const allErrors = errors.filter(error =>
      error.includes('originalFactory.call') ||
      error.includes('Hydration failed') ||
      error.includes('Cannot read properties of undefined')
    )
    
    if (allErrors.length > 0) {
      console.log('❌ Shop page errors found:', allErrors)
    }
    
    expect(allErrors).toHaveLength(0)
  })

  test('should not have errors on product pages', async ({ page }) => {
    const { errors } = await captureErrors(page)
    
    const productSlugs = ['youtube-views', 'youtube-likes', 'youtube-subscribers']
    
    for (const slug of productSlugs) {
      await page.goto(`/products/${slug}`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
    }
    
    const allErrors = errors.filter(error =>
      error.includes('originalFactory.call') ||
      error.includes('Hydration failed') ||
      error.includes('Cannot read properties of undefined')
    )
    
    if (allErrors.length > 0) {
      console.log('❌ Product pages errors found:', allErrors)
    }
    
    expect(allErrors).toHaveLength(0)
  })

  test('should handle mobile viewport without errors', async ({ page }) => {
    const { errors } = await captureErrors(page)
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Test mobile navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu"]').first()
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      await page.waitForTimeout(500)
    }
    
    await page.waitForTimeout(2000)
    
    const allErrors = errors.filter(error =>
      error.includes('originalFactory.call') ||
      error.includes('Hydration failed') ||
      error.includes('Cannot read properties of undefined')
    )
    
    expect(allErrors).toHaveLength(0)
  })

  test('should handle rapid user interactions without errors', async ({ page }) => {
    const { errors } = await captureErrors(page)
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Rapid clicking between tabs
    for (let i = 0; i < 5; i++) {
      await page.click('text=YouTube')
      await page.waitForTimeout(100)
      await page.click('text=TikTok')
      await page.waitForTimeout(100)
      await page.click('text=Instagram')
      await page.waitForTimeout(100)
    }
    
    await page.waitForTimeout(1000)
    
    const styledComponentsErrors = errors.filter(error =>
      error.includes('originalFactory.call') ||
      error.includes('Cannot read properties of undefined')
    )
    
    expect(styledComponentsErrors).toHaveLength(0)
  })

  test('should not have DOM prop forwarding warnings', async ({ page }) => {
    const { warnings } = await captureErrors(page)
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Navigate through different pages to trigger various components
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')
    
    await page.waitForTimeout(2000)
    
    const domPropWarnings = warnings.filter(warning =>
      warning.includes('React does not recognize') ||
      warning.includes('unknown prop') ||
      warning.includes('received a `') && warning.includes('` prop')
    )
    
    if (domPropWarnings.length > 0) {
      console.log('⚠️ DOM prop warnings found:', domPropWarnings)
    }
    
    // We expect zero DOM prop warnings
    expect(domPropWarnings).toHaveLength(0)
  })

  test('should load and render styled components correctly', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check that styled components are rendering with styles
    const categoryTabs = page.locator('[class*="CategoryTab"]')
    await expect(categoryTabs.first()).toBeVisible()
    
    // Check that hover states work (indicating styled components are functional)
    await categoryTabs.first().hover()
    await page.waitForTimeout(300)
    
    // Verify no console errors during styling
    const { errors } = await captureErrors(page)
    const stylingErrors = errors.filter(error =>
      error.includes('CSS') ||
      error.includes('style') ||
      error.includes('styled-components')
    )
    
    expect(stylingErrors).toHaveLength(0)
  })

  test('should handle server-side rendering correctly', async ({ page }) => {
    // Test SSR by checking page source before JavaScript executes
    const response = await page.goto('/')
    const html = await response?.text()
    
    // Check that important content is in the initial HTML (SSR working)
    expect(html).toContain('YouTube')
    expect(html).toContain('TikTok')
    expect(html).toContain('Instagram')
    
    // Now let JavaScript execute and check for hydration issues
    await page.waitForLoadState('networkidle')
    
    const { errors } = await captureErrors(page)
    const hydrationErrors = errors.filter(error =>
      error.includes('Hydration failed') ||
      error.includes('server HTML') ||
      error.includes('client-side HTML')
    )
    
    expect(hydrationErrors).toHaveLength(0)
  })
})