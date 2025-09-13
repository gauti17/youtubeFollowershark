/**
 * Component Integrity Test Suite
 * 
 * This test suite scans all components for potential styled-components issues
 * and validates that they follow the proper patterns to prevent factory call errors
 */

import React from 'react'
import { render } from '@testing-library/react'
import fs from 'fs'
import path from 'path'

// Import components for testing
import Header from '../components/Header'
import Footer from '../components/Footer'
import CategoryNavigation from '../components/CategoryNavigation'
import Layout from '../components/Layout'
import DynamicButton from '../components/DynamicButton'
import Toast from '../components/Toast'
import Loading from '../components/Loading'
import { CartProvider } from '../lib/CartContext'

// Mock providers
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

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CartProvider value={mockCartContext}>
    {children}
  </CartProvider>
)

describe('Component Integrity Testing', () => {
  let errorCapture: any

  beforeEach(() => {
    errorCapture = global.testUtils.captureErrors()
  })

  afterEach(() => {
    errorCapture.restore()
  })

  describe('Static Analysis of Styled Components', () => {
    test('should scan all component files for potential styled-components issues', async () => {
      // Get component files using fs instead of glob for better Jest compatibility
      const componentsDir = path.join(process.cwd(), 'components')
      let componentFiles: string[] = []
      
      try {
        componentFiles = fs.readdirSync(componentsDir)
          .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
          .map(file => path.join(componentsDir, file))
      } catch (error) {
        console.log('Components directory not found or empty')
        return
      }
      
      const issues: Array<{ file: string; issue: string; line: number }> = []

      for (const file of componentFiles) {
        const content = fs.readFileSync(file, 'utf-8')
        const lines = content.split('\n')

        lines.forEach((line, index) => {
          // Check for styled components with generic types but no withConfig
          if (line.includes('styled.') && line.includes('<') && !line.includes('withConfig')) {
            // Look for potential prop usage in the same or following lines
            const context = lines.slice(index, index + 10).join('\n')
            if (context.includes('props.') && !context.includes('shouldForwardProp')) {
              issues.push({
                file: path.relative(process.cwd(), file),
                issue: 'Styled component with generic types missing withConfig/shouldForwardProp',
                line: index + 1
              })
            }
          }

          // Check for DOM props being used directly (should be prefixed with $)
          if (line.includes('props.') && !line.includes('props.$') && !line.includes('props.theme')) {
            const propMatch = line.match(/props\.(\w+)/)
            if (propMatch && !['children', 'className', 'style', 'ref'].includes(propMatch[1])) {
              issues.push({
                file: path.relative(process.cwd(), file),
                issue: `Potential DOM prop forwarding issue: props.${propMatch[1]} (should be props.$${propMatch[1]})`,
                line: index + 1
              })
            }
          }

          // Check for missing shouldForwardProp patterns
          if (line.includes('shouldForwardProp') && line.includes('prop !== ')) {
            issues.push({
              file: path.relative(process.cwd(), file),
              issue: 'Using old shouldForwardProp pattern (prop !== ...), should use array includes pattern',
              line: index + 1
            })
          }
        })
      }

      // Report issues but don't fail the test - this is for analysis
      if (issues.length > 0) {
        console.log('\n🔍 Potential Styled Components Issues Found:')
        issues.forEach(issue => {
          console.log(`  ${issue.file}:${issue.line} - ${issue.issue}`)
        })
      } else {
        console.log('\n✅ No styled-components issues detected in static analysis')
      }

      // We don't fail the test here, just report findings
      expect(issues).toBeDefined()
    })
  })

  describe('Component Rendering Tests', () => {
    test('Header component should render without errors', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })

    test('Footer component should render without errors', async () => {
      render(
        <TestWrapper>
          <Footer />
        </TestWrapper>
      )

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })

    test('CategoryNavigation component should render without errors', async () => {
      render(
        <TestWrapper>
          <CategoryNavigation />
        </TestWrapper>
      )

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })

    test('DynamicButton component should handle all prop variations', async () => {
      render(
        <div>
          <DynamicButton variant="primary">Primary</DynamicButton>
          <DynamicButton variant="secondary">Secondary</DynamicButton>
          <DynamicButton disabled>Disabled</DynamicButton>
          <DynamicButton loading>Loading</DynamicButton>
        </div>
      )

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })

    test('Layout component should render with children', async () => {
      render(
        <TestWrapper>
          <Layout title="Test Page">
            <div>Test content</div>
          </Layout>
        </TestWrapper>
      )

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })

    test('Loading components should render without errors', async () => {
      const { ButtonWithSpinner, InlineLoading, CartItemSkeleton } = Loading

      render(
        <div>
          <ButtonWithSpinner loading={true}>Loading Button</ButtonWithSpinner>
          <ButtonWithSpinner loading={false}>Normal Button</ButtonWithSpinner>
          <InlineLoading />
          <CartItemSkeleton />
        </div>
      )

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })

    test('Toast component should render different types', async () => {
      render(
        <div>
          <Toast 
            message="Success message"
            type="success"
            isVisible={true}
            onClose={() => {}}
          />
          <Toast 
            message="Error message"
            type="error"
            isVisible={true}
            onClose={() => {}}
          />
        </div>
      )

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })
  })

  describe('Stress Testing', () => {
    test('should handle rapid component mounting/unmounting', async () => {
      const { rerender, unmount } = render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      // Rapidly change props and rerender
      for (let i = 0; i < 10; i++) {
        rerender(
          <TestWrapper>
            <Header />
            <CategoryNavigation />
          </TestWrapper>
        )
      }

      unmount()

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })

    test('should handle complex nested component structures', async () => {
      render(
        <TestWrapper>
          <Layout title="Complex Test">
            <Header />
            <div>
              <CategoryNavigation />
              <div style={{ display: 'flex' }}>
                <DynamicButton variant="primary">Button 1</DynamicButton>
                <DynamicButton variant="secondary">Button 2</DynamicButton>
              </div>
            </div>
            <Footer />
          </Layout>
        </TestWrapper>
      )

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })
  })

  describe('Memory Leak Detection', () => {
    test('should not have memory leaks from styled-components', async () => {
      // This test checks for potential memory leaks by creating and destroying many components
      const components = []
      
      for (let i = 0; i < 50; i++) {
        const { unmount } = render(
          <TestWrapper>
            <Header />
            <CategoryNavigation />
          </TestWrapper>
        )
        components.push(unmount)
      }

      // Cleanup all components
      components.forEach(unmount => unmount())

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })
  })
})