import React, { createContext, useContext, useState, useCallback } from 'react'
import styled, { keyframes, css } from 'styled-components'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void
  removeToast: (id: string) => void
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
  
  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
`

const ToastItem = styled.div<{ type: Toast['type']; isLeaving?: boolean }>`
  padding: 16px 20px;
  border-radius: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${props => props.isLeaving ? css`${slideOut} 0.3s ease-in-out` : css`${slideIn} 0.3s ease-out`};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return css`
          background: #10b981;
          color: white;
        `
      case 'error':
        return css`
          background: #ef4444;
          color: white;
        `
      case 'warning':
        return css`
          background: #f59e0b;
          color: white;
        `
      case 'info':
      default:
        return css`
          background: #3b82f6;
          color: white;
        `
    }
  }}
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.3);
    animation: progress 3s linear;
  }
  
  @keyframes progress {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
  }
`

const ToastIcon = styled.span<{ type: Toast['type'] }>`
  margin-right: 8px;
  font-weight: 600;
  
  &::before {
    content: ${props => {
      switch (props.type) {
        case 'success':
          return '"✅"'
        case 'error':
          return '"❌"'
        case 'warning':
          return '"⚠️"'
        case 'info':
        default:
          return '"ℹ️"'
      }
    }};
  }
`

const ToastContext = createContext<ToastContextType | null>(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<(Toast & { isLeaving?: boolean })[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, isLeaving: true } : toast
    ))
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 300)
  }, [])

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration: number = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            type={toast.type}
            isLeaving={toast.isLeaving}
            onClick={() => removeToast(toast.id)}
          >
            <ToastIcon type={toast.type} />
            {toast.message}
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

export default ToastProvider