import React, { useState } from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
`

const PageDescription = styled.p`
  color: #6b7280;
  font-size: 18px;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`

const ContactForm = styled.form`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
`

const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
`

const FormGroup = styled.div`
  margin-bottom: 20px;
`

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  font-size: 14px;
`

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#FF6B35'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`

const Textarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#FF6B35'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #FF6B35;
  }
`

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 14px;
  margin-top: 4px;
  display: block;
`

const SubmitButton = styled.button<{ loading?: boolean }>`
  width: 100%;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: ${props => props.loading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  opacity: ${props => props.loading ? 0.7 : 1};
  margin-top: 10px;

  &:hover {
    transform: ${props => props.loading ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.loading ? 'none' : '0 8px 20px rgba(255, 107, 53, 0.3)'};
  }
`

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`

const ContactCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  text-align: center;
`

const ContactIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`

const ContactTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`

const ContactDetail = styled.p`
  color: #6b7280;
  margin-bottom: 4px;
`

const ContactLink = styled.a`
  color: #FF6B35;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`

const FAQSection = styled.div`
  background: #f8fafc;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #f1f5f9;
`

const FAQTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
`

const FAQDescription = styled.p`
  color: #6b7280;
  margin-bottom: 20px;
  line-height: 1.6;
`

const FAQButton = styled.a`
  background: white;
  color: #FF6B35;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  transition: transform 0.2s ease;
  border: 2px solid #FF6B35;

  &:hover {
    transform: translateY(-2px);
    background: #FF6B35;
    color: white;
  }
`

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    orderNumber: '',
    message: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Nachricht ist erforderlich'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Nachricht muss mindestens 10 Zeichen lang sein'
    }

    if (formData.subject === 'order_support' && !formData.orderNumber.trim()) {
      newErrors.orderNumber = 'Bestellnummer ist bei Order-Support erforderlich'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    // Simulate form submission (replace with actual API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: 'general',
        orderNumber: '',
        message: ''
      })
    } catch (error) {
      setErrors({ general: 'Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.' })
    } finally {
      setLoading(false)
    }
  }

  const getSubjectLabel = (value: string) => {
    const subjects = {
      'general': 'Allgemeine Anfrage',
      'order_support': 'Bestellung & Support',
      'technical': 'Technische Fragen',
      'billing': 'Abrechnung & Zahlung',
      'partnership': 'Kooperationen'
    }
    return subjects[value as keyof typeof subjects] || 'Allgemeine Anfrage'
  }

  return (
    <Layout 
      title="Kontakt - youshark Support"
      description="Kontaktieren Sie das youshark Support-Team. Schnelle Hilfe bei Fragen zu Bestellungen, Services und technischen Problemen."
    >
      <Container>
        <Header>
          <PageTitle>Kontakt & Support</PageTitle>
          <PageDescription>
            Haben Sie Fragen zu unseren Services oder benötigen Hilfe bei Ihrer Bestellung? 
            Unser Support-Team ist für Sie da und antwortet innerhalb von 24 Stunden.
          </PageDescription>
        </Header>

        <ContentGrid>
          <ContactForm onSubmit={handleSubmit}>
            <FormTitle>Nachricht senden</FormTitle>
            
            {submitted && (
              <SuccessMessage>
                Vielen Dank für Ihre Nachricht! Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.
              </SuccessMessage>
            )}

            {errors.general && (
              <ErrorMessage style={{ marginBottom: '20px' }}>{errors.general}</ErrorMessage>
            )}

            <FormGroup>
              <Label>Vollständiger Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Max Mustermann"
                value={formData.name}
                onChange={handleInputChange}
                $hasError={!!errors.name}
                autoComplete="name"
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
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
            </FormGroup>

            <FormGroup>
              <Label>Betreff</Label>
              <Select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
              >
                <option value="general">Allgemeine Anfrage</option>
                <option value="order_support">Bestellung & Support</option>
                <option value="technical">Technische Fragen</option>
                <option value="billing">Abrechnung & Zahlung</option>
                <option value="partnership">Kooperationen</option>
              </Select>
            </FormGroup>

            {formData.subject === 'order_support' && (
              <FormGroup>
                <Label>Bestellnummer (optional)</Label>
                <Input
                  type="text"
                  name="orderNumber"
                  placeholder="#12345"
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  $hasError={!!errors.orderNumber}
                />
                {errors.orderNumber && <ErrorMessage>{errors.orderNumber}</ErrorMessage>}
              </FormGroup>
            )}

            <FormGroup>
              <Label>Ihre Nachricht</Label>
              <Textarea
                name="message"
                placeholder="Beschreiben Sie Ihr Anliegen so detailliert wie möglich..."
                value={formData.message}
                onChange={handleInputChange}
                $hasError={!!errors.message}
              />
              {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
            </FormGroup>

            <SubmitButton type="submit" loading={loading} disabled={loading}>
              {loading ? 'Wird gesendet...' : 'Nachricht senden'}
            </SubmitButton>
          </ContactForm>

          <ContactInfo>
            <ContactCard>
              <ContactIcon>📧</ContactIcon>
              <ContactTitle>E-Mail Support</ContactTitle>
              <ContactDetail>Schnelle Hilfe per E-Mail</ContactDetail>
              <ContactDetail>
                <ContactLink href="mailto:support@youshark.com">
                  support@youshark.com
                </ContactLink>
              </ContactDetail>
              <ContactDetail style={{ marginTop: '8px', fontSize: '14px', color: '#9ca3af' }}>
                Antwortzeit: Innerhalb von 24 Stunden
              </ContactDetail>
            </ContactCard>

            <ContactCard>
              <ContactIcon>💬</ContactIcon>
              <ContactTitle>Live Chat</ContactTitle>
              <ContactDetail>Sofortige Hilfe im Chat</ContactDetail>
              <ContactDetail>Mo-Fr: 9:00 - 18:00 Uhr</ContactDetail>
              <ContactDetail style={{ marginTop: '12px' }}>
                <ContactLink href="#" onClick={(e) => {
                  e.preventDefault();
                  alert('Live Chat wird in Kürze verfügbar sein!');
                }}>
                  Chat starten
                </ContactLink>
              </ContactDetail>
            </ContactCard>

            <ContactCard>
              <ContactIcon>📱</ContactIcon>
              <ContactTitle>WhatsApp Support</ContactTitle>
              <ContactDetail>Support via WhatsApp</ContactDetail>
              <ContactDetail>+49 (0) 123 456 789</ContactDetail>
              <ContactDetail style={{ marginTop: '12px' }}>
                <ContactLink 
                  href="https://wa.me/49123456789?text=Hallo%2C%20ich%20habe%20eine%20Frage%20zu%20youshark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp öffnen
                </ContactLink>
              </ContactDetail>
            </ContactCard>
          </ContactInfo>
        </ContentGrid>

        <FAQSection>
          <FAQTitle>Häufig gestellte Fragen</FAQTitle>
          <FAQDescription>
            Viele Fragen werden in unserem FAQ-Bereich bereits beantwortet. 
            Schauen Sie dort zuerst nach - vielleicht finden Sie sofort die Antwort!
          </FAQDescription>
          <FAQButton href="/faq">
            FAQ durchsuchen
          </FAQButton>
        </FAQSection>
      </Container>
    </Layout>
  )
}

export default ContactPage