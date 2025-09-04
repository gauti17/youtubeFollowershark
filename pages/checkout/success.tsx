import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import styled from 'styled-components'
import Link from 'next/link'
import { formatPrice as formatPriceUtil } from '../../lib/formatUtils'
import { products, Product } from '../../data/products'

const SuccessContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 40px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SuccessCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
  margin: 0 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  
  @media (max-width: 768px) {
    padding: 40px 30px;
    margin: 0 15px;
  }
`

const SuccessIcon = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: white;
  margin: 0 auto 30px auto;
  animation: bounce 0.6s ease-out;
  
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

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  font-family: 'Inter', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`

const Subtitle = styled.p`
  font-size: 18px;
  color: #4a5568;
  margin-bottom: 40px;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const OrderDetails = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
  text-align: left;
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-family: 'Inter', sans-serif;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
    font-weight: 600;
  }
  
  .label {
    color: #4a5568;
    font-size: 14px;
  }
  
  .value {
    color: #1a1a1a;
    font-size: 14px;
    font-weight: 500;
    
    &.highlight {
      color: #10b981;
      font-weight: 600;
    }
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 30px;
`

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  color: white;
  padding: 16px 32px;
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
  color: #4a5568;
  padding: 16px 32px;
  border: 2px solid #e2e8f0;
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

const WarningMessage = styled.div`
  background: #fef3cd;
  border: 1px solid #fde047;
  color: #a16207;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
`

const InfoBox = styled.div`
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  color: #0369a1;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: left;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #0369a1;
    font-family: 'Inter', sans-serif;
  }
  
  p {
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
    font-family: 'Inter', sans-serif;
  }
  
  ul {
    margin: 8px 0 0 16px;
    font-size: 14px;
    line-height: 1.6;
  }
`

const RecommendationSection = styled.div`
  margin: 50px 0 30px 0;
  padding: 40px 30px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px;
  border: 1px solid #e2e8f0;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 10px;
  font-family: 'Inter', sans-serif;
`

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: #64748b;
  text-align: center;
  margin-bottom: 30px;
  font-family: 'Inter', sans-serif;
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`

const ProductCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border-color: #FF6B35;
  }
`

const ProductIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
  text-align: center;
`

const ProductTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  text-align: center;
  font-family: 'Inter', sans-serif;
`

const ProductDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
  text-align: center;
  font-family: 'Inter', sans-serif;
`

const ProductFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  
  li {
    font-size: 13px;
    color: #4a5568;
    margin-bottom: 4px;
    position: relative;
    padding-left: 16px;
    font-family: 'Inter', sans-serif;
    
    &:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: bold;
    }
  }
`

const ProductPrice = styled.div`
  text-align: center;
  margin-bottom: 16px;
  
  .from {
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .price {
    font-size: 20px;
    font-weight: 700;
    color: #FF6B35;
    font-family: 'Inter', sans-serif;
  }
`

const ProductButton = styled(Link)`
  display: block;
  text-align: center;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
  }
`

const TestimonialsSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  margin: 30px 0;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
`

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const TestimonialCard = styled.div`
  background: #f8fafc;
  padding: 24px;
  border-radius: 16px;
  border-left: 4px solid #FF6B35;
  
  .quote {
    font-size: 15px;
    color: #374151;
    line-height: 1.6;
    margin-bottom: 16px;
    font-style: italic;
    font-family: 'Inter', sans-serif;
  }
  
  .author {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    font-family: 'Inter', sans-serif;
  }
  
  .rating {
    color: #fbbf24;
    margin-bottom: 8px;
  }
`

const SupportSection = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 40px 30px;
  border-radius: 20px;
  margin: 30px 0;
  text-align: center;
`

const SupportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`

const SupportItem = styled.div`
  text-align: center;
  
  .icon {
    font-size: 32px;
    margin-bottom: 12px;
    display: block;
  }
  
  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    font-family: 'Inter', sans-serif;
  }
  
  .description {
    font-size: 14px;
    color: #cbd5e1;
    font-family: 'Inter', sans-serif;
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

  // Get recommended products (exclude current if available)
  const getRecommendedProducts = (): Product[] => {
    return products.slice(0, 3) // Show first 3 products
  }

  // Sample testimonials
  const testimonials = [
    {
      quote: "Sehr schnelle Lieferung und echte Views! Mein Video hat dadurch viel mehr Aufmerksamkeit bekommen. Kann YouTubeShark nur weiterempfehlen!",
      author: "Sarah M.",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      quote: "Professioneller Service und faire Preise. Die Abonnenten sind echt und bleiben auch dabei. Genau das was ich gesucht habe!",
      author: "Michael K.",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      quote: "Super Support und schnelle Abwicklung. Habe bereits mehrmals bestellt und bin immer zufrieden gewesen. Top Service!",
      author: "Lisa T.",
      rating: "⭐⭐⭐⭐⭐"
    }
  ]

  if (isLoading) {
    return (
      <Layout title="Zahlung erfolgreich - youshark">
        <SuccessContainer>
          <SuccessCard>
            <div>Loading...</div>
          </SuccessCard>
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
        <SuccessCard>
          <SuccessIcon>✅</SuccessIcon>
          
          <Title>Zahlung erfolgreich!</Title>
          
          <Subtitle>
            Vielen Dank für Ihre Bestellung! Ihre PayPal-Zahlung wurde erfolgreich verarbeitet und Ihre YouTube Growth Services werden in Kürze gestartet.
          </Subtitle>

          {orderInfo?.paypalTransactionId && (
            <WarningMessage>
              ⚠️ <strong>Wichtiger Hinweis:</strong> Obwohl die PayPal-Zahlung erfolgreich war, konnte möglicherweise nicht alle Bestelldetails in unser System übertragen werden. Unser Support-Team wird sich in Kürze bei Ihnen melden, um sicherzustellen, dass Ihre Services ordnungsgemäß gestartet werden.
            </WarningMessage>
          )}

          {orderInfo && (
            <OrderDetails>
              {orderInfo.orderNumber && (
                <DetailRow>
                  <span className="label">Bestellnummer:</span>
                  <span className="value highlight">#{orderInfo.orderNumber}</span>
                </DetailRow>
              )}
              
              {orderInfo.paypalTransactionId && (
                <DetailRow>
                  <span className="label">PayPal Transaction ID:</span>
                  <span className="value">{orderInfo.paypalTransactionId}</span>
                </DetailRow>
              )}
              
              {orderInfo.paypalOrderId && (
                <DetailRow>
                  <span className="label">PayPal Order ID:</span>
                  <span className="value">{orderInfo.paypalOrderId}</span>
                </DetailRow>
              )}
              
              {orderInfo.customerEmail && (
                <DetailRow>
                  <span className="label">E-Mail-Adresse:</span>
                  <span className="value">{orderInfo.customerEmail}</span>
                </DetailRow>
              )}
              
              {orderInfo.paymentAmount > 0 && (
                <DetailRow>
                  <span className="label">Bezahlter Betrag:</span>
                  <span className="value highlight">
                    {formatPrice(orderInfo.paymentAmount)}
                  </span>
                </DetailRow>
              )}
            </OrderDetails>
          )}

          <InfoBox>
            <h4>📋 Was passiert als nächstes?</h4>
            <ul>
              <li>Sie erhalten eine Bestätigungs-E-Mail von PayPal</li>
              <li>Unser Team überprüft Ihre Bestellung (normalerweise innerhalb von 30 Minuten)</li>
              <li>Die Lieferung Ihrer YouTube Services beginnt sofort nach der Überprüfung</li>
              <li>Sie können den Fortschritt in Ihrem Dashboard verfolgen</li>
            </ul>
          </InfoBox>

          <ButtonGroup>
            <PrimaryButton href="/dashboard">
              📊 Zum Dashboard
            </PrimaryButton>
            
            <SecondaryButton href="/">
              🏠 Zur Startseite
            </SecondaryButton>
          </ButtonGroup>
        </SuccessCard>

        {/* Recommended Products Section */}
        <RecommendationSection>
          <SectionTitle>🛒 Kunden kauften auch</SectionTitle>
          <SectionSubtitle>
            Steigern Sie Ihren YouTube-Erfolg mit unseren beliebtesten Services
          </SectionSubtitle>
          
          <ProductGrid>
            {getRecommendedProducts().map((product) => (
              <ProductCard key={product.id}>
                <ProductIcon>{product.icon}</ProductIcon>
                <ProductTitle>{product.name}</ProductTitle>
                <ProductDescription>{product.description}</ProductDescription>
                
                <ProductFeatures>
                  {product.features.slice(0, 3).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ProductFeatures>
                
                <ProductPrice>
                  <div className="from">Ab</div>
                  <div className="price">{formatPrice(product.basePrice * product.quantityOptions[0])}</div>
                </ProductPrice>
                
                <ProductButton href={`/product/${product.slug}`}>
                  Jetzt bestellen
                </ProductButton>
              </ProductCard>
            ))}
          </ProductGrid>
        </RecommendationSection>

        {/* Customer Testimonials */}
        <TestimonialsSection>
          <SectionTitle>💬 Das sagen unsere Kunden</SectionTitle>
          <SectionSubtitle>
            Überzeugen Sie sich von der Qualität unserer Services
          </SectionSubtitle>
          
          <TestimonialGrid>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index}>
                <div className="rating">{testimonial.rating}</div>
                <div className="quote">"{testimonial.quote}"</div>
                <div className="author">- {testimonial.author}</div>
              </TestimonialCard>
            ))}
          </TestimonialGrid>
        </TestimonialsSection>

        {/* Support Section */}
        <SupportSection>
          <SectionTitle style={{color: 'white'}}>🚀 Warum YouTubeShark?</SectionTitle>
          <SectionSubtitle style={{color: '#cbd5e1'}}>
            Professionelle YouTube Services mit garantierten Ergebnissen
          </SectionSubtitle>
          
          <SupportGrid>
            <SupportItem>
              <span className="icon">⚡</span>
              <div className="title">Schnelle Lieferung</div>
              <div className="description">Ihre Services starten innerhalb von 30 Minuten</div>
            </SupportItem>
            
            <SupportItem>
              <span className="icon">🔒</span>
              <div className="title">100% Sicher</div>
              <div className="description">SSL-verschlüsselt und YouTube-konform</div>
            </SupportItem>
            
            <SupportItem>
              <span className="icon">💎</span>
              <div className="title">Premium Qualität</div>
              <div className="description">Echte, aktive Nutzer - keine Bots</div>
            </SupportItem>
            
            <SupportItem>
              <span className="icon">🎯</span>
              <div className="title">24/7 Support</div>
              <div className="description">Unser Team hilft Ihnen jederzeit weiter</div>
            </SupportItem>
          </SupportGrid>
        </SupportSection>

      </SuccessContainer>
    </Layout>
  )
}

export default SuccessPage