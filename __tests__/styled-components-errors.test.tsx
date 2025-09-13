/**
 * Styled Components Factory Call Error Detection Test Suite
 * 
 * This test suite detects "originalFactory.call" errors and other styled-components issues
 * that can occur when props are not properly filtered or components are incorrectly configured
 */

import React from 'react'
import { render } from '@testing-library/react'
import styled from 'styled-components'

// Import components that had factory call issues
import CartPage from '../pages/cart'
import { CartProvider } from '../lib/CartContext'

// Mock data
const mockCartContext = {
  items: [
    {
      id: '1',
      productId: 'youtube-views',
      quantity: 1,
      price: 10.99,
      selectedOptions: {
        url: 'https://youtube.com/watch?v=test',
        selectedQuantity: 1000,
        speed: 'Normal',
        target: 'Weltweit'
      }
    }
  ],
  total: 10.99,
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

describe('Styled Components Error Detection', () => {
  let errorCapture: any

  beforeEach(() => {
    errorCapture = global.testUtils.captureErrors()
  })

  afterEach(() => {
    errorCapture.restore()
  })

  describe('Factory Call Error Detection', () => {
    test('should not have originalFactory.call errors in CartPage', async () => {
      render(
        <TestWrapper>
          <CartPage />
        </TestWrapper>
      )

      const errors = errorCapture.getErrors()
      const factoryErrors = errors.filter(error => 
        error.includes('originalFactory.call') ||
        error.includes('Cannot read properties of undefined')
      )

      expect(factoryErrors).toHaveLength(0)
    })

    test('should properly handle $disabled prop in RemoveButton', async () => {
      // Test the specific RemoveButton component that was fixed
      const TestRemoveButton = styled.button.withConfig({
        shouldForwardProp: (prop) => !['$disabled'].includes(prop)
      })<{ $disabled?: boolean }>`
        opacity: ${props => props.$disabled ? 0.6 : 1};
        cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
      `

      render(
        <div>
          <TestRemoveButton $disabled={true}>Disabled</TestRemoveButton>
          <TestRemoveButton $disabled={false}>Enabled</TestRemoveButton>
          <TestRemoveButton>Default</TestRemoveButton>
        </div>
      )

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })
  })

  describe('Prop Forwarding Issues', () => {
    test('should not forward custom props to DOM elements', async () => {
      // Test component with proper shouldForwardProp
      const GoodComponent = styled.div.withConfig({
        shouldForwardProp: (prop) => !['$customProp', '$anotherProp'].includes(prop)
      })<{ $customProp?: boolean; $anotherProp?: string }>`
        color: ${props => props.$customProp ? 'red' : 'black'};
        background: ${props => props.$anotherProp || 'transparent'};
      `

      render(
        <GoodComponent $customProp={true} $anotherProp="blue">
          Test content
        </GoodComponent>
      )

      const errors = errorCapture.getErrors()
      const domPropErrors = errors.filter(error =>
        error.includes('React does not recognize') ||
        error.includes('unknown prop')
      )

      expect(domPropErrors).toHaveLength(0)
    })

    test('should detect when shouldForwardProp is missing for custom props', async () => {
      // This should cause warnings - intentionally bad component
      const BadComponent = styled.div<{ customProp?: boolean }>`
        color: ${props => props.customProp ? 'red' : 'black'};
      `

      render(<BadComponent customProp={true}>Bad component</BadComponent>)

      const errors = errorCapture.getErrors()
      const domPropErrors = errors.filter(error =>
        error.includes('React does not recognize') ||
        error.includes('customProp')
      )

      // This should detect the prop forwarding issue
      expect(domPropErrors.length).toBeGreaterThan(0)
    })
  })

  describe('Generic Type Issues', () => {
    test('should handle styled components with generic types correctly', async () => {
      // Test the pattern we use to fix generic type issues
      const GenericStyledComponent = styled.button.withConfig({
        shouldForwardProp: (prop) => !['$isActive', '$variant'].includes(prop)
      })<{ $isActive?: boolean; $variant?: 'primary' | 'secondary' }>`
        background: ${props => {
          if (props.$variant === 'primary') return '#007bff'
          if (props.$variant === 'secondary') return '#6c757d'
          return props.$isActive ? '#28a745' : '#ffffff'
        }};
        color: ${props => props.$isActive ? 'white' : 'black'};
      `

      render(
        <div>
          <GenericStyledComponent $isActive={true} $variant="primary">
            Primary Active
          </GenericStyledComponent>
          <GenericStyledComponent $isActive={false} $variant="secondary">
            Secondary Inactive
          </GenericStyledComponent>
        </div>
      )

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })
  })

  describe('Nested Styled Components', () => {
    test('should handle nested styled components without errors', async () => {
      const Container = styled.div.withConfig({
        shouldForwardProp: (prop) => !['$fullWidth'].includes(prop)
      })<{ $fullWidth?: boolean }>`
        width: ${props => props.$fullWidth ? '100%' : 'auto'};
      `

      const NestedButton = styled.button.withConfig({
        shouldForwardProp: (prop) => !['$size'].includes(prop)
      })<{ $size?: 'small' | 'large' }>`
        padding: ${props => props.$size === 'small' ? '4px 8px' : '12px 24px'};
      `

      render(
        <Container $fullWidth={true}>
          <NestedButton $size="large">Large Button</NestedButton>
          <NestedButton $size="small">Small Button</NestedButton>
        </Container>
      )

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })
  })

  describe('Theme Provider Issues', () => {
    test('should handle styled-components without theme provider', async () => {
      // Test that components work without theme (common cause of factory errors)
      const ThemeAwareComponent = styled.div`
        color: ${props => props.theme?.colors?.primary || '#000'};
        background: ${props => props.theme?.colors?.background || '#fff'};
      `

      render(<ThemeAwareComponent>No theme provider</ThemeAwareComponent>)

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })
  })

  describe('Component Composition Issues', () => {
    test('should handle component composition correctly', async () => {
      // Test extending styled components (common source of errors)
      const BaseButton = styled.button.withConfig({
        shouldForwardProp: (prop) => !['$variant'].includes(prop)
      })<{ $variant?: string }>`
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
      `

      const PrimaryButton = styled(BaseButton).withConfig({
        shouldForwardProp: (prop) => !['$large'].includes(prop)
      })<{ $large?: boolean }>`
        background: #007bff;
        color: white;
        ${props => props.$large && `
          padding: 12px 24px;
          font-size: 16px;
        `}
      `

      render(
        <div>
          <BaseButton $variant="base">Base Button</BaseButton>
          <PrimaryButton $variant="primary" $large={true}>Large Primary</PrimaryButton>
        </div>
      )

      const errors = errorCapture.getErrors()
      const styledErrors = global.testUtils.checkStyledComponentsErrors(errors)
      expect(styledErrors).toHaveLength(0)
    })
  })
})