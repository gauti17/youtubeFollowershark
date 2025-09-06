import type { NextApiRequest, NextApiResponse } from 'next'
import { paypalService } from '../../../../lib/paypalService'
// No runtime export needed for Vercel - uses Node.js by default
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
      // For WooCommerce, we need to re-calculate the cart items with prices
      // since the orderData from frontend doesn't include calculated prices
      console.log('[Capture Order] Calculating cart item prices for WooCommerce...')
      
      const cartItems = []
      for (const item of orderData.items) {
        const { products, calculatePrice } = await import('../../../../data/products')
        const product = products.find(p => p.id === item.productId)
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`)
        }

        // Get option prices using same logic as PayPal create-order
        let speedPrice = 0
        let targetPrice = 0

        if (item.selectedOptions.speed && product.speedOptions) {
          const speedOption = product.speedOptions.find(opt => 
            opt.name === item.selectedOptions.speed || opt.id === item.selectedOptions.speed
          )
          if (speedOption) {
            speedPrice = speedOption.price
            console.log(`[Capture Order] Found speed option: ${speedOption.name} (+€${speedPrice})`)
          }
        }

        if (item.selectedOptions.target && product.targetOptions) {
          const targetOption = product.targetOptions.find(opt => 
            opt.name === item.selectedOptions.target || opt.id === item.selectedOptions.target
          )
          if (targetOption) {
            targetPrice = targetOption.price
            console.log(`[Capture Order] Found target option: ${targetOption.name} (+€${targetPrice})`)
          }
        }

        // Calculate using EXACT same logic as PayPal create-order
        const selectedQuantity = item.selectedOptions.selectedQuantity || item.quantity
        const serviceQuantity = selectedQuantity / item.quantity
        const pricing = calculatePrice(product.basePrice, serviceQuantity, 0, targetPrice)
        const unitPrice = pricing.total + speedPrice
        const itemTotal = unitPrice * item.quantity

        console.log(`[Capture Order] Price calculation for ${product.name}:`, {
          selectedQuantity,
          serviceQuantity,
          cartQuantity: item.quantity,
          basePrice: product.basePrice,
          targetPrice,
          speedPrice,
          pricingTotal: pricing.total,
          unitPrice,
          itemTotal
        })

        cartItems.push({
          id: `${item.productId}_${Date.now()}`,
          productId: item.productId,
          quantity: item.quantity,
          price: itemTotal, // This should now have the calculated total
          selectedOptions: item.selectedOptions,
          timestamp: Date.now()
        })
      }

      console.log('[Capture Order] Final cart items:', cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })))

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