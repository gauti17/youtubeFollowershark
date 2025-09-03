import type { AppProps } from 'next/app'
import { CartProvider } from '../lib/CartContext'
import GlobalStyles from '../styles/GlobalStyles'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { LoadingOverlay } from '../components/Loading'

// Google Analytics
declare global {
  interface Window {
    gtag: any
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState(false)

  useEffect(() => {
    // Page loading states
    const handleRouteStart = (url: string) => {
      // Don't show loading for anchor links or same page navigation
      if (url !== router.asPath && !url.includes('#')) {
        setIsPageLoading(true)
      }
    }
    
    const handleRouteEnd = () => {
      setIsPageLoading(false)
    }

    const handleRouteError = () => {
      setIsPageLoading(false)
    }

    router.events.on('routeChangeStart', handleRouteStart)
    router.events.on('routeChangeComplete', handleRouteEnd)
    router.events.on('routeChangeError', handleRouteError)

    // Cleanup
    return () => {
      router.events.off('routeChangeStart', handleRouteStart)
      router.events.off('routeChangeComplete', handleRouteEnd)
      router.events.off('routeChangeError', handleRouteError)
    }
  }, [router])

  useEffect(() => {
    // Google Analytics
    const handleRouteChange = (url: string) => {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
          page_path: url,
        })
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // Show maintenance mode if enabled
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>🚧 Wartungsmodus</h1>
        <p style={{ color: '#666', textAlign: 'center' }}>
          Wir arbeiten gerade an Verbesserungen für Sie.<br />
          Bitte versuchen Sie es in wenigen Minuten erneut.
        </p>
      </div>
    )
  }

  return (
    <CartProvider>
      <GlobalStyles />
      <Component {...pageProps} />
      <LoadingOverlay show={isPageLoading} text="Seite wird geladen..." />
    </CartProvider>
  )
}