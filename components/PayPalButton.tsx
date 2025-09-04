import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '../lib/CartContext'
import styled from 'styled-components'
import dynamic from 'next/dynamic'

// Lazy load PayPal script only when needed
const loadPayPalScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window !== 'undefined' && window.paypal) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=EUR&disable-funding=credit,card`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('PayPal SDK failed to load'))
    document.body.appendChild(script)
  })
}

declare global {
  interface Window {
    paypal?: any
  }
}

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

const LoadingOverlay = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 14px;
  color: #4a5568;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  z-index: 10;
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

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  currency = 'EUR',
  disabled = false,
  orderData,
  onSuccess,
  onError,
  onCancel
}) => {
  const paypalRef = useRef<HTMLDivElement>(null)
  const buttonRendered = useRef(false)
  const { clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    let cleanup: (() => void) | undefined

    const loadPayPalScript = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check if PayPal script is already loaded
        if (window.paypal) {
          renderPayPalButton()
          return
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector(`script[src*="paypal.com/sdk/js"]`)
        if (existingScript) {
          // Wait for existing script to load
          existingScript.addEventListener('load', () => {
            if (window.paypal) {
              renderPayPalButton()
            }
          })
          return
        }

        // Load PayPal script
        const script = document.createElement('script')
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}&intent=capture&disable-funding=credit,card`
        script.async = true
        
        script.onload = () => {
          if (window.paypal) {
            renderPayPalButton()
          } else {
            setError('PayPal SDK konnte nicht geladen werden.')
            setIsLoading(false)
          }
        }

        script.onerror = () => {
          setError('Fehler beim Laden der PayPal SDK.')
          setIsLoading(false)
        }

        document.head.appendChild(script)

        cleanup = () => {
          // Reset button rendered flag on cleanup
          buttonRendered.current = false
        }
      } catch (err) {
        setError('Unerwarteter Fehler beim Laden von PayPal.')
        setIsLoading(false)
      }
    }

    const renderPayPalButton = () => {
      if (!paypalRef.current || !window.paypal || buttonRendered.current) return

      // Clear existing buttons
      paypalRef.current.innerHTML = ''

      try {
        buttonRendered.current = true
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 55,
            tagline: false
          },

          // Create order on PayPal
          createOrder: async () => {
            try {
              setIsProcessing(true)
              setError(null)

              const response = await fetch('/api/payments/paypal/create-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
              })

              const data = await response.json()

              if (!response.ok || !data.success) {
                throw new Error(data.error || 'Fehler beim Erstellen der PayPal-Bestellung')
              }

              return data.orderId
            } catch (err) {
              console.error('PayPal create order error:', err)
              setError(err instanceof Error ? err.message : 'Fehler beim Erstellen der Bestellung')
              setIsProcessing(false)
              throw err
            }
          },

          // Handle successful payment
          onApprove: async (data: any) => {
            try {
              setIsProcessing(true)
              setError(null)

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

              // Clear cart
              clearCart()

              // Store order info for success page
              localStorage.setItem('lastOrderId', result.wooCommerceOrderId?.toString() || '')
              localStorage.setItem('lastOrderNumber', `WC-${result.wooCommerceOrderId}` || '')
              localStorage.setItem('paypalTransactionId', result.paypalTransactionId || '')
              localStorage.setItem('paypalOrderId', result.paypalOrderId || '')
              localStorage.setItem('paymentAmount', result.amount?.value || orderData.totalAmount)
              localStorage.setItem('paymentCurrency', result.amount?.currency_code || currency)
              localStorage.setItem('customerEmail', orderData.customerInfo.email)

              // Call success callback
              if (onSuccess) {
                onSuccess(result)
              }

              // Redirect to success page
              router.push('/checkout/success')

            } catch (err) {
              console.error('PayPal capture error:', err)
              setError(err instanceof Error ? err.message : 'Fehler bei der Zahlungsabwicklung')
              
              if (onError) {
                onError(err)
              }
            } finally {
              setIsProcessing(false)
            }
          },

          // Handle payment cancellation
          onCancel: (data: any) => {
            console.log('PayPal payment cancelled:', data)
            setIsProcessing(false)
            
            if (onCancel) {
              onCancel()
            }
          },

          // Handle payment errors
          onError: (err: any) => {
            console.error('PayPal error:', err)
            setError('Ein Fehler ist bei der PayPal-Zahlung aufgetreten.')
            setIsProcessing(false)
            
            if (onError) {
              onError(err)
            }
          }
        }).render(paypalRef.current)

        setIsLoading(false)
      } catch (err) {
        console.error('PayPal button render error:', err)
        setError('Fehler beim Rendern der PayPal-Schaltfläche.')
        setIsLoading(false)
      }
    }

    if (!disabled) {
      loadPayPalScript()
    }

    return cleanup
  }, [amount, currency, disabled, orderData, onSuccess, onError, onCancel, clearCart, router])

  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <PayPalContainer $disabled={disabled || isLoading}>
        <div ref={paypalRef} />
        
        <LoadingOverlay $show={isLoading || isProcessing}>
          {isLoading ? 'PayPal wird geladen...' : 'Zahlung wird verarbeitet...'}
        </LoadingOverlay>
      </PayPalContainer>
    </>
  )
}

export default PayPalButton