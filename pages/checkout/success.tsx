import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import styled from 'styled-components'
import Link from 'next/link'
import { formatPrice as formatPriceUtil } from '../../lib/formatUtils'
import { products, Product } from '../../data/products'

const SuccessContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`

const MainSuccessCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 80px 60px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.08);
  text-align: center;
  width: 100%;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(16, 185, 129, 0.1);
  margin-bottom: 40px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(90deg, #10b981, #059669, #10b981);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0%, 100% { background-position: 200% 0; }
    50% { background-position: -200% 0; }
  }
  
  @media (max-width: 768px) {
    padding: 60px 40px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 40px 24px;
  }
`

const SuccessIcon = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  color: white;
  margin: 0 auto 40px auto;
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
  animation: successPulse 2s ease-out;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: -8px;
    border: 2px solid rgba(16, 185, 129, 0.2);
    border-radius: 50%;
    animation: ripple 2s ease-out infinite;
  }
  
  @keyframes successPulse {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes ripple {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 48px;
    margin-bottom: 32px;
  }
`

const HeroTitle = styled.h1`
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.02em;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
  
  @media (max-width: 480px) {
    font-size: 32px;
  }
`

const HeroSubtitle = styled.p`
  font-size: 20px;
  color: #475569;
  margin-bottom: 48px;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`

const OrderSummary = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 48px;
  text-align: left;
  
  @media (max-width: 480px) {
    padding: 24px;
  }
`

const SummaryTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '📋';
    font-size: 24px;
  }
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  font-family: 'Inter', sans-serif;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-top: 8px;
    font-weight: 700;
    color: #10b981;
  }
  
  .label {
    color: #64748b;
    font-size: 16px;
    font-weight: 500;
  }
  
  .value {
    color: #1e293b;
    font-size: 16px;
    font-weight: 600;
    
    &.highlight {
      color: #10b981;
      font-weight: 700;
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    
    .label {
      font-size: 14px;
    }
    
    .value {
      font-size: 15px;
    }
  }
`

const NextStepsCard = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px solid #bbf7d0;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 48px;
  text-align: left;
  
  @media (max-width: 480px) {
    padding: 24px;
  }
`

const NextStepsTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #166534;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '🚀';
    font-size: 24px;
  }
`

const StepsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    font-size: 16px;
    color: #166534;
    margin-bottom: 12px;
    padding-left: 32px;
    position: relative;
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      top: 2px;
      width: 24px;
      height: 24px;
      background: #16a34a;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
  }
`

const PrimaryActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  color: white;
  padding: 18px 36px;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  min-width: 200px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(255, 107, 53, 0.4);
  }
  
  @media (max-width: 480px) {
    padding: 16px 24px;
    font-size: 16px;
  }
`

const SecondaryActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: white;
  color: #64748b;
  padding: 18px 36px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 700;
  font-size: 18px;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  min-width: 200px;
  
  &:hover {
    border-color: #10b981;
    color: #10b981;
    background: #f0fdf4;
    transform: translateY(-1px);
  }
  
  @media (max-width: 480px) {
    padding: 16px 24px;
    font-size: 16px;
  }
`

const TrustSignals = styled.div`
  background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
  border: 2px solid #fde68a;
  border-radius: 20px;
  padding: 28px;
  text-align: center;
  
  .title {
    font-size: 18px;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 16px;
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    
    &::before {
      content: '🔒';
      font-size: 20px;
    }
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 20px;
  }
  
  .feature {
    font-size: 14px;
    color: #92400e;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`

const PeopleAlsoBuySection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  width: 100%;
  
  @media (max-width: 480px) {
    padding: 32px 24px;
  }
`

const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  font-family: 'Inter', sans-serif;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  &::before {
    content: '🛒';
    font-size: 28px;
  }
`

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: #64748b;
  margin-bottom: 32px;
  font-family: 'Inter', sans-serif;
  text-align: center;
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

const ProductCard = styled(Link)`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px 20px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
  text-align: center;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #FF6B35;
  }
  
  .product-icon {
    font-size: 32px;
    margin-bottom: 12px;
    display: block;
  }
  
  .product-name {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
    font-family: 'Inter', sans-serif;
    line-height: 1.4;
  }
  
  .product-price {
    font-size: 14px;
    font-weight: 700;
    color: #FF6B35;
    font-family: 'Inter', sans-serif;
  }
  
  @media (max-width: 480px) {
    padding: 20px 16px;
    
    .product-icon {
      font-size: 28px;
      margin-bottom: 10px;
    }
    
    .product-name {
      font-size: 15px;
    }
    
    .product-price {
      font-size: 13px;
    }
  }
`

const ViewAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  color: white;
  padding: 16px 32px;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  display: flex;
  width: fit-content;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
  }
`

const SuccessPage: React.FC = () => {
  const [orderInfo, setOrderInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get order information from localStorage
    const orderId = localStorage.getItem('lastOrderId')
    const orderNumber = localStorage.getItem('lastOrderNumber')
    const paypalTransactionId = localStorage.getItem('paypalTransactionId')
    const paypalOrderId = localStorage.getItem('paypalOrderId')
    const paymentAmount = localStorage.getItem('paymentAmount')
    const paymentCurrency = localStorage.getItem('paymentCurrency')
    const customerEmail = localStorage.getItem('customerEmail')

    if (orderId) {
      setOrderInfo({
        orderId,
        orderNumber,
        paypalTransactionId,
        paypalOrderId,
        paymentAmount: paymentAmount ? parseFloat(paymentAmount) : 0,
        paymentCurrency: paymentCurrency || 'EUR',
        customerEmail
      })
    }

    setIsLoading(false)
  }, [])

  const formatPrice = (price: number) => {
    return formatPriceUtil(price)
  }

  // Get recommended products for "People also buy" section
  const getRecommendedProducts = (): Product[] => {
    // Show top 3 most popular products
    const popularProducts = [
      products.find(p => p.id === 'youtube-views'),
      products.find(p => p.id === 'youtube-likes'),
      products.find(p => p.id === 'youtube-subscribers')
    ].filter(Boolean) as Product[]
    
    return popularProducts
  }

  const getProductStartingPrice = (product: Product): string => {
    return formatPrice(product.basePrice * (product.quantityOptions[0] || 1000))
  }

  if (isLoading) {
    return (
      <Layout title="Zahlung erfolgreich - youshark">
        <SuccessContainer>
          <MainSuccessCard>
            <div style={{ color: '#64748b', fontSize: '18px' }}>Wird geladen...</div>
          </MainSuccessCard>
        </SuccessContainer>
      </Layout>
    )
  }

  return (
    <Layout 
      title="Zahlung erfolgreich - youshark"
      description="Ihre PayPal-Zahlung wurde erfolgreich verarbeitet. Ihre YouTube Growth Services werden in Kürze geliefert."
    >
      <SuccessContainer>
        <MainSuccessCard>
          <SuccessIcon>✅</SuccessIcon>
          
          <HeroTitle>Zahlung erfolgreich!</HeroTitle>
          
          <HeroSubtitle>
            Vielen Dank für Ihr Vertrauen! Ihre PayPal-Zahlung wurde erfolgreich verarbeitet und Ihre YouTube Services werden bereits vorbereitet.
          </HeroSubtitle>

          {orderInfo && (
            <OrderSummary>
              <SummaryTitle>Bestellübersicht</SummaryTitle>
              
              {orderInfo.orderNumber && (
                <DetailRow>
                  <span className="label">Bestellnummer</span>
                  <span className="value highlight">#{orderInfo.orderNumber}</span>
                </DetailRow>
              )}
              
              {orderInfo.customerEmail && (
                <DetailRow>
                  <span className="label">E-Mail</span>
                  <span className="value">{orderInfo.customerEmail}</span>
                </DetailRow>
              )}
              
              {orderInfo.paymentAmount > 0 && (
                <DetailRow>
                  <span className="label">Gezahlter Betrag</span>
                  <span className="value highlight">
                    {formatPrice(orderInfo.paymentAmount)}
                  </span>
                </DetailRow>
              )}
            </OrderSummary>
          )}

          <NextStepsCard>
            <NextStepsTitle>Was passiert jetzt?</NextStepsTitle>
            <StepsList>
              <li>Sie erhalten eine Bestätigungs-E-Mail von PayPal</li>
              <li>Unser Team überprüft Ihre Bestellung binnen 30 Minuten</li>
              <li>Die Lieferung Ihrer YouTube Services startet automatisch</li>
              <li>Verfolgen Sie den Fortschritt in Ihrem Dashboard</li>
              <li>Bei Fragen hilft unser 24/7 Support-Team gerne weiter</li>
            </StepsList>
          </NextStepsCard>

          <ActionButtonsContainer>
            <PrimaryActionButton href="/shop">
              Weitere Services entdecken
            </PrimaryActionButton>
            
            <SecondaryActionButton href="/">
              Zur Startseite
            </SecondaryActionButton>
          </ActionButtonsContainer>

          <TrustSignals>
            <div className="title">Sicher & Vertrauenswürdig</div>
            <div className="features">
              <div className="feature">⚡ Lieferung in 30 Min</div>
              <div className="feature">🔒 SSL-verschlüsselt</div>
              <div className="feature">💎 Echte Nutzer</div>
              <div className="feature">🎯 24/7 Support</div>
            </div>
          </TrustSignals>
        </MainSuccessCard>

        <PeopleAlsoBuySection>
          <SectionTitle>Das kaufen andere auch</SectionTitle>
          <SectionSubtitle>
            Maximieren Sie Ihren YouTube-Erfolg mit diesen beliebten Services
          </SectionSubtitle>
          
          <ProductGrid>
            {getRecommendedProducts().map((product) => (
              <ProductCard key={product.id} href={`/products/${product.slug}`}>
                <span className="product-icon">{product.icon}</span>
                <div className="product-name">{product.name}</div>
                <div className="product-price">ab {getProductStartingPrice(product)}</div>
              </ProductCard>
            ))}
          </ProductGrid>
          
          <ViewAllButton href="/shop">
            Alle Services entdecken →
          </ViewAllButton>
        </PeopleAlsoBuySection>

      </SuccessContainer>
    </Layout>
  )
}

export default SuccessPage