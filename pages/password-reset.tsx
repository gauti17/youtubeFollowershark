import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { ButtonWithSpinner } from '../components/Loading'

const Container = styled.div`
  max-width: 450px;
  margin: 60px auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: 0.05;
    z-index: -2;
  }
  
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.05) 0%, transparent 50%);
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin: 20px auto;
    padding: 16px;
    min-height: calc(100vh - 140px);
  }
  
  @media (max-width: 480px) {
    margin: 10px auto;
    padding: 12px;
  }
`

const ResetCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  width: 100%;
  animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  
  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #FF6B35, #F7931E, #FF6B35);
    border-radius: 24px 24px 0 0;
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0%, 100% { background-position: 200% 0; }
    50% { background-position: -200% 0; }
  }
  
  @media (max-width: 640px) {
    padding: 32px 24px;
    border-radius: 20px;
  }
`

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  box-shadow: 0 8px 16px rgba(255, 107, 53, 0.3);
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #1a1a1a 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
  line-height: 1.2;
  
  @media (max-width: 640px) {
    font-size: 24px;
  }
`

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
  text-align: center;
  margin-bottom: 32px;
  font-weight: 400;
  line-height: 1.5;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  &.submitting {
    pointer-events: none;
    opacity: 0.8;
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  
  &:focus-within {
    label {
      color: #FF6B35;
      transform: translateY(-1px);
    }
    
    &::before {
      opacity: 1;
      transform: scaleX(1);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #FF6B35, #F7931E);
    opacity: 0;
    transform: scaleX(0);
    transition: all 0.3s ease;
    border-radius: 1px;
  }
`

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 15px;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
`

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e2e8f0'};
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', sans-serif;
  background: ${props => props.$hasError ? '#fef2f2' : 'white'};
  position: relative;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#FF6B35'};
    box-shadow: ${props => props.$hasError 
      ? '0 0 0 3px rgba(239, 68, 68, 0.1)' 
      : '0 0 0 3px rgba(255, 107, 53, 0.1)'};
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #9ca3af;
  }
  
  &:hover:not(:focus) {
    border-color: ${props => props.$hasError ? '#ef4444' : '#d1d5db'};
  }
`

const SubmitButton = styled.button<{ loading?: boolean }>`
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  padding: 18px 32px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: ${props => props.loading ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 12px;
  opacity: ${props => props.loading ? 0.7 : 1};
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: ${props => props.loading ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.loading ? 'none' : '0 12px 24px rgba(255, 107, 53, 0.25), 0 4px 8px rgba(255, 107, 53, 0.1)'};
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: ${props => props.loading ? 'none' : 'translateY(-1px)'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  animation: slideInError 0.3s ease;
  
  @keyframes slideInError {
    0% {
      opacity: 0;
      transform: translateY(-4px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &::before {
    content: '⚠️';
    font-size: 12px;
  }
`

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 15px;
  margin-bottom: 24px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: slideInSuccess 0.5s ease;
  
  @keyframes slideInSuccess {
    0% {
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  &::before {
    content: '✅';
    font-size: 16px;
  }
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #FF6B35;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  margin-top: 24px;
  padding: 8px 0;
  transition: all 0.2s ease;
  
  &:hover {
    color: #F7931E;
    transform: translateX(-2px);
  }
  
  &::before {
    content: '←';
    font-size: 16px;
  }
`

const SecurityNote = styled.div`
  text-align: center;
  margin-top: 24px;
  padding: 12px 16px;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  color: #059669;
  font-size: 14px;
  font-weight: 500;
`

const FloatingElement = styled.div<{ delay?: number; size?: number }>`
  position: absolute;
  width: ${props => props.size || 60}px;
  height: ${props => props.size || 60}px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(247, 147, 30, 0.05));
  animation: float 6s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
  pointer-events: none;
  z-index: -1;
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    33% {
      transform: translateY(-15px) rotate(120deg);
    }
    66% {
      transform: translateY(5px) rotate(240deg);
    }
  }
  
  @media (max-width: 768px) {
    width: ${props => (props.size || 60) * 0.7}px;
    height: ${props => (props.size || 60) * 0.7}px;
    opacity: 0.7;
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`

const PasswordResetPage: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('E-Mail-Adresse ist erforderlich')
      return
    }
    
    if (!validateEmail(email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Ein Fehler ist aufgetreten')
        return
      }

      setSuccess(data.message)
      setEmailSent(true)
      
      // In development, log the reset URL for testing
      if (data.resetUrl && process.env.NODE_ENV === 'development') {
        console.log('Reset URL for testing:', data.resetUrl)
      }

    } catch (error) {
      console.error('Password reset error:', error)
      setError('Ein Netzwerkfehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) {
      setError('')
    }
  }

  return (
    <Layout 
      title="Passwort zurücksetzen - youshark"
      description="Setzen Sie Ihr youshark Passwort zurück und erhalten Sie wieder Zugang zu Ihrem Konto."
    >
      <Container>
        <FloatingElement size={80} delay={0} style={{ top: '15%', left: '8%' }} />
        <FloatingElement size={120} delay={2} style={{ bottom: '25%', right: '12%' }} />
        <FloatingElement size={60} delay={4} style={{ top: '60%', left: '5%' }} />
        <FloatingElement size={90} delay={1} style={{ top: '40%', right: '8%' }} />
        
        <ResetCard>
          <IconContainer>
            🔒
          </IconContainer>
          
          <Title>Passwort zurücksetzen</Title>
          <Subtitle>
            {emailSent 
              ? 'Überprüfen Sie Ihr Postfach auf weitere Anweisungen'
              : 'Geben Sie Ihre E-Mail-Adresse ein, um einen Reset-Link zu erhalten'
            }
          </Subtitle>

          {success && (
            <SuccessMessage>{success}</SuccessMessage>
          )}

          {error && (
            <ErrorMessage>{error}</ErrorMessage>
          )}

          {!emailSent && (
            <Form onSubmit={handleSubmit} className={loading ? 'submitting' : ''}>
              <InputGroup>
                <Label>E-Mail-Adresse</Label>
                <Input
                  type="email"
                  placeholder="ihre@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  $hasError={!!error}
                  autoComplete="email"
                  autoFocus
                />
              </InputGroup>

              <SubmitButton type="submit" loading={loading} disabled={loading}>
                <ButtonWithSpinner loading={loading} size="small">
                  Reset-Link senden
                </ButtonWithSpinner>
              </SubmitButton>
            </Form>
          )}

          <BackLink href="/auth">
            Zurück zur Anmeldung
          </BackLink>

          <SecurityNote>
            🔐 Der Reset-Link ist 24 Stunden lang gültig
          </SecurityNote>
        </ResetCard>
      </Container>
    </Layout>
  )
}

export default PasswordResetPage