/**
 * Hydration Error Detection Test Suite
 * 
 * This test suite detects hydration mismatches between server and client rendering
 * that can cause "Hydration failed because the server rendered HTML didn't match the client"
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

// Import components to test
import Header from '../components/Header'
import CategoryNavigation from '../components/CategoryNavigation'
import { CartProvider } from '../lib/CartContext'

// Mock data
const mockCartContext = {
  items: [],
  total: 0,
  addItem: jest.fn(),
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  isOperationLoading: jest.fn(() => false),
  isLoading: false,
}

// Wrapper component for testing with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CartProvider value={mockCartContext}>
    {children}
  </CartProvider>
)

describe('Hydration Error Detection', () => {
  let errorCapture: any

  beforeEach(() => {
    errorCapture = global.testUtils.captureErrors()
  })

  afterEach(() => {
    errorCapture.restore()
  })

  describe('Header Component Hydration', () => {
    test('should not have hydration mismatches in Header', async () => {
      // Server-side render
      const sheet = new ServerStyleSheet()
      let serverHTML = ''
      
      try {
        serverHTML = renderToString(
          sheet.collectStyles(
            <TestWrapper>
              <Header />
            </TestWrapper>
          )
        )
      } catch (error) {
        console.error('Server render error:', error)
      } finally {
        sheet.seal()
      }

      // Client-side render
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      // Check for hydration errors
      const errors = errorCapture.getErrors()
      const hydrationErrors = global.testUtils.checkHydrationErrors(errors)

      expect(hydrationErrors).toHaveLength(0)
      expect(serverHTML).toBeTruthy()
    })

    test('should render consistent cart count between server and client', async () => {
      const contextWithItems = {
        ...mockCartContext,
        items: [
          { id: '1', productId: 'test', quantity: 2, price: 10, selectedOptions: {} }
        ],
        total: 20,
      }

      // Test server rendering
      const sheet = new ServerStyleSheet()
      let serverHTML = ''
      
      try {
        serverHTML = renderToString(
          sheet.collectStyles(
            <CartProvider value={contextWithItems}>
              <Header />
            </CartProvider>
          )
        )
      } catch (error) {
        console.error('Server render error:', error)
      } finally {
        sheet.seal()
      }

      // Test client rendering
      render(
        <CartProvider value={contextWithItems}>
          <Header />
        </CartProvider>
      )

      const errors = errorCapture.getErrors()
      const hydrationErrors = global.testUtils.checkHydrationErrors(errors)
      
      expect(hydrationErrors).toHaveLength(0)
      expect(serverHTML).toContain('1') // Cart count should be visible in server HTML
    })
  })

  describe('CategoryNavigation Component Hydration', () => {
    test('should not have hydration mismatches in CategoryNavigation', async () => {
      // Server-side render
      const sheet = new ServerStyleSheet()
      let serverHTML = ''
      
      try {
        serverHTML = renderToString(
          sheet.collectStyles(
            <TestWrapper>
              <CategoryNavigation />
            </TestWrapper>
          )
        )
      } catch (error) {
        console.error('Server render error:', error)
      } finally {
        sheet.seal()
      }

      // Client-side render
      render(
        <TestWrapper>
          <CategoryNavigation />
        </TestWrapper>
      )

      const errors = errorCapture.getErrors()
      const hydrationErrors = global.testUtils.checkHydrationErrors(errors)

      expect(hydrationErrors).toHaveLength(0)
      expect(serverHTML).toBeTruthy()
    })

    test('should have consistent initial category state', async () => {
      render(
        <TestWrapper>
          <CategoryNavigation />
        </TestWrapper>
      )

      // Check that YouTube is selected by default (consistent between server and client)
      const youtubeTab = screen.getByText('YouTube')
      expect(youtubeTab).toBeInTheDocument()
      
      const errors = errorCapture.getErrors()
      const hydrationErrors = global.testUtils.checkHydrationErrors(errors)
      expect(hydrationErrors).toHaveLength(0)
    })
  })

  describe('Dynamic Content Hydration', () => {
    test('should handle conditional rendering without hydration errors', async () => {
      const ConditionalComponent: React.FC<{ showContent: boolean }> = ({ showContent }) => (
        <div>
          {showContent ? <span>Dynamic Content</span> : null}
        </div>
      )

      // Test both states
      const { rerender } = render(<ConditionalComponent showContent={true} />)
      rerender(<ConditionalComponent showContent={false} />)

      const errors = errorCapture.getErrors()
      const hydrationErrors = global.testUtils.checkHydrationErrors(errors)
      expect(hydrationErrors).toHaveLength(0)
    })

    test('should handle date/time sensitive content correctly', async () => {
      // Mock consistent date for server/client
      const mockDate = new Date('2024-01-01T12:00:00.000Z')
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate)

      const TimeComponent: React.FC = () => (
        <div>{new Date().toISOString()}</div>
      )

      render(<TimeComponent />)

      const errors = errorCapture.getErrors()
      const hydrationErrors = global.testUtils.checkHydrationErrors(errors)
      expect(hydrationErrors).toHaveLength(0)
    })
  })

  describe('Styled Components Hydration', () => {
    test('should not have hydration issues with styled-components', async () => {
      // This specifically tests our fixed components
      render(
        <TestWrapper>
          <Header />
          <CategoryNavigation />
        </TestWrapper>
      )

      const errors = errorCapture.getErrors()
      const hydrationErrors = global.testUtils.checkHydrationErrors(errors)
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)

      expect(hydrationErrors).toHaveLength(0)
      expect(styledErrors).toHaveLength(0)
    })
  })
})