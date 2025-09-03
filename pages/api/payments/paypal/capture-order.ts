import type { NextApiRequest, NextApiResponse } from 'next'
import { paypalService } from '../../../../lib/paypalService'
import { orderService } from '../../../../lib/orderService'

interface CaptureOrderRequest {
  orderId: string
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
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log(`[PayPal Capture Order] Method not allowed: ${req.method}`)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const startTime = Date.now()
  console.log(`[PayPal Capture Order] Request received at ${new Date().toISOString()}`)

  try {
    const { orderId, orderData }: CaptureOrderRequest = req.body

    if (!orderId || !orderData) {
      console.error(`[PayPal Capture Order] Missing required fields:`, {
        orderId: !!orderId,
        orderData: !!orderData
      })
      return res.status(400).json({ error: 'Missing required fields' })
    }

    console.log(`[PayPal Capture Order] Processing capture for order: ${orderId}, customer: ${orderData.customerInfo.email}`)

    // Capture PayPal payment
    console.log(`[PayPal Capture Order] Capturing PayPal payment...`)
    const captureResult = await paypalService.capturePayment(orderId)

    if (!captureResult.success) {
      console.error(`[PayPal Capture Order] Payment capture failed:`, captureResult.error)
      return res.status(400).json({
        error: 'Payment capture failed',
        details: captureResult.error
      })
    }

    console.log(`[PayPal Capture Order] Payment captured successfully:`, {
      transactionId: captureResult.transactionId,
      amount: captureResult.amount,
      status: captureResult.status
    })

    try {
      // Convert cart items to the format expected by orderService
      const cartItems = orderData.items.map(item => ({
        id: `${item.productId}_${Date.now()}`,
        productId: item.productId,
        quantity: item.selectedOptions.selectedQuantity || item.quantity,
        price: 0, // Will be calculated by orderService
        selectedOptions: item.selectedOptions,
        timestamp: Date.now()
      }))

      // Create order in WooCommerce
      const wooCommerceOrder = await orderService.createOrder(
        cartItems,
        {
          firstName: orderData.customerInfo.firstName,
          lastName: orderData.customerInfo.lastName,
          email: orderData.customerInfo.email,
          country: orderData.customerInfo.country,
          city: orderData.customerInfo.city,
          postalCode: orderData.customerInfo.postalCode,
          phone: orderData.customerInfo.phone
        },
        {
          paymentMethod: 'paypal',
          paymentMethodTitle: 'PayPal',
          customerNote: `PayPal Transaction ID: ${captureResult.transactionId}`
        }
      )

      if (!wooCommerceOrder.success) {
        console.error('WooCommerce order creation failed:', wooCommerceOrder.error)
        // Payment was captured, but WooCommerce order failed
        // In production, you should handle this by either:
        // 1. Refunding the PayPal payment, or
        // 2. Manually creating the order and notifying support
      }

      return res.status(200).json({
        success: true,
        paypalOrderId: orderId,
        paypalTransactionId: captureResult.transactionId,
        paypalStatus: captureResult.status,
        wooCommerceOrderId: wooCommerceOrder.orderId,
        amount: captureResult.amount,
        message: 'Payment successful! Your order has been processed.'
      })

    } catch (orderError) {
      console.error('Order processing error after successful payment:', orderError)
      
      // Payment was successful but order processing failed
      return res.status(200).json({
        success: true,
        paypalOrderId: orderId,
        paypalTransactionId: captureResult.transactionId,
        paypalStatus: captureResult.status,
        amount: captureResult.amount,
        warning: 'Payment successful but order processing encountered issues. Support will be notified.',
        message: 'Payment completed successfully.'
      })
    }

  } catch (error: any) {
    console.error('Capture PayPal order error:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}