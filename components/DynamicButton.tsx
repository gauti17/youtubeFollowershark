import React from 'react'
import styled, { keyframes, css } from 'styled-components'

type ButtonState = 'default' | 'loading' | 'success' | 'error'

interface DynamicButtonProps {
  state: ButtonState
  onClick: () => void
  disabled?: boolean
  children?: React.ReactNode
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`

const checkmark = keyframes`
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1.1) rotate(180deg); opacity: 1; }
  100% { transform: scale(1) rotate(360deg); opacity: 1; }
`

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
`

const StyledButton = styled.button<{ $state: ButtonState }>`
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 56px;
  
  ${props => {
    switch (props.$state) {
      case 'loading':
        return css`
          background: #6b7280;
          color: white;
          cursor: not-allowed;
          animation: ${pulse} 1s infinite;
        `
      case 'success':
        return css`
          background: #10b981;
          color: white;
          animation: ${pulse} 0.6s ease-out;
        `
      case 'error':
        return css`
          background: #ef4444;
          color: white;
          animation: ${shake} 0.5s ease-in-out;
        `
      case 'default':
      default:
        return css`
          background: #2563eb;
          color: white;
          
          &:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          }
          
          &:active {
            transform: translateY(0);
          }
        `
    }
  }}
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const ButtonIcon = styled.span<{ $state: ButtonState }>`
  font-size: 18px;
  display: flex;
  align-items: center;
  
  ${props => props.$state === 'success' && css`
    animation: ${checkmark} 0.6s ease-out;
  `}
`

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ButtonText = styled.span<{ $state: ButtonState }>`
  transition: all 0.3s ease;
`

export const DynamicButton: React.FC<DynamicButtonProps> = ({
  state,
  onClick,
  disabled = false,
  children
}) => {
  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return (
          <>
            <LoadingSpinner />
            <ButtonText $state={state}>Wird hinzugefügt...</ButtonText>
          </>
        )
      case 'success':
        return (
          <>
            <ButtonIcon $state={state}>✓</ButtonIcon>
            <ButtonText $state={state}>Erfolgreich hinzugefügt!</ButtonText>
          </>
        )
      case 'error':
        return (
          <>
            <ButtonIcon $state={state}>✗</ButtonIcon>
            <ButtonText $state={state}>Fehler - Erneut versuchen</ButtonText>
          </>
        )
      case 'default':
      default:
        return (
          <>
            <ButtonIcon $state={state}>🛒</ButtonIcon>
            <ButtonText $state={state}>{children || 'In den Warenkorb'}</ButtonText>
          </>
        )
    }
  }

  return (
    <StyledButton
      $state={state}
      onClick={onClick}
      disabled={disabled || state === 'loading'}
    >
      {getButtonContent()}
    </StyledButton>
  )
}

export default DynamicButton