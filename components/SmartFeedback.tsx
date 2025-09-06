import React from 'react'
import { useToast } from './Toast'
import { useMobile } from '../hooks/useMobile'

interface SmartFeedbackProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onMobileAlternative?: () => void
}

export const useSmartFeedback = () => {
  const { showToast } = useToast()
  const isMobile = useMobile()

  const showFeedback = (
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration?: number,
    mobileAlternative?: () => void
  ) => {
    if (isMobile && mobileAlternative) {
      // Use mobile-specific alternative
      mobileAlternative()
    } else {
      // Use toast on desktop
      showToast(message, type, duration)
    }
  }

  return { showFeedback, isMobile }
}