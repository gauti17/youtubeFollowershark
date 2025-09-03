import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import styled from 'styled-components'

const SuccessContainer = styled.div`
  min-height: 80vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`

const SuccessCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  
  @media (max-width: 768px) {
    padding: 40px 30px;
  }
`

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px auto;
  font-size: 36px;
  color: white;
  animation: bounce 1s ease-in-out;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`

const SuccessTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 16px;
  font-family: 'Inter', sans-serif;
`

const SuccessMessage = styled.p`
  font-size: 18px;
  color: #047857;
  line-height: 1.6;
  margin-bottom: 40px;
  font-family: 'Inter', sans-serif;
`

const NextSteps = styled.div`
  background: #f0fdf4;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  text-align: left;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #065f46;
    margin-bottom: 16px;
    font-family: 'Inter', sans-serif;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      font-size: 15px;
      color: #047857;
      margin-bottom: 8px;
      padding-left: 24px;
      position: relative;
      font-family: 'Inter', sans-serif;
      
      &::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #10b981;
        font-weight: bold;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 107, 53, 0.4);
  }
`

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #6b7280;
  padding: 14px 28px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    border-color: #FF6B35;
    color: #FF6B35;
    background: rgba(255, 107, 53, 0.05);
  }
`

const SupportInfo = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  
  p {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
    font-family: 'Inter', sans-serif;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    a {
      color: #7c3aed;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`

const SuccessPage: React.FC = () => {
  const [orderInfo, setOrderInfo] = useState<{
    orderId: string | null
    orderNumber: string | null
    customerId: string | null
    customerCreated: boolean
    customerEmail: string | null
  }>({
    orderId: null,
    orderNumber: null,
    customerId: null,
    customerCreated: false,
    customerEmail: null
  })

  useEffect(() => {
    // Get order info from localStorage
    const orderId = localStorage.getItem('lastOrderId')
    const orderNumber = localStorage.getItem('lastOrderNumber')
    const customerId = localStorage.getItem('lastCustomerId')
    const customerCreated = localStorage.getItem('customerCreated') === 'true'
    const customerEmail = localStorage.getItem('customerEmail')
    
    if (orderId && orderNumber) {
      setOrderInfo({ 
        orderId, 
        orderNumber, 
        customerId,
        customerCreated,
        customerEmail
      })
      
      // Clean up localStorage after displaying
      localStorage.removeItem('lastOrderId')
      localStorage.removeItem('lastOrderNumber')
      localStorage.removeItem('lastCustomerId')
      localStorage.removeItem('customerCreated')
      localStorage.removeItem('customerEmail')
    }
  }, [])

  return (
    <Layout 
      title="Bestellung erfolgreich - youshark" 
      description="Ihre Bestellung wurde erfolgreich verarbeitet. Die Lieferung startet in Kürze!"
    >
      <SuccessContainer>
        <SuccessCard>
          <SuccessIcon>✓</SuccessIcon>
          
          <SuccessTitle>Bestellung erfolgreich!</SuccessTitle>
          
          <SuccessMessage>
            Vielen Dank für Ihre Bestellung! 
            {orderInfo.orderNumber && (
              <>
                <br /><strong>Bestellnummer: #{orderInfo.orderNumber}</strong>
              </>
            )}
            <br />Wir haben Ihre Zahlung erhalten und beginnen 
            sofort mit der Bearbeitung Ihrer YouTube Growth Services.
          </SuccessMessage>
          
          {orderInfo.customerCreated && (
            <NextSteps style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '2px solid #0ea5e9' }}>
              <h3>🎉 Ihr Kundenaccount wurde erstellt!</h3>
              <ul>
                <li><strong>E-Mail-Adresse:</strong> {orderInfo.customerEmail}</li>
                <li>Zugangsdaten wurden an Ihre E-Mail gesendet</li>
                <li>Sie können sich ab sofort in Ihr Dashboard einloggen</li>
                <li>Verwalten Sie all Ihre Bestellungen an einem Ort</li>
              </ul>
            </NextSteps>
          )}
          
          <NextSteps>
            <h3>Was passiert als Nächstes?</h3>
            <ul>
              <li>Sie erhalten eine Bestätigungs-E-Mail mit allen Details</li>
              {orderInfo.customerCreated && <li>Separate E-Mail mit Ihren Zugangsdaten für das Dashboard</li>}
              <li>Die Lieferung startet automatisch innerhalb der nächsten 30 Minuten</li>
              <li>Sie können den Fortschritt in Ihrem Dashboard verfolgen</li>
              <li>Bei Fragen steht unser 24/7 Support bereit</li>
            </ul>
          </NextSteps>
          
          <ActionButtons>
            <PrimaryButton href="/shop">
              🛍️ Weitere Services
            </PrimaryButton>
            <SecondaryButton href="/">
              🏠 Zur Startseite
            </SecondaryButton>
          </ActionButtons>
          
          <SupportInfo>
            <p><strong>Benötigen Sie Hilfe?</strong></p>
            <p>
              Unser Support-Team ist 24/7 für Sie da: 
              <a href="mailto:support@youshark.com"> support@youshark.com</a>
            </p>
            <p>Durchschnittliche Antwortzeit: &lt; 2 Stunden</p>
          </SupportInfo>
        </SuccessCard>
      </SuccessContainer>
    </Layout>
  )
}

export default SuccessPage