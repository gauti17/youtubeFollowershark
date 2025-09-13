# Testing Suite for Hydration & Factory Call Error Detection

This comprehensive testing suite is designed to identify and prevent hydration errors and styled-components factory call errors in the YouShark application.

## Overview

The testing suite includes:
- **Unit/Integration Tests** (Jest + Testing Library)
- **End-to-End Tests** (Playwright)
- **Static Analysis** for styled-components patterns
- **Runtime Error Detection** in real browsers

## Test Categories

### 1. Hydration Error Detection (`__tests__/hydration-detection.test.tsx`)

**Purpose**: Detects "Hydration failed because the server rendered HTML didn't match the client" errors.

**Tests:**
- Server vs Client rendering consistency
- Cart count display consistency
- CategoryNavigation state consistency
- Conditional rendering patterns
- Date/time sensitive content
- Styled-components hydration

**Key Checks:**
```javascript
const hydrationErrors = errors.filter(error => 
  error.includes('Hydration failed') ||
  error.includes('server HTML') ||
  error.includes('client-side HTML')
)
```

### 2. Styled-Components Factory Call Error Detection (`__tests__/styled-components-errors.test.tsx`)

**Purpose**: Detects "undefined is not an object (evaluating 'originalFactory.call')" errors.

**Tests:**
- Factory call error detection
- Proper `shouldForwardProp` implementation
- DOM prop forwarding issues
- Generic type handling
- Component composition
- Theme provider compatibility

**Key Patterns Tested:**
```javascript
// ✅ Correct Pattern
const StyledComponent = styled.button.withConfig({
  shouldForwardProp: (prop) => !['$disabled', '$variant'].includes(prop)
})<{ $disabled?: boolean; $variant?: string }>`
  opacity: ${props => props.$disabled ? 0.6 : 1};
`

// ❌ Incorrect Pattern (causes factory errors)
const BadComponent = styled.button<{ disabled?: boolean }>`
  opacity: ${props => props.disabled ? 0.6 : 1};
`
```

### 3. Component Integrity Testing (`__tests__/component-integrity.test.tsx`)

**Purpose**: Comprehensive analysis of all components for potential issues.

**Features:**
- Static file analysis for styled-components patterns
- Component rendering validation
- Stress testing with rapid re-renders
- Memory leak detection
- Nested component testing

### 4. Runtime Error Detection (E2E) (`e2e/runtime-error-detection.spec.ts`)

**Purpose**: Real browser testing for runtime errors across all pages.

**Tests:**
- Homepage error detection
- Navigation between pages
- Mobile viewport testing
- Rapid user interactions
- DOM prop forwarding warnings
- Server-side rendering validation

## Available Test Scripts

```bash
# Run all unit/integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test suites
npm run test:hydration        # Hydration error tests only
npm run test:styled          # Styled-components error tests only
npm run test:integrity       # Component integrity tests only

# Run end-to-end tests
npm run test:e2e

# Run E2E tests with UI (interactive)
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

## Error Patterns Detected

### 1. Hydration Errors
```
❌ Hydration failed because the server rendered HTML didn't match the client
❌ Server HTML contained <div> but client HTML contained <span>
❌ Text content did not match. Server: "0" Client: "2"
```

### 2. Factory Call Errors
```
❌ undefined is not an object (evaluating 'originalFactory.call')
❌ Cannot read properties of undefined (reading 'call')
❌ TypeError: originalFactory.call is not a function
```

### 3. DOM Prop Forwarding Warnings
```
❌ React does not recognize the `isActive` prop on a DOM element
❌ Warning: Unknown prop `customProp` on <div> tag
```

## Best Practices Enforced

### ✅ Correct Styled-Components Pattern
```typescript
const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['$variant', '$isActive', '$size'].includes(prop)
})<{ 
  $variant?: 'primary' | 'secondary'
  $isActive?: boolean
  $size?: 'small' | 'large' 
}>`
  background: ${props => props.$variant === 'primary' ? '#007bff' : '#6c757d'};
  opacity: ${props => props.$isActive ? 1 : 0.7};
  padding: ${props => props.$size === 'small' ? '4px 8px' : '12px 24px'};
`
```

### ✅ Usage with $ Prefix
```typescript
<StyledButton 
  $variant="primary" 
  $isActive={true} 
  $size="large"
>
  Click me
</StyledButton>
```

### ❌ Patterns That Cause Errors
```typescript
// Missing withConfig - causes factory errors
const BadButton = styled.button<{ variant?: string }>`
  background: ${props => props.variant === 'primary' ? '#007bff' : '#6c757d'};
`

// Using DOM props without $ prefix - causes prop forwarding warnings
<BadButton variant="primary" isActive={true}>Click me</BadButton>
```

## CI/CD Integration

Add to your CI pipeline:
```yaml
# GitHub Actions example
- name: Run Tests
  run: |
    npm run test:coverage
    npm run test:e2e
    npm run lint
```

## Coverage Goals

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Monitoring

The test suite automatically:
- Captures console errors and warnings
- Analyzes error patterns
- Reports specific issues with file locations
- Provides actionable feedback for fixes

## Quick Start

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Run quick validation**:
   ```bash
   npm run test:styled
   ```

3. **Run full suite**:
   ```bash
   npm run test:all
   ```

4. **Fix any issues** following the patterns in this guide

5. **Integrate into CI/CD** for continuous monitoring

This testing suite ensures your application remains free from hydration mismatches and styled-components factory call errors across all environments and use cases.