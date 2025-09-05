import React, { useState } from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { useCart } from '../lib/CartContext'
import { formatPrice as formatPriceUtil } from '../lib/formatUtils'
import { products } from '../data/products'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ButtonWithSpinner, CartItemSkeleton, InlineLoading } from '../components/Loading'

const CartContainer = styled.div`
  min-height: 80vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 40px 0 80px 0;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 30px;
    max-width: 800px;
  }
`

const CartHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
`

const CartTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  font-family: 'FF DIN', 'DIN 1451', 'DIN Alternate', 'Franklin Gothic Medium', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`

const CartSubtitle = styled.p`
  font-size: 18px;
  color: #4a5568;
  font-family: 'Inter', sans-serif;
`

const CartItemsSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: fit-content;
`

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 30px;
  
  .icon {
    font-size: 64px;
    margin-bottom: 24px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 24px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 12px;
    font-family: 'Inter', sans-serif;
  }
  
  p {
    font-size: 16px;
    color: #718096;
    margin-bottom: 30px;
    font-family: 'Inter', sans-serif;
  }
`

const ShopButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
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

const CartItemCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: rgba(255, 107, 53, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  .icon {
    font-size: 32px;
    background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .details {
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
      font-family: 'Inter', sans-serif;
    }
    
    .url {
      font-size: 14px;
      color: #718096;
      word-break: break-word;
      overflow-wrap: break-word;
      font-family: monospace;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      
      @media (max-width: 768px) {
        white-space: normal;
        overflow: visible;
        text-overflow: unset;
        word-break: break-word;
        line-height: 1.4;
      }
    }
  }
`

const RemoveButton = styled.button<{ disabled?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.disabled ? '#a0aec0' : '#e53e3e'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 20px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background: rgba(229, 62, 62, 0.1);
    transform: scale(1.1);
  }
`

const ItemOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
  
  .option-group {
    .label {
      font-size: 14px;
      font-weight: 600;
      color: #4a5568;
      margin-bottom: 6px;
      font-family: 'Inter', sans-serif;
    }
    
    .value {
      font-size: 16px;
      color: #2d3748;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
    }
  }
`

const ItemTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  
  .quantity {
    display: flex;
    align-items: center;
    gap: 12px;
    
    span {
      font-size: 16px;
      font-weight: 600;
      color: #4a5568;
      min-width: 80px;
      font-family: 'Inter', sans-serif;
    }
    
    button {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
      font-weight: 600;
      color: #4a5568;
      transition: all 0.2s ease;
      
      &:hover {
        background: #edf2f7;
        border-color: #cbd5e0;
        color: #2d3748;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    .qty {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
      min-width: 40px;
      text-align: center;
      font-family: 'Inter', sans-serif;
    }
  }
  
  .price {
    font-size: 24px;
    font-weight: 700;
    color: #FF6B35;
    font-family: 'Inter', sans-serif;
  }
`

const OrderSummary = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: fit-content;
  position: sticky;
  top: 20px;
`

const SummaryTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  font-family: 'Inter', sans-serif;
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-family: 'Inter', sans-serif;
  
  &.total {
    padding-top: 16px;
    border-top: 2px solid #e2e8f0;
    margin-top: 20px;
    margin-bottom: 30px;
    
    .label {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a1a;
    }
    
    .value {
      font-size: 28px;
      font-weight: 700;
      color: #FF6B35;
    }
  }
  
  .label {
    font-size: 16px;
    color: #4a5568;
    font-weight: 500;
  }
  
  .value {
    font-size: 16px;
    color: #2d3748;
    font-weight: 600;
  }
`

const TrustBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #16a34a;
  font-family: 'Inter', sans-serif;
  
  .icon {
    font-size: 16px;
  }
`

const CheckoutButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  color: white;
  padding: 18px;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  margin-bottom: 20px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 107, 53, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const ContinueShoppingButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: transparent;
  color: #4a5568;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    border-color: #FF6B35;
    color: #FF6B35;
    background: rgba(255, 107, 53, 0.05);
  }
`

const UrgencyBanner = styled.div`
  background: linear-gradient(135deg, #f56565 0%, #fc8181 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  
  .title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  
  .subtitle {
    font-size: 14px;
    opacity: 0.9;
  }
`

const PaymentMethods = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  opacity: 0.8;
  
  img {
    height: 24px;
    border-radius: 4px;
  }
`

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, total, isOperationLoading, isLoading: isCartLoading } = useCart()
  const router = useRouter()
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  const handleCheckout = () => {
    router.push('/checkout')
  }

  const formatPrice = (price: number) => {
    return formatPriceUtil(price)
  }

  const formatNumber = (num: number) => {
    // Use a consistent format that works on both server and client
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const getProductInfo = (productId: string) => {
    return products.find(p => p.id === productId)
  }

  const subtotal = total
  const processing = 0 // No processing fees
  const finalTotal = subtotal

  return (
    <Layout 
      title="Warenkorb - youshark" 
      description="Überprüfen Sie Ihre YouTube Growth Services Bestellung und gehen Sie zur Kasse."
    >
      <CartContainer>
        <CartHeader>
          <CartTitle>Ihr Warenkorb</CartTitle>
          <CartSubtitle>
            {items.length === 0 
              ? "Ihr Warenkorb ist leer" 
              : `${items.length} ${items.length === 1 ? 'Service' : 'Services'} in Ihrem Warenkorb`
            }
          </CartSubtitle>
        </CartHeader>

        <Container>
          <CartItemsSection>
            {items.length === 0 ? (
              <EmptyCart>
                <div className="icon">🛒</div>
                <h3>Ihr Warenkorb ist leer</h3>
                <p>Entdecken Sie unsere Premium YouTube Growth Services und starten Sie noch heute!</p>
                <ShopButton href="/">
                  <span>🚀</span>
                  Services entdecken
                </ShopButton>
              </EmptyCart>
            ) : isCartLoading ? (
              // Show loading skeletons while cart is loading
              Array.from({ length: 3 }).map((_, index) => (
                <CartItemSkeleton key={index} />
              ))
            ) : (
              <>
                {items.map((item) => {
                  const product = getProductInfo(item.productId)
                  if (!product) return null

                  return (
                    <CartItemCard key={item.id}>
                      <ItemHeader>
                        <ItemInfo>
                          <div className="icon">{product.icon}</div>
                          <div className="details">
                            <h3>{product.name}</h3>
                            {item.selectedOptions.url && (
                              <div className="url">{item.selectedOptions.url}</div>
                            )}
                          </div>
                        </ItemInfo>
                        <RemoveButton 
                          onClick={() => removeItem(item.id)}
                          disabled={isOperationLoading(`remove_${item.id}`)}
                        >
                          <ButtonWithSpinner loading={isOperationLoading(`remove_${item.id}`)} size="small">
                            ✕
                          </ButtonWithSpinner>
                        </RemoveButton>
                      </ItemHeader>

                      <ItemOptions>
                        <div className="option-group">
                          <div className="label">Menge</div>
                          <div className="value">{formatNumber(item.selectedOptions.selectedQuantity || item.quantity)}</div>
                        </div>
                        {item.selectedOptions.speed && (
                          <div className="option-group">
                            <div className="label">Geschwindigkeit</div>
                            <div className="value">{item.selectedOptions.speed}</div>
                          </div>
                        )}
                        {item.selectedOptions.target && (
                          <div className="option-group">
                            <div className="label">Zielgruppe</div>
                            <div className="value">{item.selectedOptions.target}</div>
                          </div>
                        )}
                      </ItemOptions>

                      <ItemTotal>
                        <div className="quantity">
                          <span>Anzahl:</span>
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="qty">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            +
                          </button>
                        </div>
                        <div className="price">{formatPrice(item.price * item.quantity)}</div>
                      </ItemTotal>
                    </CartItemCard>
                  )
                })}
              </>
            )}
          </CartItemsSection>

          {items.length > 0 && (
            <OrderSummary>
              <SummaryTitle>Bestellübersicht</SummaryTitle>
              
              <UrgencyBanner>
                <div className="title">⚡ Sofortstart garantiert!</div>
                <div className="subtitle">Lieferung beginnt innerhalb von 30 Minuten</div>
              </UrgencyBanner>

              <SummaryRow>
                <span className="label">Zwischensumme</span>
                <span className="value">{formatPrice(subtotal)}</span>
              </SummaryRow>

              <SummaryRow className="total">
                <span className="label">Gesamt</span>
                <span className="value">{formatPrice(finalTotal)}</span>
              </SummaryRow>

              <TrustBadges>
                <TrustBadge>
                  <span className="icon">🔒</span>
                  Sicher
                </TrustBadge>
                <TrustBadge>
                  <span className="icon">⚡</span>
                  Sofort
                </TrustBadge>
                <TrustBadge>
                  <span className="icon">🛡️</span>
                  Garantie
                </TrustBadge>
              </TrustBadges>

              <CheckoutButton 
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? '🔄 Wird verarbeitet...' : '🚀 Jetzt kaufen - Sofortstart!'}
              </CheckoutButton>

              <ContinueShoppingButton href="/">
                ← Weiter einkaufen
              </ContinueShoppingButton>

              <PaymentMethods>
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwM0VBMSIvPgo8dGV4dCB4PSI3IiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IndoaXRlIj5QYXlQYWw8L3RleHQ+Cjwvc3ZnPg==" alt="PayPal" />
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzFFNzNCRSIvPgo8dGV4dCB4PSIxMCIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0id2hpdGUiPlZJU0E8L3RleHQ+Cjwvc3ZnPg==" alt="Visa" />
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0VCMDAxQiIvPgo8dGV4dCB4PSI2IiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IndoaXRlIj5NYXN0ZXI8L3RleHQ+Cjwvc3ZnPg==" alt="Mastercard" />
              </PaymentMethods>
            </OrderSummary>
          )}
        </Container>
      </CartContainer>
    </Layout>
  )
}

export default CartPage