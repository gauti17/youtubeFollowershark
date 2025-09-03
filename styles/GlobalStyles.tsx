import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #ffffff;
    min-height: 100vh;
  }

  html {
    scroll-behavior: smooth;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid #FF6B35;
    outline-offset: 2px;
  }

  /* Disable focus outline for mouse users */
  .js-focus-visible *:focus:not(.focus-visible) {
    outline: none;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    body {
      background: #ffffff;
      color: #000000;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    a,
    a:visited {
      text-decoration: underline;
    }

    .no-print {
      display: none !important;
    }
  }

  /* Dark mode support (when implemented) */
  @media (prefers-color-scheme: dark) {
    :root {
      --bg-primary: #1a1a1a;
      --text-primary: #ffffff;
      --bg-secondary: #2d2d2d;
      --text-secondary: #cccccc;
    }
  }

  /* Loading animation */
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 107, 53, 0.3);
    border-radius: 50%;
    border-top-color: #FF6B35;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Error state */
  .error {
    color: #EF4444;
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 8px;
    padding: 12px;
    margin: 8px 0;
  }

  /* Success state */
  .success {
    color: #10B981;
    background: #F0FDF4;
    border: 1px solid #BBF7D0;
    border-radius: 8px;
    padding: 12px;
    margin: 8px 0;
  }

  /* Warning state */
  .warning {
    color: #F59E0B;
    background: #FFFBEB;
    border: 1px solid #FDE68A;
    border-radius: 8px;
    padding: 12px;
    margin: 8px 0;
  }

  /* Utility classes */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .text-center {
    text-align: center;
  }

  .mb-0 { margin-bottom: 0; }
  .mb-1 { margin-bottom: 0.5rem; }
  .mb-2 { margin-bottom: 1rem; }
  .mb-3 { margin-bottom: 1.5rem; }
  .mb-4 { margin-bottom: 2rem; }

  .mt-0 { margin-top: 0; }
  .mt-1 { margin-top: 0.5rem; }
  .mt-2 { margin-top: 1rem; }
  .mt-3 { margin-top: 1.5rem; }
  .mt-4 { margin-top: 2rem; }

  /* Button base styles */
  .btn {
    display: inline-block;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .btn-primary {
    background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
  }

  .btn-secondary {
    background: #f8f9fa;
    color: #333;
    border: 1px solid #e9ecef;
  }

  .btn-secondary:hover {
    background: #e9ecef;
  }
`

export default GlobalStyles