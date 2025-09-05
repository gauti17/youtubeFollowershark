import type { NextApiRequest, NextApiResponse } from 'next'
import { paypalService } from '../../../../lib/paypalService'
import { products, calculatePrice } from '../../../../data/products'

interface CreateOrderRequest {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log(`[PayPal Create Order] Method not allowed: ${req.method}`)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const startTime = Date.now()
  console.log(`[PayPal Create Order] Request received at ${new Date().toISOString()}`)

  try {
    const { items, customerInfo, totalAmount }: CreateOrderRequest = req.body

    if (!items || !customerInfo || !totalAmount) {
      console.error(`[PayPal Create Order] Missing required fields:`, {
        items: !!items,
        customerInfo: !!customerInfo,
        totalAmount: !!totalAmount
      })
      return res.status(400).json({ error: 'Missing required fields' })
    }

    console.log(`[PayPal Create Order] Processing order for ${customerInfo.email} with ${items.length} items, total: ${totalAmount}€`)

    // Generate unique order number
    const orderNumber = `YS${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    console.log(`[PayPal Create Order] Generated order number: ${orderNumber}`)

    // For PayPal, create a single consolidated item to avoid rounding issues
    // This prevents ITEM_TOTAL_MISMATCH errors caused by unit price calculations
    let calculatedTotal = 0
    let orderDescription = []

    console.log(`[PayPal Create Order] Processing ${items.length} items`)

    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        console.error(`[PayPal Create Order] Product not found: ${item.productId}`)
        return res.status(400).json({ error: `Product not found: ${item.productId}` })
      }

      console.log(`[PayPal Create Order] Processing product: ${product.name}`)

      // Get pricing options
      let speedPrice = 0
      let targetPrice = 0

      // Get speed option price
      if (item.selectedOptions.speed && product.speedOptions) {
        const speedOption = product.speedOptions.find(opt => opt.id === item.selectedOptions.speed)
        if (speedOption) {
          speedPrice = speedOption.price
          console.log(`[PayPal Create Order] Speed option: ${speedOption.name} (+€${speedPrice})`)
        }
      }

      // Get target option price  
      if (item.selectedOptions.target && product.targetOptions) {
        const targetOption = product.targetOptions.find(opt => opt.id === item.selectedOptions.target)
        if (targetOption) {
          targetPrice = targetOption.price
          console.log(`[PayPal Create Order] Target option: ${targetOption.name} (+€${targetPrice})`)
        }
      }

      const actualQuantity = item.selectedOptions.selectedQuantity || item.quantity
      console.log(`[PayPal Create Order] Quantity: ${actualQuantity}`)

      // Use the same pricing calculation as frontend
      const pricing = calculatePrice(product.basePrice, actualQuantity, speedPrice, targetPrice)
      const itemTotal = pricing.total

      console.log(`[PayPal Create Order] Pricing calculation:`, {
        basePrice: product.basePrice,
        quantity: actualQuantity,
        speedPrice,
        targetPrice,
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        discountAmount: pricing.discountAmount,
        total: pricing.total
      })

      // Add to order description for the consolidated item
      orderDescription.push(`${actualQuantity}x ${product.name}`)
      calculatedTotal += itemTotal
    }

    // Create a single consolidated item for PayPal to avoid rounding issues
    const processedItems = [{
      name: `youshark Order - ${orderDescription.join(', ')}`,
      quantity: "1",
      unitAmount: calculatedTotal.toFixed(2),
      sku: orderNumber
    }]

    console.log(`[PayPal Create Order] Calculated total: €${calculatedTotal.toFixed(2)}`)

    // Verify total matches
    const totalDifference = Math.abs(calculatedTotal - parseFloat(totalAmount))
    if (totalDifference > 0.01) {
      console.error(`[PayPal Create Order] Total amount mismatch:`, {
        calculated: calculatedTotal.toFixed(2),
        provided: totalAmount,
        difference: totalDifference.toFixed(4)
      })
      return res.status(400).json({ 
        error: 'Total amount mismatch',
        calculated: calculatedTotal.toFixed(2),
        provided: totalAmount
      })
    }

    console.log(`[PayPal Create Order] Items processed successfully, calculated total: ${calculatedTotal.toFixed(2)}€`)

    // Create PayPal order
    console.log(`[PayPal Create Order] Creating PayPal order...`)
    const paypalOrder = await paypalService.createOrder({
      amount: parseFloat(totalAmount).toFixed(2),
      currency: 'EUR',
      orderNumber,
      items: processedItems,
      customerInfo
    })

    if (!paypalOrder.success) {
      console.error(`[PayPal Create Order] Failed to create PayPal order:`, paypalOrder.error)
      return res.status(500).json({ 
        error: 'Failed to create PayPal order',
        details: paypalOrder.error
      })
    }

    const processingTime = Date.now() - startTime
    console.log(`[PayPal Create Order] Order created successfully in ${processingTime}ms:`, {
      orderId: paypalOrder.orderId,
      orderNumber,
      amount: totalAmount,
      customerEmail: customerInfo.email
    })

    // Return order details
    res.status(200).json({
      success: true,
      orderId: paypalOrder.orderId,
      orderNumber,
      amount: totalAmount,
      currency: 'EUR'
    })

  } catch (error: any) {
    const processingTime = Date.now() - startTime
    console.error(`[PayPal Create Order] Error after ${processingTime}ms:`, error)
    console.error(`[PayPal Create Order] Stack trace:`, error.stack)
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    })
  }
}