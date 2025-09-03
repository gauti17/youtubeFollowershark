/**
 * Performance monitoring utilities
 */
import React from 'react'

export const performance = {
  /**
   * Measure and log component render time
   */
  measureComponent: (name: string) => {
    const start = Date.now()
    return () => {
      const end = Date.now()
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 ${name} rendered in ${end - start}ms`)
      }
    }
  },

  /**
   * Measure API response time
   */
  measureAPI: async <T>(name: string, promise: Promise<T>): Promise<T> => {
    const start = Date.now()
    try {
      const result = await promise
      const end = Date.now()
      if (process.env.NODE_ENV === 'development') {
        console.log(`🌐 API ${name} completed in ${end - start}ms`)
      }
      return result
    } catch (error) {
      const end = Date.now()
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ API ${name} failed after ${end - start}ms`, error)
      }
      throw error
    }
  },

  /**
   * Monitor bundle size and log warnings
   */
  reportBundleSize: () => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Check for large chunks in development
      const scripts = Array.from(document.scripts)
      const largeScripts = scripts.filter(script => {
        const src = script.src
        return src.includes('_next/static') && script.getAttribute('data-size') 
      })
      
      if (largeScripts.length > 0) {
        console.warn('📦 Large bundle detected, consider code splitting')
      }
    }
  },

  /**
   * Monitor Core Web Vitals
   */
  measureWebVitals: () => {
    if (typeof window !== 'undefined') {
      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          console.log('LCP:', lastEntry.startTime)
        })
        observer.observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            console.log('FID:', entry.processingStart - entry.startTime)
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      }

      // Cumulative Layout Shift
      if ('PerformanceObserver' in window) {
        let cumulativeLayoutShiftScore = 0
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              cumulativeLayoutShiftScore += entry.value
            }
          }
          console.log('CLS:', cumulativeLayoutShiftScore)
        })
        observer.observe({ entryTypes: ['layout-shift'] })
      }
    }
  }
}

/**
 * React hook for performance monitoring
 */
export const usePerformance = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    const measureEnd = performance.measureComponent(componentName)
    return { measureEnd }
  }
  return { measureEnd: () => {} }
}

/**
 * HOC for performance monitoring
 */
export const withPerformance = <P extends object>(
  Component: React.ComponentType<P>,
  name: string
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    const measureEnd = performance.measureComponent(name)
    
    React.useEffect(() => {
      measureEnd()
    }, [measureEnd])

    return React.createElement(Component, props)
  }

  WrappedComponent.displayName = `withPerformance(${name})`
  return WrappedComponent
}