import React, { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { useCart } from '../lib/CartContext'
import { formatPrice as formatPriceUtil } from '../lib/formatUtils'
import { products } from '../data/products'
import { useRouter } from 'next/router'
import { orderService } from '../lib/orderService'
import { ButtonWithSpinner, LoadingOverlay, FormSkeleton } from '../components/Loading'
import PayPalButton from '../components/PayPalButton'

const CheckoutContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px 0;
`

const Container = styled.div`
  max-width: 1400px;
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

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 30px;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    color: #374151;
  }
`

const CheckoutHeader = styled.div`
  margin-bottom: 40px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
    font-family: 'Inter', sans-serif;
    
    @media (max-width: 768px) {
      font-size: 24px;
      margin-bottom: 16px;
    }
  }
  
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`

const StepsIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 40px;
  
  .step {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    
    &.active {
      color: #f59e0b;
      font-weight: 600;
    }
    
    &.completed {
      color: #10b981;
    }
    
    &.inactive {
      color: #9ca3af;
    }
  }
  
  .separator {
    color: #d1d5db;
    margin: 0 4px;
  }
`

const PaymentSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 24px;
    font-family: 'Inter', sans-serif;
    
    @media (max-width: 768px) {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }
`

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
`

const PaymentMethod = styled.div<{ selected: boolean }>`
  border: 2px solid ${props => props.selected ? '#7c3aed' : '#e5e7eb'};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? '#f3f4f6' : 'white'};
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  &:hover {
    border-color: ${props => props.selected ? '#7c3aed' : '#d1d5db'};
  }
  
  .method-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    
    @media (max-width: 480px) {
      align-items: flex-start;
      gap: 12px;
    }
    
    .method-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      
      @media (max-width: 480px) {
        align-items: flex-start;
      }
      
      .icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        font-size: 18px;
        flex-shrink: 0;
      }
      
      .details {
        flex: 1;
        
        h4 {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
          font-family: 'Inter', sans-serif;
          
          @media (max-width: 480px) {
            font-size: 15px;
          }
        }
        
        p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-family: 'Inter', sans-serif;
          
          @media (max-width: 480px) {
            font-size: 13px;
            line-height: 1.4;
          }
        }
      }
    }
    
    .radio {
      width: 20px;
      height: 20px;
      border: 2px solid #d1d5db;
      border-radius: 50%;
      position: relative;
      flex-shrink: 0;
      margin-top: 2px;
      
      ${props => props.selected && `
        border-color: #7c3aed;
        
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: #7c3aed;
          border-radius: 50%;
        }
      `}
    }
  }
  
  .method-description {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.5;
    font-family: 'Inter', sans-serif;
    
    @media (max-width: 480px) {
      font-size: 13px;
      margin-top: 8px;
    }
  }
`

const BillingSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 16px;
  }
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 16px;
    font-family: 'Inter', sans-serif;
    
    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`

const FormGroup = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
    font-family: 'Inter', sans-serif;
    
    .required {
      color: #ef4444;
    }
  }
  
  input, select {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }
    
    &::placeholder {
      color: #9ca3af;
    }
  }
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const OrderSummary = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
  
  @media (max-width: 1024px) {
    position: static;
    margin-top: 20px;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`

const SummaryHeader = styled.div`
  margin-bottom: 24px;
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
    font-family: 'Inter', sans-serif;
  }
  
  .item-count {
    font-size: 14px;
    color: #6b7280;
    font-family: 'Inter', sans-serif;
  }
`

const OrderItems = styled.div`
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 24px;
`

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .item-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: white;
  }
  
  .item-details {
    flex: 1;
    
    .name {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
      font-family: 'Inter', sans-serif;
    }
    
    .quantity {
      font-size: 14px;
      color: #6b7280;
      font-family: 'Inter', sans-serif;
    }
  }
  
  .item-price {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    font-family: 'Inter', sans-serif;
  }
`


const PricingBreakdown = styled.div`
  margin-bottom: 32px;
`

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-family: 'Inter', sans-serif;
  
  &.total {
    border-top: 1px solid #e5e7eb;
    padding-top: 16px;
    margin-top: 16px;
    margin-bottom: 0;
    
    .label {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }
    
    .value {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
    }
  }
  
  .label {
    font-size: 16px;
    color: #6b7280;
  }
  
  .value {
    font-size: 16px;
    font-weight: 500;
    color: #111827;
    
    &.discount {
      color: #10b981;
    }
  }
`

const CheckoutButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  font-family: 'Inter', sans-serif;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 12px;
    flex-direction: column;
    gap: 4px;
    line-height: 1.4;
  }
  
  .icon {
    color: #10b981;
  }
`

const CouponSection = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`

const CouponInputGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
  }
`

const CouponInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  
  &:focus {
    outline: none;
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
`

const CouponButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'loading'
})<{ loading?: boolean }>`
  padding: 12px 16px;
  background: #FF6B35;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => props.loading ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.loading ? 0.7 : 1};
  font-family: 'Inter', sans-serif;
  min-width: 100px;
  
  &:hover:not(:disabled) {
    background: #e55a2b;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const CouponError = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 8px;
`

const AppliedCoupon = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  font-size: 14px;
  color: #0369a1;
  
  .coupon-info {
    font-weight: 600;
  }
  
  .remove-btn {
    color: #ef4444;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    
    &:hover {
      background: #fef2f2;
    }
  }
`

const CheckoutPage: React.FC = () => {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [selectedPayment, setSelectedPayment] = useState('paypal')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: 'Deutschland',
    city: '',
    postalCode: ''
  })

  const formatPrice = (price: number) => {
    return formatPriceUtil(price)
  }

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const getProductInfo = (productId: string) => {
    return products.find(p => p.id === productId)
  }

  const subtotal = total
  const processing = 0 // No processing fees
  const discount = appliedCoupon ? appliedCoupon.discount_amount : 0
  const finalTotal = subtotal - discount

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Bitte geben Sie einen Coupon-Code ein')
      return
    }

    setCouponLoading(true)
    setCouponError('')

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          cartTotal: subtotal
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCouponError(data.error || 'Fehler bei der Coupon-Validierung')
        return
      }

      setAppliedCoupon(data.coupon)
      setCouponError('')
      
    } catch (error) {
      console.error('Coupon validation error:', error)
      setCouponError('Netzwerkfehler bei der Coupon-Validierung')
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    try {
      // Validate form data
      if (!formData.fullName || !formData.email || !formData.country) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.')
        setIsProcessing(false)
        return
      }

      // Create order via API endpoint (more secure)
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: items,
          formData: {
            firstName: formData.fullName.split(' ')[0] || formData.fullName,
            lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
            email: formData.email,
            country: formData.country,
            city: formData.city,
            postalCode: formData.postalCode
          },
          options: {
            paymentMethod: selectedPayment,
            paymentMethodTitle: getPaymentMethodTitle(selectedPayment),
            couponCode: appliedCoupon ? appliedCoupon.code : undefined,
            discountAmount: discount,
            couponData: appliedCoupon
          }
        })
      })

      const result = await response.json()

      if (result.success && result.orderId) {
        console.log(`Order created successfully: #${result.orderNumber} (ID: ${result.orderId})`)
        console.log(`Customer account: ${result.customerCreated ? 'New account created' : 'Existing account used'} (ID: ${result.customerId})`)
        
        // Store order info in localStorage for success page
        localStorage.setItem('lastOrderId', result.orderId.toString())
        localStorage.setItem('lastOrderNumber', result.orderNumber || '')
        localStorage.setItem('lastCustomerId', result.customerId?.toString() || '')
        localStorage.setItem('customerCreated', result.customerCreated ? 'true' : 'false')
        localStorage.setItem('customerEmail', formData.email)
        localStorage.setItem('customerName', formData.fullName)
        
        // Show account creation message if applicable
        if (result.customerCreated) {
          alert('🎉 Bestellung erfolgreich!\n\nEin Kundenaccount wurde automatisch für Sie erstellt. Sie erhalten in wenigen Minuten eine E-Mail mit Ihren Zugangsdaten.')
        }
        
        // Clear cart
        clearCart()
        
        // Redirect to success page
        router.push('/success')
      } else {
        throw new Error(result.error || 'Fehler beim Erstellen der Bestellung')
      }
      
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Es gab einen Fehler bei der Bestellung. Bitte versuchen Sie es erneut.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getPaymentMethodTitle = (method: string): string => {
    switch (method) {
      case 'paypal':
        return 'PayPal'
      case 'klarna':
        return 'Sofortüberweisung'
      default:
        return 'Manuell'
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getPayPalOrderData = () => {
    return {
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions
      })),
      customerInfo: {
        email: formData.email,
        firstName: formData.fullName.split(' ')[0] || formData.fullName,
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
        country: formData.country,
        city: formData.city || '',
        postalCode: formData.postalCode || ''
      },
      totalAmount: finalTotal.toFixed(2)
    }
  }

  const handlePayPalSuccess = (data: any) => {
    console.log('PayPal payment successful:', data)
    // Success handling is done in PayPalButton component
  }

  const handlePayPalError = (error: any) => {
    console.error('PayPal payment error:', error)
  }

  const handlePayPalCancel = () => {
    console.log('PayPal payment cancelled')
  }

  const isFormValid = () => {
    return formData.fullName && 
           formData.email && 
           formData.country
  }


  if (items.length === 0) {
    return (
      <Layout title="Kasse - youshark">
        <CheckoutContainer>
          <Container style={{ gridTemplateColumns: '1fr', textAlign: 'center', padding: '100px 20px' }}>
            <h1>Ihr Warenkorb ist leer</h1>
            <p>Fügen Sie Services zu Ihrem Warenkorb hinzu, bevor Sie zur Kasse gehen.</p>
            <Link href="/shop" style={{ color: '#7c3aed', textDecoration: 'none' }}>
              → Zurück zum Shop
            </Link>
          </Container>
        </CheckoutContainer>
      </Layout>
    )
  }

  return (
    <Layout 
      title="Kasse - youshark" 
      description="Schließen Sie Ihre Bestellung ab und starten Sie noch heute mit YouTube Growth Services."
    >
      <CheckoutContainer>
        <Container>
          <div>
            <BackButton href="/cart">
              ← Warenkorb
            </BackButton>

            <CheckoutHeader>
              <h1>Deine Bestellung abschließen</h1>
            </CheckoutHeader>

            <StepsIndicator>
              <div className="step completed">
                <span>✓</span>
                <span>Warenkorb</span>
              </div>
              <span className="separator">—</span>
              <div className="step active">
                <span>📦</span>
                <span>Zahlung</span>
              </div>
            </StepsIndicator>

            <BillingSection>
              <h3>Rechnungsempfänger</h3>
              
              <FormRow>
                <FormGroup>
                  <label>
                    Vollständiger Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Max Mustermann"
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <label>
                    E-Mail-Adresse <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="max@beispiel.de"
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <label>
                    Land <span className="required">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Deutschland">Deutschland</option>
                    <option value="Österreich">Österreich</option>
                    <option value="Schweiz">Schweiz</option>
                  </select>
                </FormGroup>
                
                <FormGroup>
                  <label>
                    Stadt
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Berlin"
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <label>
                    Postleitzahl
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="10115"
                  />
                </FormGroup>
                
                <FormGroup style={{ visibility: 'hidden' }}>
                  {/* Empty space for alignment */}
                </FormGroup>
              </FormRow>
            </BillingSection>

            <PaymentSection>
              <h2>Zahlungsmethode wählen</h2>
              
              <PaymentMethods>
                <PaymentMethod 
                  selected={selectedPayment === 'paypal'}
                  onClick={() => setSelectedPayment('paypal')}
                >
                  <div className="method-header">
                    <div className="method-info">
                      <div className="icon" style={{ background: '#0070ba' }}>
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuMDc2IDIxLjMzN0g0LjM1M0wyLjIyIDcuNjk5SDcuMThDNy44MzYgNy42OTkgOC40MjggNy45MzMgOC45NTUgOC40MDJDOS40ODIgOC44NzEgOS43NDYgOS41MjcgOS43NDYgMTAuMzcxVjEwLjk2NEM5Ljc0NiAxMS44MDggOS40ODIgMTIuNDY0IDguOTU1IDEyLjkzM0M4LjQyOCAxMy40MDIgNy44MzYgMTMuNjM2IDcuMTggMTMuNjM2SDUuODQ3TDUuMzIgMTYuNjk5SDYuOTA2QzcuNTYyIDE2LjY5OSA4LjE1NCAxNi45MzMgOC42ODEgMTcuNDAyQzkuMjA4IDE3Ljg3MSA5LjQ3MiAxOC41MjcgOS40NzIgMTkuMzcxVjE5Ljk2NEM5LjQ3MiAyMC44MDggOS4yMDggMjEuNDY0IDguNjgxIDIxLjkzM0M4LjE1NCAyMi40MDIgNy41NjIgMjIuNjM2IDYuOTA2IDIyLjYzNkg0LjM1M1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=" alt="PayPal" style={{ width: '20px', height: '20px' }} />
                      </div>
                      <div className="details">
                        <h4>PayPal</h4>
                        <p>Zahle mit PayPal</p>
                      </div>
                    </div>
                    <div className="radio"></div>
                  </div>
                </PaymentMethod>

                <PaymentMethod 
                  selected={selectedPayment === 'klarna'}
                  onClick={() => setSelectedPayment('klarna')}
                >
                  <div className="method-header">
                    <div className="method-info">
                      <div className="icon" style={{ background: '#ff5f00' }}>
                        K
                      </div>
                      <div className="details">
                        <h4>Sofortüberweisung</h4>
                        <p>Überweise direkt an unsere Bankverbindung. Deine Bestellung wird erst nach Geldeingang auf unserem Konto versandt.</p>
                      </div>
                    </div>
                    <div className="radio"></div>
                  </div>
                  <div className="method-description">
                    Überweise direkt an unsere Bankverbindung. Bitte nutze die Bestellnummer als Verwendungszweck. Deine Bestellung wird erst nach Geldeingang auf unserem Konto versandt.
                  </div>
                </PaymentMethod>
              </PaymentMethods>
            </PaymentSection>
          </div>

          <OrderSummary>
            <SummaryHeader>
              <h3>Zusammenfassung</h3>
              <div className="item-count">
                {items.length} {items.length === 1 ? 'Service' : 'Services'}
              </div>
            </SummaryHeader>

            <OrderItems>
              {items.map((item) => {
                const product = getProductInfo(item.productId)
                if (!product) return null

                return (
                  <OrderItem key={item.id}>
                    <div className="item-icon">{product.icon}</div>
                    <div className="item-details">
                      <div className="name">{product.name}</div>
                      <div className="quantity">
                        {item.selectedOptions.selectedQuantity 
                          ? `${formatNumber(item.selectedOptions.selectedQuantity)} Stück (${item.quantity}x)`
                          : `${formatNumber(item.quantity)} Stück`
                        }
                      </div>
                    </div>
                    <div className="item-price">{formatPrice(item.price * item.quantity)}</div>
                  </OrderItem>
                )
              })}
            </OrderItems>


            <CouponSection>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
                Gutschein-Code
              </h3>
              
              {!appliedCoupon ? (
                <>
                  <CouponInputGroup>
                    <CouponInput
                      type="text"
                      placeholder="Gutschein-Code eingeben..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && validateCoupon()}
                    />
                    <CouponButton
                      onClick={validateCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      loading={couponLoading}
                    >
                      <ButtonWithSpinner loading={couponLoading} size="small">
                        Anwenden
                      </ButtonWithSpinner>
                    </CouponButton>
                  </CouponInputGroup>
                  {couponError && <CouponError>{couponError}</CouponError>}
                </>
              ) : (
                <AppliedCoupon>
                  <div className="coupon-info">
                    ✅ {appliedCoupon.code} angewendet 
                    ({appliedCoupon.discount_type === 'percent' ? `${appliedCoupon.amount}%` : `${appliedCoupon.amount}€`})
                  </div>
                  <button className="remove-btn" onClick={removeCoupon}>
                    ✕ Entfernen
                  </button>
                </AppliedCoupon>
              )}
            </CouponSection>

            <PricingBreakdown>
              <PriceRow>
                <span className="label">Zwischensumme:</span>
                <span className="value">{formatPrice(subtotal)}</span>
              </PriceRow>
              
              {discount > 0 && appliedCoupon && (
                <PriceRow>
                  <span className="label">Gutschein ({appliedCoupon.code}):</span>
                  <span className="value discount">-{formatPrice(discount)}</span>
                </PriceRow>
              )}
              
              <PriceRow className="total">
                <span className="label">Gesamt:</span>
                <span className="value">{formatPrice(finalTotal)}</span>
              </PriceRow>
            </PricingBreakdown>

            {selectedPayment === 'paypal' ? (
              <PayPalButton
                amount={finalTotal.toFixed(2)}
                currency="EUR"
                disabled={isProcessing || !isFormValid()}
                orderData={getPayPalOrderData()}
                getOrderData={getPayPalOrderData}
                onSuccess={handlePayPalSuccess}
                onError={handlePayPalError}
                onCancel={handlePayPalCancel}
              />
            ) : (
              <CheckoutButton 
                onClick={handleCheckout} 
                disabled={isProcessing || !isFormValid()}
              >
                <ButtonWithSpinner loading={isProcessing} size="medium">
                  {`${formatPrice(finalTotal)} - Bezahlen`}
                </ButtonWithSpinner>
              </CheckoutButton>
            )}

            <SecurityNote>
              <span className="icon">🔒</span>
              <span>
                Ich habe die <a href="/terms" style={{ color: '#7c3aed' }}>Allgemeinen Geschäftsbedingungen</a>, die <a href="/privacy" style={{ color: '#7c3aed' }}>Datenschutzbestimmung</a> und die <a href="/refund" style={{ color: '#7c3aed' }}>Widerrufsbelehrung</a> gelesen und akzeptiert.
              </span>
            </SecurityNote>
          </OrderSummary>
        </Container>
        <LoadingOverlay show={isProcessing} text="Bestellung wird verarbeitet..." />
      </CheckoutContainer>
    </Layout>
  )
}

export default CheckoutPage