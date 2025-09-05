/**
 * PayPal Service for handling payments using REST API
 */
export class PayPalService {
  private baseUrl: string
  private clientId: string
  private clientSecret: string

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || ''
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || ''
    const environmentName = process.env.PAYPAL_ENVIRONMENT || 'sandbox'

    if (!this.clientId || !this.clientSecret) {
      throw new Error('PayPal credentials are required. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.')
    }

    // Set base URL based on environment
    this.baseUrl = environmentName === 'live' 
      ? 'https://api.paypal.com' 
      : 'https://api.sandbox.paypal.com'
  }

  /**
   * Create PayPal order
   */
  async createOrder(orderData: {
    amount: string
    currency: string
    orderNumber: string
    items: Array<{
      name: string
      quantity: string
      unitAmount: string
      sku?: string
    }>
    customerInfo?: {
      email?: string
      firstName?: string
      lastName?: string
    }
  }) {
    try {
      const accessToken = await this.getAccessToken()
      
      // Use the provided amount that was already validated in the API endpoint
      // Don't recalculate here as it can cause price discrepancies
      const finalItemTotal = parseFloat(orderData.amount).toFixed(2)
      
      // For debugging, log the item calculation vs provided amount
      const calculatedItemTotal = orderData.items.reduce((total, item) => {
        const itemTotal = parseFloat(item.unitAmount) * parseInt(item.quantity)
        return total + itemTotal
      }, 0)
      
      console.log(`[PayPal Service] Amount validation:`, {
        providedAmount: orderData.amount,
        finalAmountUsed: finalItemTotal,
        recalculatedItemTotal: calculatedItemTotal.toFixed(2),
        matchesProvided: Math.abs(calculatedItemTotal - parseFloat(orderData.amount)) < 0.01,
        itemsBreakdown: orderData.items.map(item => ({
          name: item.name,
          unitAmount: item.unitAmount,
          quantity: item.quantity,
          itemTotal: (parseFloat(item.unitAmount) * parseInt(item.quantity)).toFixed(2)
        }))
      })
      
      const createOrderRequest = {
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: orderData.orderNumber,
          amount: {
            currency_code: orderData.currency,
            value: finalItemTotal,
            breakdown: {
              item_total: {
                currency_code: orderData.currency,
                value: finalItemTotal
              }
            }
          },
          items: orderData.items.map(item => ({
            name: item.name,
            unit_amount: {
              currency_code: orderData.currency,
              value: item.unitAmount
            },
            quantity: item.quantity,
            sku: item.sku || item.name.toLowerCase().replace(/\s+/g, '_')
          })),
          description: `youshark Order #${orderData.orderNumber}`
        }],
        application_context: {
          brand_name: 'youshark',
          landing_page: 'BILLING',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/cancel`
        },
        ...(orderData.customerInfo && {
          payer: {
            email_address: orderData.customerInfo.email,
            name: {
              given_name: orderData.customerInfo.firstName,
              surname: orderData.customerInfo.lastName
            }
          }
        })
      }

      console.log(`[PayPal Service] Creating order with data:`, {
        amount: orderData.amount,
        currency: orderData.currency,
        orderNumber: orderData.orderNumber,
        itemsCount: orderData.items.length
      })

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken
        },
        body: JSON.stringify(createOrderRequest)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[PayPal Service] Order creation failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          requestData: createOrderRequest
        })
        throw new Error(`PayPal API error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log(`[PayPal Service] Order created successfully:`, {
        orderId: result.id,
        status: result.status
      })

      return {
        success: true,
        orderId: result.id,
        status: result.status,
        links: result.links
      }
    } catch (error) {
      console.error('PayPal create order error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown PayPal error'
      }
    }
  }

  /**
   * Capture PayPal payment
   */
  async capturePayment(orderId: string) {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken
        },
        body: JSON.stringify({})
      })

      if (!response.ok) {
        throw new Error(`PayPal API error: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        orderId: result.id,
        status: result.status,
        captureId: result.purchase_units[0]?.payments?.captures?.[0]?.id,
        amount: result.purchase_units[0]?.payments?.captures?.[0]?.amount,
        payerInfo: result.payer,
        transactionId: result.purchase_units[0]?.payments?.captures?.[0]?.id
      }
    } catch (error) {
      console.error('PayPal capture payment error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment capture failed'
      }
    }
  }

  /**
   * Get order details
   */
  async getOrderDetails(orderId: string) {
    try {
      const accessToken = await this.getAccessToken()
      
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken
        }
      })

      if (!response.ok) {
        throw new Error(`PayPal API error: ${response.status}`)
      }

      const orderDetails = await response.json()
      return {
        success: true,
        order: orderDetails
      }
    } catch (error) {
      console.error('Get PayPal order details error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get order details'
      }
    }
  }

  /**
   * Get PayPal access token for API calls
   */
  private async getAccessToken(): Promise<string> {
    try {
      console.log(`[PayPal Service] Getting access token from ${this.baseUrl}`)
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
      
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[PayPal Service] Token request failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        })
        throw new Error(`PayPal token request failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      
      if (!data.access_token) {
        console.error(`[PayPal Service] No access token in response:`, data)
        throw new Error('PayPal did not return access token')
      }

      console.log(`[PayPal Service] Access token obtained successfully`)
      return `Bearer ${data.access_token}`
    } catch (error) {
      console.error(`[PayPal Service] Error getting access token:`, error)
      throw error
    }
  }

  /**
   * Verify webhook signature (for webhook endpoints)
   */
  async verifyWebhookSignature(
    authAlgo: string,
    transmission_id: string,
    cert_id: string,
    auth_signature: string,
    webhook_body: string,
    webhook_id: string
  ): Promise<boolean> {
    try {
      // Use PayPal's webhook verification API
      const verificationData = {
        auth_algo: authAlgo,
        cert_id: cert_id,
        transmission_id: transmission_id,
        webhook_id: webhook_id,
        webhook_event: JSON.parse(webhook_body)
      }

      const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': await this.getAccessToken()
        },
        body: JSON.stringify(verificationData)
      })

      if (!response.ok) {
        console.error('PayPal webhook verification failed:', response.status, await response.text())
        return false
      }

      const result = await response.json()
      return result.verification_status === 'SUCCESS'
      
    } catch (error) {
      console.error('Webhook verification error:', error)
      return false
    }
  }
}

// Export singleton instance
export const paypalService = new PayPalService()

// Types for better TypeScript support
export interface PayPalOrderResponse {
  success: boolean
  orderId?: string
  status?: string
  links?: Array<{
    href: string
    rel: string
    method: string
  }>
  error?: string
}

export interface PayPalCaptureResponse {
  success: boolean
  orderId?: string
  status?: string
  captureId?: string
  amount?: {
    currency_code: string
    value: string
  }
  payerInfo?: any
  transactionId?: string
  error?: string
}