import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '../lib/CartContext'
import styled from 'styled-components'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

interface PayPalButtonProps {
  amount: string
  currency?: string
  disabled?: boolean
  orderData: {
    items: Array<{
      productId: string
      quantity: number
      selectedOptions: {
        speed?: string
        target?: string
        url?: string
        selectedQuantity?: number
        baseServiceQuantity?: number
      }
    }>
    customerInfo: {
      email: string
      firstName: string
      lastName: string
      country: string
      city: string
      postalCode: string
      phone?: string
    }
    totalAmount: string
  }
  getOrderData?: () => any
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  onCancel?: () => void
}

const PayPalContainer = styled.div<{ $disabled: boolean }>`
  opacity: ${props => props.$disabled ? 0.6 : 1};
  pointer-events: ${props => props.$disabled ? 'none' : 'auto'};
  min-height: 55px;
  position: relative;
  
  .paypal-buttons {
    min-height: 55px;
  }
`

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  font-family: 'Inter', sans-serif;
`

const LoadingMessage = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
`

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #0369a1;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  currency = 'EUR',
  disabled = false,
  orderData,
  getOrderData,
  onSuccess,
  onError,
  onCancel
}) => {
  const router = useRouter()
  const { clearCart } = useCart()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    currency: currency,
    intent: 'capture' as const,
    disableFunding: ['credit', 'card']
  }

  const createOrder = async () => {
    try {
      setIsProcessing(true)
      setError(null)

      // Get fresh order data for validation
      const currentOrderData = getOrderData ? getOrderData() : orderData
      const { customerInfo } = currentOrderData

      console.log('PayPal - Creating order with data:', JSON.stringify(currentOrderData, null, 2))

      // Validate required fields
      if (!customerInfo.email || !customerInfo.firstName || !customerInfo.country) {
        throw new Error('Bitte füllen Sie alle erforderlichen Felder aus: Name, E-Mail und Land.')
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(customerInfo.email)) {
        throw new Error('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
      }

      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentOrderData),
      })

      const responseText = await response.text()
      console.log('PayPal - API response:', responseText.substring(0, 500))
      
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('PayPal - Failed to parse JSON response:', parseError)
        throw new Error('Server returned invalid response')
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Fehler beim Erstellen der PayPal-Bestellung')
      }

      console.log('PayPal - Order created successfully:', data.orderId)
      return data.orderId

    } catch (err) {
      console.error('PayPal create order error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Fehler beim Erstellen der Bestellung'
      setError(errorMessage)
      setIsProcessing(false)
      throw err
    }
  }

  const onApprove = async (data: any) => {
    try {
      setIsProcessing(true)
      setError(null)

      console.log('PayPal - Payment approved, capturing order:', data.orderID)

      const response = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
          orderData
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Fehler bei der Zahlungsabwicklung')
      }

      console.log('PayPal - Payment captured successfully:', result)

      // Clear cart and store order info
      clearCart()
      
      localStorage.setItem('lastOrderId', result.wooCommerceOrderId?.toString() || '')
      localStorage.setItem('lastOrderNumber', `WC-${result.wooCommerceOrderId}` || '')
      localStorage.setItem('paypalTransactionId', result.paypalTransactionId || '')
      localStorage.setItem('paypalOrderId', result.paypalOrderId || '')
      localStorage.setItem('paymentAmount', result.amount?.value || orderData.totalAmount)
      localStorage.setItem('paymentCurrency', result.amount?.currency_code || currency)
      localStorage.setItem('customerEmail', orderData.customerInfo.email)

      if (onSuccess) {
        onSuccess(result)
      }

      // Redirect to success page
      router.push('/checkout/success')

    } catch (err) {
      console.error('PayPal capture error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Fehler bei der Zahlungsabwicklung'
      setError(errorMessage)
      
      if (onError) {
        onError(err)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const onErrorHandler = (err: any) => {
    console.error('PayPal error:', err)
    setError('Ein Fehler ist bei der PayPal-Zahlung aufgetreten.')
    setIsProcessing(false)
    
    if (onError) {
      onError(err)
    }
  }

  const onCancelHandler = () => {
    console.log('PayPal payment cancelled')
    setIsProcessing(false)
    
    if (onCancel) {
      onCancel()
    }
  }

  if (!paypalOptions.clientId) {
    return <ErrorMessage>PayPal Client ID nicht konfiguriert</ErrorMessage>
  }

  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {isProcessing && (
        <LoadingMessage>
          <Spinner />
          Zahlung wird verarbeitet...
        </LoadingMessage>
      )}
      
      <PayPalContainer $disabled={disabled || isProcessing}>
        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons
            disabled={disabled || isProcessing}
            style={{
              layout: 'vertical',
              color: 'gold',
              shape: 'pill',
              label: 'paypal',
              height: 55,
              tagline: false
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onErrorHandler}
            onCancel={onCancelHandler}
          />
        </PayPalScriptProvider>
      </PayPalContainer>
    </>
  )
}

export default PayPalButton