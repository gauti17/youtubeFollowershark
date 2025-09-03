import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { ButtonWithSpinner, LoadingOverlay, FormSkeleton } from '../components/Loading'

const Container = styled.div`
  max-width: 480px;
  margin: 40px auto;
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

const AuthCard = styled.div`
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

const Title = styled.h1`
  font-size: 32px;
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
    font-size: 28px;
  }
`

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 400;
  line-height: 1.5;
`

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 6px;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
`

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#1a1a1a' : '#6b7280'};
  box-shadow: ${props => props.active ? '0 4px 8px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)' : 'none'};
  transform: ${props => props.active ? 'translateY(-1px)' : 'translateY(0)'};

  &:hover {
    color: ${props => props.active ? '#1a1a1a' : '#374151'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
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

const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 32px 0;
  gap: 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
    z-index: -1;
  }
`

const Divider = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
`

const DividerText = styled.span`
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  background: white;
  padding: 0 16px;
  position: relative;
  z-index: 1;
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

const FooterLinks = styled.div`
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
`

const ForgotPasswordLink = styled.a`
  color: #FF6B35;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    color: #F7931E;
    text-decoration: underline;
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

const AuthPage: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState('')

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    country: 'Deutschland',
    city: '',
    postalCode: ''
  })

  // Check for existing user data and pre-fill form
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      const storedCustomer = localStorage.getItem('customer')
      
      if (token && storedCustomer) {
        try {
          const customerData = JSON.parse(storedCustomer)
          // Pre-fill form with existing user data
          setFormData(prev => ({
            ...prev,
            email: customerData.email || '',
            firstName: customerData.firstName || '',
            lastName: customerData.lastName || '',
            city: customerData.billing?.city || '',
            postalCode: customerData.billing?.postcode || '',
            country: customerData.billing?.country === 'DE' ? 'Deutschland' : customerData.billing?.country || 'Deutschland'
          }))
        } catch (error) {
          console.error('Error parsing customer data:', error)
        }
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = 'E-Mail-Adresse ist erforderlich'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse'
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich'
    } else if (activeTab === 'register' && formData.password.length < 8) {
      newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein'
    }

    if (activeTab === 'register') {
      if (!formData.firstName) {
        newErrors.firstName = 'Vorname ist erforderlich'
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Nachname ist erforderlich'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setSuccessMessage('')

    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || 'Ein Fehler ist aufgetreten' })
        return
      }

      // Success - store token and redirect
      if (data.token) {
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('customer', JSON.stringify(data.customer))
      }

      if (activeTab === 'register') {
        setSuccessMessage('Konto erfolgreich erstellt! Sie werden weitergeleitet...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setSuccessMessage('Anmeldung erfolgreich! Sie werden weitergeleitet...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }

    } catch (error) {
      console.error('Auth error:', error)
      setErrors({ general: 'Ein Netzwerkfehler ist aufgetreten' })
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    setErrors({})
    setSuccessMessage('')
    
    // Only clear password, preserve pre-filled data
    setFormData(prev => ({
      ...prev,
      password: ''
    }))
  }

  return (
    <Layout 
      title={`${activeTab === 'login' ? 'Anmelden' : 'Registrieren'} - youshark`}
      description={`${activeTab === 'login' ? 'Melden Sie sich bei youshark an' : 'Erstellen Sie ein youshark-Konto'} und verwalten Sie Ihre YouTube Marketing Services.`}
    >
      <Container>
        <FloatingElement size={80} delay={0} style={{ top: '15%', left: '8%' }} />
        <FloatingElement size={120} delay={2} style={{ bottom: '25%', right: '12%' }} />
        <FloatingElement size={60} delay={4} style={{ top: '60%', left: '5%' }} />
        <FloatingElement size={90} delay={1} style={{ top: '40%', right: '8%' }} />
        
        <AuthCard>
          <Title>
            {activeTab === 'login' ? 'Willkommen zurück' : 'Konto erstellen'}
          </Title>
          <Subtitle>
            {activeTab === 'login' 
              ? 'Melden Sie sich in Ihrem youshark Konto an' 
              : 'Starten Sie mit youshark durch'}
          </Subtitle>

          <TabContainer>
            <Tab 
              active={activeTab === 'login'} 
              onClick={() => switchTab('login')}
              type="button"
            >
              Anmelden
            </Tab>
            <Tab 
              active={activeTab === 'register'} 
              onClick={() => switchTab('register')}
              type="button"
            >
              Registrieren
            </Tab>
          </TabContainer>

          {successMessage && (
            <SuccessMessage>{successMessage}</SuccessMessage>
          )}

          {errors.general && (
            <ErrorMessage style={{ marginBottom: '20px' }}>
              {errors.general}
            </ErrorMessage>
          )}

          <Form onSubmit={handleSubmit} className={loading ? 'submitting' : ''}>
            {activeTab === 'register' && (
              <>
                <InputGroup>
                  <Label>Vorname</Label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="Max"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    $hasError={!!errors.firstName}
                    autoComplete="given-name"
                  />
                  {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
                </InputGroup>

                <InputGroup>
                  <Label>Nachname</Label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Mustermann"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    $hasError={!!errors.lastName}
                    autoComplete="family-name"
                  />
                  {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
                </InputGroup>
              </>
            )}

            <InputGroup>
              <Label>E-Mail-Adresse</Label>
              <Input
                type="email"
                name="email"
                placeholder="max@example.com"
                value={formData.email}
                onChange={handleInputChange}
                $hasError={!!errors.email}
                autoComplete="email"
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <Label>Passwort</Label>
              <Input
                type="password"
                name="password"
                placeholder={activeTab === 'register' ? 'Mindestens 8 Zeichen' : 'Ihr Passwort'}
                value={formData.password}
                onChange={handleInputChange}
                $hasError={!!errors.password}
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
              />
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </InputGroup>

            {activeTab === 'register' && (
              <>
                <DividerContainer>
                  <Divider />
                  <DividerText>Optionale Angaben</DividerText>
                  <Divider />
                </DividerContainer>

                <InputGroup>
                  <Label>Land</Label>
                  <Input
                    type="text"
                    name="country"
                    placeholder="Deutschland"
                    value={formData.country}
                    onChange={handleInputChange}
                    autoComplete="country-name"
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Stadt</Label>
                  <Input
                    type="text"
                    name="city"
                    placeholder="Berlin"
                    value={formData.city}
                    onChange={handleInputChange}
                    autoComplete="address-level2"
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Postleitzahl</Label>
                  <Input
                    type="text"
                    name="postalCode"
                    placeholder="10115"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    autoComplete="postal-code"
                  />
                </InputGroup>
              </>
            )}

            <SubmitButton type="submit" loading={loading} disabled={loading}>
              <ButtonWithSpinner loading={loading} size="small">
                {activeTab === 'login' ? 'Anmelden' : 'Konto erstellen'}
              </ButtonWithSpinner>
            </SubmitButton>
          </Form>

          {activeTab === 'login' && (
            <FooterLinks>
              <ForgotPasswordLink href="/password-reset">
                Passwort vergessen?
              </ForgotPasswordLink>
            </FooterLinks>
          )}
          
          <SecurityNote>
            🔒 Ihre Daten sind durch SSL-Verschlüsselung geschützt
          </SecurityNote>
        </AuthCard>
      </Container>
    </Layout>
  )
}

export default AuthPage