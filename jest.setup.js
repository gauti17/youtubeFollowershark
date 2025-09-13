import '@testing-library/jest-dom'

// Add Node.js polyfills for browser APIs
const { TextEncoder, TextDecoder } = require('util')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js Link - filter out Next.js specific props
jest.mock('next/link', () => {
  return ({ children, href, passHref, ...domProps }) => {
    return <a href={href} {...domProps}>{children}</a>
  }
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Suppress console errors during tests unless explicitly testing for them
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || 
       args[0].includes('React does not recognize') ||
       args[0].includes('validateDOMNesting'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Global test utilities
global.testUtils = {
  // Helper to capture console errors
  captureErrors: () => {
    const errors = []
    const originalError = console.error
    console.error = (...args) => {
      errors.push(args.join(' '))
      originalError.call(console, ...args)
    }
    return {
      getErrors: () => errors,
      restore: () => { console.error = originalError }
    }
  },
  
  // Helper to check for hydration errors
  checkHydrationErrors: (errors) => {
    return errors.filter(error => 
      error.includes('Hydration failed') ||
      error.includes('server HTML') ||
      error.includes('client-side HTML')
    )
  },
  
  // Helper to check for styled-components errors
  checkStyledComponentsErrors: (errors) => {
    return errors.filter(error =>
      error.includes('originalFactory.call') ||
      error.includes('Cannot read properties of undefined') ||
      error.includes('styled-components')
    )
  }
}